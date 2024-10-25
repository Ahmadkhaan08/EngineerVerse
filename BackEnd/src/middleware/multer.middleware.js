import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/resumes'); // Destination for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept all file formats
        cb(null, true);
    }
});
