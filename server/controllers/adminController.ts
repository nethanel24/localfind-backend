import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// GET /api/admin/users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};