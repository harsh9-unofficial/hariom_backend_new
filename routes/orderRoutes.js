const express = require("express");
const router = express.Router();
const orderControlller = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, orderControlller.createOrder);
router.get("/getall", authMiddleware, orderControlller.getAllOrders);
router.put(
  "/updatestatus/:orderId",
  authMiddleware,
  orderControlller.updateOrderStatus
);
router.get("/get/:orderId", authMiddleware, orderControlller.getOrderById);
router.get(
  "/getuserorder/:userId",
  authMiddleware,
  orderControlller.getUserOrders
);
router.put("/cancel/:orderId", authMiddleware, orderControlller.cancelOrder);

module.exports = router;
