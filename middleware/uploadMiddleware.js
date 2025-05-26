const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists before saving files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created successfully");
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original file name
  },
});

// Set up multer instance with storage and file filter
const upload = multer({
  storage: storage,
});

module.exports = upload;
