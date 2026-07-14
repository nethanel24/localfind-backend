import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getReviewsByProvider, createReview } from "../controllers/reviewController";
import validate from "../middleware/validate";
import { createReviewSchema } from "../validation/reviewValidation";
const router = express.Router();
router.get("/", getReviewsByProvider);
router.post("/add", protect, validate(createReviewSchema), createReview);

export default router;