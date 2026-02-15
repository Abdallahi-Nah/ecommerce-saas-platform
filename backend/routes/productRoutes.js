const express = require("express");
const router = express.Router();
const {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getStoreStats,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

// جميع المسارات محمية وللـ store_owner فقط
router.use(protect);
router.use(authorize("store_owner"));

// @route   GET /api/products/stats
router.get("/stats", getStoreStats);

// @route   GET /api/products
// @route   POST /api/products
router.route("/").get(getMyProducts).post(createProduct);

// @route   GET /api/products/:id
// @route   PUT /api/products/:id
// @route   DELETE /api/products/:id
router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
