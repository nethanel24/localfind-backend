import { Request, Response, NextFunction } from "express";
import Review from "../models/Review";

// GET /api/reviews?provider=:id
export const getReviewsByProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = req.query.provider as string;

    if (!provider) {
      return res.status(400).json({ message: "Provider id is required" });
    }

    const reviews = await Review.find({ provider })
      .populate("user", "name")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/reviews
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;
    const { provider, rating, comment } = req.body;

    const existing = await Review.findOne({ provider, user: reqUser.id });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this provider" });
    }

    const review = await Review.create({
      provider,
      user: reqUser.id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};