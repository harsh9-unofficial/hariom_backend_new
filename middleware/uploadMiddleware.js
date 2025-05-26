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
    // Optional: Add timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Unique filename
  },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types for images and videos
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/mpeg",
    "video/quicktime", // .mov files
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MPEG, MOV, WebM) are allowed."
      ),
      false
    ); // Reject file
  }
};

// Set up multer instance with storage, file filter, and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (adjust as needed)
  },
});

module.exports = upload;