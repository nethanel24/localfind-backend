import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = express.Router();

// Public — anyone can read categories (onboarding, feed filters)
router.get("/", getCategories);

// Admin only — managing categories
router.post("/add", protect, authorize("admin"), createCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;