import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;

    const user = await User.findById(reqUser.id).populate({
      path: "favorites",
      select: "description price city rating reviewCount location",
      populate: [
        { path: "user", select: "name phone" },
        { path: "category", select: "name icon" },
      ],
    });

    res.status(200).json({ success: true, data: user?.favorites });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;
    const { providerId } = req.params;

    const user = await User.findById(reqUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyAdded = user.favorites.some(
      (id: any) => id.toString() === providerId
    );

    if (alreadyAdded) {
      return res.status(400).json({ message: "Provider already in favorites" });
    }

    user.favorites.push(providerId as any);
    await user.save();

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;
    const { providerId } = req.params;

    const user = await User.findById(reqUser.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (id: any) => id.toString() !== providerId
    );

    await user.save();

    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    next(error);
  }
};