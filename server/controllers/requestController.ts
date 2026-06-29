import { Request, Response, NextFunction } from "express";
import ServiceRequest from "../models/Request";

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;
    const { provider, text } = req.body;

    const request = await ServiceRequest.create({
      user: reqUser.id,
      provider,
      text,
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const getRequestsByProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUser = (req as any).user;

    const requests = await ServiceRequest.find({ provider: req.params.providerId })
      .populate("user", "name phone imgUrl")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};