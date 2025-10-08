const express = require("express");
const { protect } = require("../middlewares/auth");
const { restrictTo } = require("../middlewares/middlewaresRoles");

const router = express.Router();

// فقط للمستخدمين اللي عندهم role = "admin"
router.get("/dashboard", protect, restrictTo("admin"), (req, res) => {
  res.json({ message: "Welcome Admin Dashboard!" });
});

module.exports = router;