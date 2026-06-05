import User from "../models/UserModel.js";
import fs from 'fs'
import imagekit from "../configs/imagekit.js";
import Car from "../models/CarModel.js";

//controller function to change role of user
export const changeRoleToOwner = async (req, res) => {
    try {
        const id = req.user._id;
        await User.findByIdAndUpdate(id, { role: "owner" });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "Now you can list cars" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


//controller function to add cars
export const addCar = async (req, res) => {
    try {
        const id = req.user._id;
        //get car data and umage from request
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        //upload image to imageKit using middleware(upload)
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },   // Width resizing
                { quality: 'auto' }, // Auto compression
                { format: 'webp' } // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({ ...car, owner: id, image })
        res.json({ success: true, message: "Car added" })

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};


//Controller function to List Owner Cars
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id })
        res.json({ success: true, cars })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//Controller function To toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {

        const { carId } = req.body
        if (!carId) {
            return res.json({ success: false, message: "Car ID is required" });
        }
        const car = await Car.findById(carId)
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Checking is car belongs to the user
        const { _id } = req.user;
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvailable = !car.isAvailable;
        await car.save()
        res.json({ success: true, message: "Availability Toggled" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//Controller function to delete a car
export const deleteCar = async (req, res) => {
    try {

        const { carId } = req.body
        if (!carId) {
            return res.json({ success: false, message: "Car ID is required" });
        }
        const car = await Car.findById(carId)
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        // Checking is car belongs to the user
        const { _id } = req.user;
        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        //we will not delete the car bcz it may be in someones booking history
        car.owner = null;
        car.isAvailable = false;

        await car.save()
        res.json({ success: true, message: "Car removed" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//Controller function to get dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const { _id, role } = req.user;
        if (role !== 'owner') return res.json({ success: false, message: "Unauthorized" })

        const cars = await Car.find({ owner: _id })

        const bookings = await Booking.find({ owner: _id })
            .populate("car")
            .sort({ createdAt: -1 });//Newest bookings first

        const pendingBookings = await Booking.find({
            owner: _id,
            status: "pending",
        });

        const completedBookings = await Booking.find({
            owner: _id,
            status: "confirmed",
        });

        // Calculate totalRevenue from bookings where status is confirmed
        const totalRevenue = bookings
            .filter((booking) => booking.status === "confirmed")
            .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),//this gives the latest 3 bookings
            totalRevenue,
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
