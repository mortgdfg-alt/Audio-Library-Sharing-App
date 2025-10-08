// config/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

const audioExt = [".mp3", ".m4a"];
const imageExt = [".jpg", ".jpeg", ".png"];

// create destination dynamically based on req.user and fieldname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // fallback anonymous if req.user missing
    const userId = req.user?._id?.toString() || "anonymous";
    let sub = "others";

    if (file.fieldname === "profilePic") sub = `profiles/user_${userId}`;
    else if (file.fieldname === "audio") sub = `audio/user_${userId}`;
    else if (file.fieldname === "cover") sub = `covers/user_${userId}`;

    const folder = path.join(process.cwd(), "uploads", sub);
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === "audio") {
    if (!audioExt.includes(ext)) return cb(new Error("Audio type not allowed"), false);
    return cb(null, true);
  }
  if (file.fieldname === "cover" || file.fieldname === "profilePic") {
    if (!imageExt.includes(ext)) return cb(new Error("Image type not allowed"), false);
    return cb(null, true);
  }
  cb(new Error("Unknown field"), false);
};

const limits = {
  // per-file size limit will be checked by client-side field; multer enforces one global: choose large enough
  fileSize: 50 * 1024 * 1024, // 50MB default (audio)
};

export const upload = multer({ storage, fileFilter, limits });
