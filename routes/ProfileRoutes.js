import express from "express";
import { body, validationResult } from "express-validator";
import fs from "fs";
import User from "../models/User.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadProfile } from "../config/multer.js";

const router = express.Router();

// 🟢 GET /profile
router.get("/", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// 🟡 PUT /profile
router.put(
  "/",
  authMiddleware,
  uploadProfile.single("profilePic"),
  [body("name").optional().isLength({ min: 2 }).withMessage("Name too short")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = req.user;

    if (req.file && user.profilePic) {
      fs.unlinkSync(user.profilePic); // حذف القديمة
    }

    if (req.file) user.profilePic = req.file.path;
    if (req.body.name) user.name = req.body.name;

    await user.save();
    res.json({ message: "Profile updated", user });
  }
);

export default router;
