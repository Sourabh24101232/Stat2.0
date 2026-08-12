import Review from "../models/ReviewModel.js";
import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!bookingId || !rating || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rating and review text are required.",
      });
    }

    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
      status: "completed",
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You can review only completed bookings.",
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    const review = await Review.create({
      car: booking.car,
      user: userId,
      booking: bookingId,
      rating: numericRating,
      comment: comment.trim(),
    });

    const [ratingSummary] = await Review.aggregate([
      { $match: { car: booking.car } },
      {
        $group: {
          _id: "$car",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    await Car.findByIdAndUpdate(booking.car, {
      averageRating: Number(ratingSummary.averageRating.toFixed(1)),
      reviewCount: ratingSummary.reviewCount,
    });

    res.json({
      success: true,
      message: "Thank you for your review!",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
