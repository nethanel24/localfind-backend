import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createRequest, getRequestsByProvider, updateRequestStatus } from "../controllers/requestController";
import validate from "../middleware/validate";
import { createRequestSchema, updateRequestStatusSchema } from "../validation/requestValidation";

const router = express.Router();

router.post("/", protect, validate(createRequestSchema), createRequest);
router.get("/provider/:providerId", protect, getRequestsByProvider);
router.put("/:id", protect, validate(updateRequestStatusSchema), updateRequestStatus);

export default router;