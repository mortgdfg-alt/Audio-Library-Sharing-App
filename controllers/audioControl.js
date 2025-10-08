const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const mongoose = require("mongoose");
const mime = require("mime-types");
const Audio = require("../models/Audio");
exports.streamAudio = async (req, res, next) => {
  try {
    const audioId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(audioId)) {
      const err = new Error("Invalid audio ID");
      err.statusCode = 400;
      return next(err);
    }

    const audioDoc = await Audio.findById(audioId).select(
      "audioPath isPrivate user mimeType"
    );
    if (!audioDoc) {
      const err = new Error("Audio not found");
      err.statusCode = 404;
      return next(err);
    }

    const isOwner = audioDoc.user.toString() === req.user._id.toString();
    if (audioDoc.isPrivate && !isOwner && req.user.role !== "admin") {
      const err = new Error("Forbidden: you don't have access to this audio");
      err.statusCode = 403;
      return next(err);
    }

    const filePath = path.resolve(audioDoc.audioPath);
    const uploadsRoot = path.resolve("uploads");
    if (!filePath.startsWith(uploadsRoot)) {
      const err = new Error("Invalid file path");
      err.statusCode = 400;
      return next(err);
    }

    await fsPromises.access(filePath, fs.constants.R_OK).catch(() => {
      const err = new Error("File not found on disk");
      err.statusCode = 404;
      throw err;
    });
    const stat = await fsPromises.stat(filePath);
    const fileSize = stat.size;

    const contentType =
      audioDoc.mimeType || mime.lookup(filePath) || "audio/mpeg";

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (isNaN(start) || isNaN(end) || start > end || start >= fileSize) {
        res.status(416).set("Content-Range", `bytes */${fileSize}`).end();
        return;
      }

      const chunkSize = end - start + 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on("open", () => stream.pipe(res));
      stream.on("error", (streamErr) => next(streamErr));
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
      });
      const stream = fs.createReadStream(filePath);
      stream.on("open", () => stream.pipe(res));
      stream.on("error", (streamErr) => next(streamErr));
    }
  } catch (err) {
    next(err);
  }
};
