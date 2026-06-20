import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import { getUsers } from "../controllers/adminController";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getUsers);

export default router;