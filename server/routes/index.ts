import express from "express";
import path from "path";

const router = express.Router();
const screens = path.join(__dirname, "../../screens");

router.get("/", (req, res) => {
  res.sendFile(path.join(screens, "index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(screens, "login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(screens, "register.html"));
});

export default router;