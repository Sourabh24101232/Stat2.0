import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";
import Review from "../models/ReviewModel.js";

const hasValidBookingDates = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returned = new Date(returnDate);

    return !Number.isNaN(pickup.getTime())
        && !Number.isNaN(returned.getTime())
        && returned > pickup;
};

// Function to Check Availability of Car for a given Date using form on Home page
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
    });

    return bookings.length === 0;
};

export default checkAvailability;

// Function to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        if (!location || !hasValidBookingDates(pickupDate, returnDate)) {
            return res.status(400).json({
                success: false,
                message: "Provide a location and a return date after the pickup date.",
            });
        }

        // fetch all available cars for the given location
        const cars = await Car.find({ location, isAvailable: true });

        // Check each car's booking status
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(
                car._id,
                pickupDate,
                returnDate
            );
            return { ...car._doc, isAvailable: isAvailable };
        });
        
        //Remove unavailable cars
        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(
            (car) => car.isAvailable === true
        );

        res.json({ success: true, availableCars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Function to Create Booking
export const createBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;

        if (!car || !hasValidBookingDates(pickupDate, returnDate)) {
            return res.status(400).json({
                success: false,
                message: "Provide a car and a return date after the pickup date.",
            });
        }

        //check if available
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) return res.json({ success: false, message: "Car is not available", });

        const carData = await Car.findById(car);

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil(
            (returned - picked) / (1000 * 60 * 60 * 24)
        );
        const price = carData.pricePerDay * noOfDays;

        //use Booking model to create bookings
        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price,
        });

        res.json({ success: true, message: "Booking Created" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Function to List User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const { _id } = req.user;

        const bookings = await Booking.find({ user: _id })
            .populate("car")
            .sort({ createdAt: -1 })
            .lean();

        const reviews = await Review.find({
            booking: { $in: bookings.map((booking) => booking._id) },
        }).select("booking");
        const reviewedBookingIds = new Set(reviews.map((review) => review.booking.toString()));
        const bookingsWithReviewStatus = bookings.map((booking) => ({
            ...booking,
            hasReview: reviewedBookingIds.has(booking._id.toString()),
        }));

        res.json({ success: true, bookings: bookingsWithReviewStatus });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Function to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const bookings = await Booking.find({ owner: req.user._id })
            .populate("car user")
            .select("-user.password")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Function to change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const allowedTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["completed", "cancelled"],
        };

        if (!allowedTransitions[booking.status]?.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid booking status change" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
