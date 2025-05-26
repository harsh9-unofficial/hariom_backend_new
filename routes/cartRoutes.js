const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/get/:userId", authMiddleware, cartController.getCart);
router.put("/update/:cartId", authMiddleware, cartController.updateCart);
router.delete("/remove/:cartId", authMiddleware, cartController.removeCartItem);

module.exports = router;
