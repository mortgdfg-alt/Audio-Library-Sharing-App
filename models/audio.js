// models/Audio.js
import mongoose from "mongoose";

const allowedGenres = ["education", "religion", "comedy", "fiction", "self-help", "podcast", "lecture", "audiobook", "music"];

const audioSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  genre: { type: String, required: true, enum: allowedGenres },
  isPrivate: { type: Boolean, default: false },
  audioPath: { type: String, required: true },
  audioSize: { type: Number },
  coverPath: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const Genres = allowedGenres;
export default mongoose.model("Audio", audioSchema);
