const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUserDirectory = (baseFolder, userId) => {
    const userDir = path.join(__dirname, 'uploads', baseFolder, `user_${userId}`);

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    return userDir;
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const { userId } = req.params;

        const baseFolder;

        switch (file.filename) {
            case "audio":
                baseFolder = "audio";
                break;
            case "cover":
                baseFolder = "covers";
                break;
            case "profile":
                baseFolder = "profiles";
                break;
            default:
                cb(new Error('Invalid file type');
                break;
        }

        const userDir = createUserDirectory(baseFolder, userId);
        cb(null, userDir);
    },

    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Validate file types
    if (file.fieldname === 'audio') {
      if (!file.originalname.match(/\.(mp3|wav|ogg|m4a)$/)) {
        return cb(new Error('Only audio files are allowed'));
      }
    } else if (file.fieldname === 'cover' || file.fieldname === 'profile') {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed'));
      }
    }
    cb(null, true);
  }
});

module.exports = upload;
