const express = require("express");
const router = express.Router();
const instaSectionController = require("../controllers/instaSectionController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Routes for image operations
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  instaSectionController.createInstaSection
);
router.get("/", instaSectionController.getAllInstaSections);
router.get("/:id", instaSectionController.getInstaSectionById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  instaSectionController.updateInstaSection
);
router.delete(
  "/:id",
  authMiddleware,
  instaSectionController.deleteInstaSection
);

module.exports = router;
