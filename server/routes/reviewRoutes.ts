import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getReviewsByProvider, createReview } from "../controllers/reviewController";

const router = express.Router();

router.get("/", getReviewsByProvider);
router.post("/add", protect, createReview);

export default router;