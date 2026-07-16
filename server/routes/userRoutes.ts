import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController";
import validate from "../middleware/validate";
import { updateProfileSchema, changePasswordSchema } from "../validation/userValidation";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);
router.put("/change-password", protect, validate(changePasswordSchema), changePassword);
router.delete("/account", protect, deleteAccount);

export default router;