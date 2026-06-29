import express from "express";
import { register, login, googleSignin } from "../controllers/authController";
import validate from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/authValidation";
const router = express.Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/google", googleSignin);
export default router;