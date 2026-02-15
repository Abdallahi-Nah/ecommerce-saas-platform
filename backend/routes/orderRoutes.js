const express = require("express");
const router = express.Router();
const {
  createOrder,
  getStoreOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  getStoreCustomers,
  getMyOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// جميع المسارات محمية
router.use(protect);

// @route   GET /api/orders/my-orders (للعملاء)
router.get('/my-orders', getMyOrders);

// @route   GET /api/orders/stats
router.get("/stats", authorize("store_owner"), getOrderStats);

// @route   GET /api/orders
// @route   POST /api/orders
router
  .route("/")
  .get(authorize("store_owner"), getStoreOrders)
  .post(createOrder);

// @route   GET /api/orders/customers
router.get('/customers', authorize('store_owner'), getStoreCustomers);

// @route   GET /api/orders/:id
router.get("/:id", getOrderById);


// @route   PUT /api/orders/:id/status
router.put("/:id/status", authorize("store_owner"), updateOrderStatus);

module.exports = router;
