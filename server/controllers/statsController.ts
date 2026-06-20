import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Review from "../models/Review";

// GET /api/admin/stats
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalSeekers = await User.countDocuments({ role: "user" });
    const totalReviews = await Review.countDocuments();

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const newProvidersThisMonth = await User.countDocuments({
      role: "provider",
      createdAt: { $gte: startOfMonth },
    });
    const newReviewsThisMonth = await Review.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const ratingResult = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const averageRating = ratingResult[0]?.avgRating || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProviders,
        totalSeekers,
        totalReviews,
        newUsersThisMonth,
        newProvidersThisMonth,
        newReviewsThisMonth,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};