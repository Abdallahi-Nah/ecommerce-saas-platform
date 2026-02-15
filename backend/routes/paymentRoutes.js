const express = require("express");
const router = express.Router();
const {
  createOrderCheckout,
  paymentWebhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

// Webhook (يجب أن يكون قبل protect)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhook
);

// باقي المسارات محمية
router.use(protect);

// @route   POST /api/payments/create-checkout
router.post("/create-checkout", createOrderCheckout);

module.exports = router;
