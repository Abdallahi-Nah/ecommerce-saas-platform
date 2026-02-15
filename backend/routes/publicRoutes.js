const express = require("express");
const router = express.Router();
const {
  getStoreProducts,
  getPublicProduct,
  getPublicStore,
  getAllStores,
} = require("../controllers/productController");

// @route   GET /api/public/stores (جلب جميع المتاجر) - يجب أن يكون أولاً
router.get('/stores', getAllStores);

// @route   GET /api/public/stores/:storeId
router.get("/stores/:storeId", getPublicStore);

// @route   GET /api/public/stores/:storeId/products
router.get("/stores/:storeId/products", getStoreProducts);

// @route   GET /api/public/products/:id
router.get("/products/:id", getPublicProduct);

module.exports = router;
