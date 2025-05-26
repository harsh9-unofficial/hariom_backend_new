const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post(
  "/upload",
  upload.single("image"),
  authMiddleware,
  bannerController.uploadBanner
);
router.get("/", bannerController.getBanners);
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
