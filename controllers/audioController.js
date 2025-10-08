exports.uploadAudio = async (req, res, next) => {
  try {
    const { title, genre, isPrivate } = req.body;
    const audioFile = req.files.audio?.[0];
    const coverFile = req.files.cover?.[0];

    const newAudio = await Audio.create({
      title,
      genre,
      isPrivate,
      audioPath: audioFile.path,
      coverPath: coverFile?.path || null,
      user: req.user._id,
    });

    res.status(201).json({ success: true, audio: newAudio });
  } catch (err) {
    next(err);
  }
};
