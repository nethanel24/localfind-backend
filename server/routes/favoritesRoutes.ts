import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController";

const router = express.Router();

router.get("/", protect, getFavorites);
router.post("/:providerId", protect, addFavorite);
router.delete("/:providerId", protect, removeFavorite);

export default router;