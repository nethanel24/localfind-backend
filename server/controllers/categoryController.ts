import { Request, Response, NextFunction } from "express";
import Category from "../models/Category";
import Provider from "../models/Provider";

// GET /api/categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find().sort("name");

    const withCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Provider.countDocuments({ category: category._id });
        return {
          _id: category._id,
          name: category.name,
          icon: category.icon,
          providerCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: withCounts.length,
      data: withCounts,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, icon } = req.body;

    const category = await Category.create({ name, icon });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const providerCount = await Provider.countDocuments({ category: req.params.id });
    if (providerCount > 0) {
      return res.status(400).json({ message: "Cannot delete a category that has providers" });
    }
    await Category.findByIdAndDelete(req.params.id);

    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};