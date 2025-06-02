import multer from "multer";

const storage = multer.memoryStorage(); // keep in memory for imagekit
const upload = multer({ storage });

export default upload;
