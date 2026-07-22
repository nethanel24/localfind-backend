import { Request, Response, NextFunction } from "express";
import OpenAI from "openai";
import Category from "../models/Category";
import Provider from "../models/Provider";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const searchProviders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, lng, lat, maxDistance } = req.body;

    const categories = await Category.find().select("name");
    const categoryNames = categories.map((c) => c.name).join(", ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helper that classifies service requests into categories.
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

    const filter: Record<string, any> = {
      isActive: true,
      category: category._id,
    };

    if (lng && lat) {
      filter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance || "10000"),
        },
      };
    }

    const providers = await Provider.find(filter)
      .populate("user", "name email phone")
      .populate("category", "name icon")
      .sort("-rating");

    res.status(200).json({
      success: true,
      matchedCategory: matchedCategoryName,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};