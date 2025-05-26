const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} = require("../controllers/videoController"); // Updated to import videoController
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// // Configure Multer for video uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, process.env.UPLOAD_DIR || "uploads/"); // Ensure UPLOAD_DIR is set or fallback to default
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("video/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type, only videos are allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 100 * 1024 * 1024 },
// });

// Routes
router.get("/", getVideos);
router.post("/", authMiddleware, upload.single("video"), createVideo);
router.put("/:id", authMiddleware, upload.single("video"), updateVideo);
router.delete("/:id", authMiddleware, deleteVideo);

module.exports = router;
