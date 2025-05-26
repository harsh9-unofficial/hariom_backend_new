const express = require('express');
const router = express.Router();
const promoBannerController = require('../controllers/promoBannerController');
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Routes for promo banners
router.post('/', upload.single("image"), authMiddleware, promoBannerController.createPromoBanner);
router.get('/', promoBannerController.getAllPromoBanners);
router.get('/:id', promoBannerController.getPromoBannerById);
router.put('/:id', upload.single("image"), authMiddleware, promoBannerController.updatePromoBanner);
router.delete('/:id', promoBannerController.deletePromoBanner);

module.exports = router;