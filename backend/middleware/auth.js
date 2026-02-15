const jwt = require("jsonwebtoken");
const User = require("../models/User");

// حماية المسارات - التحقق من التوكن
exports.protect = async (req, res, next) => {
  let token;

  // التحقق من وجود التوكن في الـ headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // التحقق من وجود التوكن
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "غير مصرح لك بالدخول، يرجى تسجيل الدخول",
    });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب بيانات المستخدم
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    // التحقق من أن الحساب نشط
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "حسابك معطل، يرجى التواصل مع الدعم",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "التوكن غير صالح أو منتهي الصلاحية",
    });
  }
};

// التحقق من الدور (Role)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `الدور ${req.user.role} غير مصرح له بالوصول لهذا المورد`,
      });
    }
    next();
  };
};

// التحقق من أن المستخدم يملك المتجر
exports.authorizeStoreOwner = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "معرف المتجر مطلوب",
      });
    }

    // التحقق من أن المستخدم هو صاحب المتجر أو Admin
    if (
      req.user.role === "platform_admin" ||
      (req.user.storeId && req.user.storeId.toString() === storeId)
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بالوصول لهذا المتجر",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "خطأ في التحقق من الصلاحيات",
    });
  }
};
