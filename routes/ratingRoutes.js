const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");

// CRUD Routes
router.post("/", authMiddleware, ratingController.addOrUpdateRating); // Add or update a rating
router.get("/", authMiddleware, ratingController.getAllReviews); // Get all reviews
router.get("/products/:productId", authMiddleware, ratingController.getRatingsByProduct); // Get ratings by product
router.delete("/:ratingId", authMiddleware, ratingController.deleteReview); // Delete a review

module.exports = router;
