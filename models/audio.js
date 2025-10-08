import mongoose from 'mongoose';


const audioSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
genre: { type: String, required: true },
isPrivate: { type: Boolean, default: false },
audioPath: { type: String, required: true },
coverPath: { type: String },
playCount: { type: Number, default: 0 }
}, { timestamps: true });


export default mongoose.model('Audio', audioSchema);