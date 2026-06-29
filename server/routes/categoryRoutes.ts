import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";
import validate from "../middleware/validate";
import { createCategorySchema } from "../validation/categoryValidation";
const router = express.Router();
router.get("/", getCategories);
router.post("/add", protect, authorize("admin"), validate(createCategorySchema), createCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;