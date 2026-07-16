import express from "express";
import { searchProviders } from "../controllers/searchController";
import validate from "../middleware/validate";
import { searchSchema } from "../validation/searchValidation";

const router = express.Router();

router.post("/", validate(searchSchema), searchProviders);

export default router;