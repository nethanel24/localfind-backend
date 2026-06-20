import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "30d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = generateToken((user._id as any).toString());

    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// @desc Login an existing user
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await (user as any).matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken((user._id as any).toString());

    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};