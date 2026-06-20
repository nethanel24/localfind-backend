import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
} from "../controllers/providerController";

const router = express.Router();

// Public routes
router.get("/", getProviders);
router.get("/:id", getProviderById);

// Protected routes
router.post("/", protect, createProvider);
router.put("/:id", protect, updateProvider);
router.delete("/:id", protect, deleteProvider);

export default router;