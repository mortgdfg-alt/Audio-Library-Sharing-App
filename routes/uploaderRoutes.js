import express from "express";
import upload from "../config/multer.js"; // هنا بنستورد الكود اللي انت عامله
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  رفع ملف صوتي
router.post("/:userId/audio", authMiddleware, upload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio file uploaded" });
  res.json({
    message: "Audio uploaded successfully",
    path: req.file.path
  });
});

//  رفع صورة الكوفر
router.post("/:userId/cover", authMiddleware, upload.single("cover"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No cover file uploaded" });
  res.json({
    message: "Cover image uploaded successfully",
    path: req.file.path
  });
});

//  رفع صورة البروفايل
router.post("/:userId/profile", authMiddleware, upload.single("profile"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No profile image uploaded" });
  res.json({
 "Profile image uploaded successfully",
    path: req.file.path
  });
});

export default router;
