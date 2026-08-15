import express from "express";
import {changeBookingStatus,checkAvailabilityOfCar,createBooking,getOwnerBookings,getUserBookings,sharePickupLocation,} from "../Controllers/bookingController.js";
import { protect, requireOwner } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityOfCar);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.post("/share-pickup-location", protect, sharePickupLocation);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/owner", protect, requireOwner, getOwnerBookings);
bookingRouter.post("/change-status", protect, requireOwner, changeBookingStatus);

export default bookingRouter;
