const express = require("express");
const router = express.Router();
const {
  uploadProductImage,
  uploadProductImages,
  deleteImage,
  uploadLogo,
} = require("../controllers/uploadController");
const {
  uploadProduct,
  uploadLogo: uploadLogoMiddleware,
} = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

// جميع المسارات محمية ومحصورة بـ store owners
router.use(protect);
router.use(authorize("store_owner"));

// @route   POST /api/upload/product
router.post("/product", uploadProduct.single("image"), uploadProductImage);

// @route   POST /api/upload/products (multiple)
router.post("/products", uploadProduct.array("images", 5), uploadProductImages);

// @route   POST /api/upload/logo
router.post("/logo", uploadLogoMiddleware.single("logo"), uploadLogo);

// @route   DELETE /api/upload/:publicId
router.delete("/:publicId", deleteImage);

module.exports = router;
