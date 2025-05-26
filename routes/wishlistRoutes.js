const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, wishlistController.addToWishlist);
router.get("/get/:userId", authMiddleware, wishlistController.getWishlist);
router.put(
  "/update/:wishlistId",
  authMiddleware,
  wishlistController.updateWishlist
);
router.delete(
  "/remove/:wishlistId",
  authMiddleware,
  wishlistController.removeWishlistItem
);

module.exports = router;
