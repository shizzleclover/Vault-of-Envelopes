import multer from 'multer';

// Use memory storage - files are kept in memory as Buffer objects
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'), false);
    }
};

// File filter for audio
const audioFilter = (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP3, WAV, and OGG are allowed.'), false);
    }
};

// Upload configurations
export const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const uploadAudio = multer({
    storage,
    fileFilter: audioFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});
