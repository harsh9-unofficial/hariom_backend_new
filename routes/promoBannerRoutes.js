const express = require("express");
const router = express.Router();
const promoBannerController = require("../controllers/promoBannerController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Routes for promo banners
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  promoBannerController.createPromoBanner
);
router.get("/", promoBannerController.getAllPromoBanners);
router.get("/:id", promoBannerController.getPromoBannerById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  promoBannerController.updatePromoBanner
);
router.delete("/:id", promoBannerController.deletePromoBanner);

module.exports = router;
