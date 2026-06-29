import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname
      .split(".")
      .filter(Boolean)
      .slice(1)
      .join(".");
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });

router.post("/", protect, upload.single("file"), (req, res) => {
  res.status(200).json({ url: base + req.file?.path });
});

export default router;