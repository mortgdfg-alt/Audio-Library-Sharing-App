const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audioPath: { type: String, required: true },
  coverPath: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', AudioSchema);
