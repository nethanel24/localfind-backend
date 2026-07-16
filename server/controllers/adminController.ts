import { Request, Response, NextFunction } from "express";
import User from "../models/User";
// GET /api/admin/users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.search) {
      const search = new RegExp(req.query.search as string, "i");
      filter.$or = [{ name: search }, { email: search }];
    }
    const users = await User.find(filter).select("-password").sort("-createdAt");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};