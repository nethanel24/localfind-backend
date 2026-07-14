import { Request, Response, NextFunction } from "express";
import OpenAI from "openai";
import Provider from "../models/Provider";
import Category from "../models/Category";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET /api/providers
export const getProviders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Record<string, any> = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.lng && req.query.lat) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(req.query.lng as string),
              parseFloat(req.query.lat as string),
            ],
          },
          $maxDistance: parseInt((req.query.maxDistance as string) || "10000"),
        },
      };
    }

    const providers = await Provider.find(filter)
      .populate("user", "name email")
      .populate("category", "name icon")
      .sort("-rating");

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/providers/:id
export const getProviderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("user", "name email")
      .populate("category", "name icon");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
};

// POST /api/providers
export const createProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const existing = await Provider.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: "Provider profile already exists for this user" });
    }

    const { category, description, price, city, location, openness } = req.body;

    const provider = await Provider.create({
      user: userId,
      category,
      description,
      price,
      city,
      location,
      openness,
    });

    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
};

// PUT /api/providers/:id
export const updateProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const reqUser = (req as any).user;

    if (provider.user.toString() !== reqUser.id && reqUser.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/providers/:id
export const deleteProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const reqUser = (req as any).user;

    if (provider.user.toString() !== reqUser.id && reqUser.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }

    await Provider.findByIdAndDelete(req.params.id);

    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// POST /api/providers/detect-category
export const detectCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;

    const categories = await Category.find().select("name");
    const categoryNames = categories.map((c) => c.name).join(", ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helper that classifies a service provider's description into a category.
You must respond with a single JSON object in this exact format: { "category": "<category name>" }.
Only use a category from this list: ${categoryNames}.
If nothing matches, pick the closest one.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const raw = completion.choices[0].message.content || "";
    let matchedCategoryName: string;

    try {
      const parsed = JSON.parse(raw);
      matchedCategoryName = parsed.category;
    } catch {
      return res.status(500).json({ message: "Failed to parse AI response" });
    }

    const category = await Category.findOne({ name: matchedCategoryName });
    if (!category) {
      return res.status(404).json({ message: "No matching category found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: category._id,
        name: category.name,
        icon: category.icon,
      },
    });
  } catch (error) {
    next(error);
  }
};