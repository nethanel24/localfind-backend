import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  detectCategory,
} from "../controllers/providerController";
import validate from "../middleware/validate";
import { createProviderSchema, updateProviderSchema, detectCategorySchema } from "../validation/providerValidation";
const router = express.Router();
router.get("/", getProviders);
router.post("/detect-category", protect, validate(detectCategorySchema), detectCategory);
router.get("/:id", getProviderById);
router.post("/", protect, validate(createProviderSchema), createProvider);
router.put("/:id", protect, validate(updateProviderSchema), updateProvider);
router.delete("/:id", protect, deleteProvider);

export default router;