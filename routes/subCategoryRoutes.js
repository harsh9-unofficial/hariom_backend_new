const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const subCategoryController = require("../controllers/subCategoryController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post(
    "/add",
    authMiddleware,
    upload.single("image"),
    subCategoryController.createSubCategory
);
router.get("/", subCategoryController.getSubCategory);
router.post("/get", subCategoryController.getSubCategoryPagination);
router.put(
    "/update/:sub_cate_id",
    authMiddleware,
    upload.single("image"),
    subCategoryController.updateSubCategory
);
router.delete(
    "/delete/:sub_cate_id",
    authMiddleware,
    subCategoryController.deleteSubCategory
);

module.exports = router;
