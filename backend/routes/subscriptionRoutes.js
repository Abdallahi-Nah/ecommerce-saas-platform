const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getCurrentSubscription,
  cancelSubscription,
  resumeSubscription,
  stripeWebhook,
} = require("../controllers/subscriptionController");
const { protect, authorize } = require("../middleware/auth");

// Webhook (يجب أن يكون قبل protect)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// باقي المسارات محمية
router.use(protect);
router.use(authorize("store_owner"));

// @route   POST /api/subscriptions/create-checkout
router.post("/create-checkout", createCheckoutSession);

// @route   GET /api/subscriptions/current
router.get("/current", getCurrentSubscription);

// @route   POST /api/subscriptions/cancel
router.post("/cancel", cancelSubscription);

// @route   POST /api/subscriptions/resume
router.post("/resume", resumeSubscription);

module.exports = router;
