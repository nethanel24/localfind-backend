import express from "express";
import cors from "cors";
import path from "path";
import logger from "./middleware/logger";
import indexRouter from "./routes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../screens")));

app.use("/", indexRouter);
app.use("/api/auth", authRoutes);

export default app;