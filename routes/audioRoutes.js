const express = require("express");
const router = express.Router();
const { streamAudio } = require("../controllers/audioController");
const { authMiddleware } = require("../middlewares/auth");

router.get("/stream/:id", authMiddleware, streamAudio);

module.exports = router;
