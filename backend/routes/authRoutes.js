const express = require("express");
const router = express.Router();
const {
  register,
  registerCustomer,
  login,
  getMe,
  registerStore,
  updateStore,
  updateProfile,
  getStore,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/register-customer
router.post('/register-customer', registerCustomer);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

// @route   POST /api/auth/register-store
router.post("/register-store", registerStore);

// @route   GET /api/auth/store
// @route   PUT /api/auth/store
router
  .route("/store")
  .get(protect, authorize("store_owner"), getStore)
  .put(protect, authorize("store_owner"), updateStore);

// @route   PUT /api/auth/profile
router.put("/profile", protect, updateProfile);

module.exports = router;
