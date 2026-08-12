import express from "express";
import { protect } from "../middleware/auth.js";
import { createReview, getCarReviews } from "../Controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", protect, createReview);
reviewRouter.get("/car/:carId", getCarReviews);

export default reviewRouter;