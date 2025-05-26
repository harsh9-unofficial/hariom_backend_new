const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Routes
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  productController.createProduct
);
router.get(
  "/dashboardcounter",
  authMiddleware,
  productController.dashboardCounter
);
router.get("/", productController.getAllProducts);
router.post("/all-products", productController.getProductsForAllProductPage);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-sellers", productController.getBestSellers);
router.get("/:id", productController.getProducts);
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 10),
  productController.updateProduct
);
router.delete("/:id", authMiddleware, productController.deleteProduct);
router.get("/subcategory/:cate_id", productController.getSubCategoryByCategory);
router.get(
  "/products/:sub_cate_id",
  productController.getProductsBySubCategory
);

module.exports = router;
