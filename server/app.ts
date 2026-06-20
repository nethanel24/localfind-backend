import express from "express";
import cors from "cors";
import path from "path";
import logger from "./middleware/logger";
import indexRouter from "./routes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../screens")));

app.use("/", indexRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

export default app;