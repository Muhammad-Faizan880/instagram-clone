import multer from "multer";
import path from "path";

// Memory storage keeps files in RAM as buffer (good for Cloudinary)
const storage = multer.memoryStorage();

// Optional: filter only image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only image files are allowed (.jpg, .jpeg, .png)"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit (optional)
});

export default upload;
