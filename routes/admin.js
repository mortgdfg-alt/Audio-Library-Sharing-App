const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Audio = require('../models/audio');
const { authenticate, requireRole, validateObjectId } = require('../middleware/auth');

// List all audios (admin only)
router.get('/audios', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const audios = await Audio.find().populate('owner', 'email role');
    res.json(audios);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete any audio by id (admin only)
router.delete('/audios/:id', authenticate, requireRole('admin'), validateObjectId('id'), async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Audio not found' });

    // remove files from disk if present
    const unlinkIfExists = (filePath) => {
      if (!filePath) return;
      const absolute = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      fs.stat(absolute, (err, stat) => {
        if (!err && stat.isFile()) fs.unlink(absolute, () => {});
      });
    };

    unlinkIfExists(audio.audioPath);
    unlinkIfExists(audio.coverPath);

    await audio.deleteOne();
    res.json({ message: 'Audio deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
