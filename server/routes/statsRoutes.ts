import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import { getStats } from "../controllers/statsController";

const router = express.Router();

router.get("/", protect, authorize("admin"), getStats);

export default router;