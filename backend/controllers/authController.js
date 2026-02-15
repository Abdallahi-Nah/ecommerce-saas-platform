const User = require("../models/User");
const Store = require("../models/Store");
const generateToken = require("../utils/generateToken");
const {
  sendWelcomeEmail,
  sendStoreOwnerWelcomeEmail,
} = require("../services/emailService");

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "الاسم والبريد الإلكتروني وكلمة المرور مطلوبة",
      });
    }

    // التحقق من أن البريد غير مستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "customer",
    });

    // إنشاء التوكن
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "تم التسجيل بنجاح",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في التسجيل",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    تسجيل عميل جديد
// @route   POST /api/auth/register-customer
// @access  Public
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "يرجى تعبئة جميع الحقول المطلوبة",
      });
    }

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "customer",
    });

    // إرسال إيميل الترحيب
    sendWelcomeEmail(user).catch((err) =>
      console.error("Welcome email error:", err)
    );

    // إنشاء Token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "تم التسجيل بنجاح",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register Customer Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في التسجيل',
    });
  }
};

// @desc    تسجيل الدخول
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني وكلمة المرور مطلوبة",
      });
    }

    // جلب المستخدم مع كلمة المرور
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // التحقق من كلمة المرور
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    // التحقق من أن الحساب نشط
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "حسابك معطل، يرجى التواصل مع الدعم",
      });
    }

    // تحديث آخر تسجيل دخول
    user.lastLogin = Date.now();
    await user.save();

    // إنشاء التوكن
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          storeId: user.storeId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تسجيل الدخول",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    الحصول على بيانات المستخدم الحالي
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "storeId",
      "name slug logo"
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب البيانات",
    });
  }
};

// @desc    تسجيل متجر جديد (Store Owner)
// @route   POST /api/auth/register-store
// @access  Public
exports.registerStore = async (req, res) => {
  try {
    const {
      // بيانات المستخدم
      name,
      email,
      password,
      phone,
      // بيانات المتجر
      storeName,
      storeDescription,
      storeEmail,
      storePhone,
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password || !storeName) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول المطلوبة يجب تعبئتها",
      });
    }

    // التحقق من أن البريد غير مستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل",
      });
    }

    // التحقق من أن اسم المتجر غير مستخدم
    const existingStore = await Store.findOne({ name: storeName });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "اسم المتجر مستخدم بالفعل",
      });
    }

    // إنشاء المستخدم (Store Owner)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "store_owner",
    });

    // إنشاء المتجر
    const store = await Store.create({
      name: storeName,
      description: storeDescription,
      email: storeEmail || email,
      phone: storePhone || phone,
      ownerId: user._id,
    });

    // ربط المستخدم بالمتجر
    user.storeId = store._id;
    await user.save();

    // إنشاء التوكن
    const token = generateToken(user._id);

    // إرسال إيميل الترحيب لصاحب المتجر
    sendStoreOwnerWelcomeEmail(user, store).catch((err) =>
      console.error("Store welcome email error:", err)
    );

    res.status(201).json({
      success: true,
      message: "تم إنشاء المتجر بنجاح",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          storeId: user.storeId,
        },
        store: {
          _id: store._id,
          name: store.name,
          slug: store.slug,
          email: store.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register Store Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء المتجر",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    تحديث معلومات المتجر
// @route   PUT /api/auth/store
// @access  Private (Store Owner)
exports.updateStore = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر',
      });
    }

    const {
      name,
      description,
      email,
      phone,
      address,
      logo,
      banner,
      currency,
      language,
      timezone,
    } = req.body;

    const store = await Store.findById(req.user.storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'المتجر غير موجود',
      });
    }

    // تحديث البيانات
    if (name) store.name = name;
    if (description) store.description = description;
    if (email) store.email = email;
    if (phone) store.phone = phone;
    if (address) store.address = address;
    if (logo) store.logo = logo;
    if (banner) store.banner = banner;
    if (currency) store.settings.currency = currency;
    if (language) store.settings.language = language;
    if (timezone) store.settings.timezone = timezone;

    await store.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث معلومات المتجر بنجاح',
      data: store,
    });
  } catch (error) {
    console.error('Update Store Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المتجر',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    تحديث معلومات المستخدم
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // تحديث البيانات الأساسية
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // تحديث كلمة المرور
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      
      if (!isPasswordCorrect) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور الحالية غير صحيحة',
        });
      }

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الملف الشخصي',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    جلب معلومات المتجر
// @route   GET /api/auth/store
// @access  Private (Store Owner)
exports.getStore = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر',
      });
    }

    const store = await Store.findById(req.user.storeId).populate('ownerId', 'name email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'المتجر غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    console.error('Get Store Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتجر',
    });
  }
};