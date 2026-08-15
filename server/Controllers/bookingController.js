import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";
import Review from "../models/ReviewModel.js";

const BUSINESS_TIME_ZONE = process.env.BUSINESS_TIME_ZONE || "Asia/Kolkata";
const PENDING_BOOKING_EXPIRY_HOURS = Number(process.env.PENDING_BOOKING_EXPIRY_HOURS) || 24;

const getBusinessDate = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: BUSINESS_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

    return `${values.year}-${values.month}-${values.day}`;
};

const hasValidBookingDates = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returned = new Date(returnDate);

    return !Number.isNaN(pickup.getTime())
        && !Number.isNaN(returned.getTime())
        && returned > pickup;
};

// Function to Check Availability of Car for a given Date using form on Home page
const expirePendingBookings = async (car) => {
    await Booking.updateMany(
        {
            car,
            status: "pending",
            pendingExpiresAt: { $lte: new Date() },
        },
        { $set: { status: "cancelled" } },
    );
};

const checkAvailability = async (car, pickupDate, returnDate) => {
    // Release reservations whose owner did not respond before the deadline.
    await expirePendingBookings(car);

    const bookings = await Booking.find({
        car,
        // Cancelled reservations must not keep the car unavailable.
        status: { $ne: "cancelled" },
        // The return date is checkout, so a new rental may start that day.
        pickupDate: { $lt: returnDate },
        returnDate: { $gt: pickupDate },
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

        if (getBusinessDate(new Date(pickupDate)) < getBusinessDate()) {
            return res.status(400).json({
                success: false,
                message: "Pickup date cannot be in the past.",
            });
        }

        // Only cars actively listed by their owner can be reserved.
        const carData = await Car.findOne({ _id: car, isAvailable: true });
        if (!carData) {
            return res.status(404).json({ success: false, message: "Car is not available" });
        }

        // Check date availability only after verifying the car is active.
        const isAvailable = await checkAvailability(car, pickupDate, returnDate);
        if (!isAvailable) return res.json({ success: false, message: "Car is not available", });

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
            pendingExpiresAt: new Date(
                Date.now() + PENDING_BOOKING_EXPIRY_HOURS * 60 * 60 * 1000,
            ),
        });

        res.json({ success: true, message: "Booking Created" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const sharePickupLocation = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, latitude, longitude } = req.body;

        const validLatitude = Number(latitude);
        const validLongitude = Number(longitude);

        if (
            !bookingId
            || !Number.isFinite(validLatitude)
            || !Number.isFinite(validLongitude)
            || validLatitude < -90
            || validLatitude > 90
            || validLongitude < -180
            || validLongitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid pickup location is required.",
            });
        }

        const booking = await Booking.findOne({
            _id: bookingId,
            user: _id,
            status: "confirmed",
        });

        if (!booking) {
            return res.status(403).json({
                success: false,
                message: "You can share a pickup location only for a confirmed booking.",
            });
        }

        booking.pickupLocation = {
            latitude: validLatitude,
            longitude: validLongitude,
            sharedAt: new Date(),
        };

        await booking.save();

        res.json({
            success: true,
            message: "Pickup location shared with the car owner.",
            pickupLocation: booking.pickupLocation,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
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
            .populate("car")
            .populate("user", "name email")
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

        if (
            booking.status === "pending"
            && booking.pendingExpiresAt
            && booking.pendingExpiresAt <= new Date()
        ) {
            booking.status = "cancelled";
            await booking.save();
            return res.status(400).json({
                success: false,
                message: "This pending booking has expired.",
            });
        }

        const allowedTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["completed", "cancelled"],
        };

        if (!allowedTransitions[booking.status]?.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid booking status change" });
        }

        booking.status = status;
        if (status === "confirmed") {
            booking.pendingExpiresAt = undefined;
        }
        await booking.save();

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
