import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const client = new OAuth2Client();

const generateToken = (id: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || "30d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

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

export const googleSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credential = req.body.credential;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload?.name,
        email: email,
        imgUrl: payload?.picture,
        password: "google-signin",
      });
    }

    const token = generateToken((user._id as any).toString());

    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};