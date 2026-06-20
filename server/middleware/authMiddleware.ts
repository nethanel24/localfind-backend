import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No authorization" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "No authorization" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "No authorization" });
  }
};

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const reqUser = (req as any).user;

    if (!roles.includes(reqUser.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

export { protect, authorize };