const Product = require('../models/Product');
const Store = require('../models/Store');

// @desc    إنشاء منتج جديد
// @route   POST /api/products
// @access  Private (Store Owner)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, compareAtPrice, cost, stock, category, images } = req.body;

    // التحقق من أن المستخدم لديه متجر
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر لإنشاء منتج',
      });
    }

    // إنشاء المنتج
    const product = await Product.create({
      name,
      description,
      price,
      compareAtPrice,
      cost,
      stock,
      category,
      images,
      storeId: req.user.storeId,
      status: 'active',
    });

    // تحديث إحصائيات المتجر
    await Store.findByIdAndUpdate(req.user.storeId, {
      $inc: { 'stats.totalProducts': 1 },
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء المنتج بنجاح',
      data: product,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء المنتج',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    جلب منتجات المتجر
// @route   GET /api/products
// @access  Private (Store Owner)
exports.getMyProducts = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر',
      });
    }

    const { page = 1, limit = 10, status, category, search } = req.query;

    // بناء الفلتر
    const filter = { storeId: req.user.storeId };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // جلب المنتجات
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
    });
  }
};

// @desc    جلب منتج واحد
// @route   GET /api/products/:id
// @access  Private (Store Owner)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    // التحقق من الملكية
    if (product.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بالوصول لهذا المنتج',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج',
    });
  }
};

// @desc    تحديث منتج
// @route   PUT /api/products/:id
// @access  Private (Store Owner)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    // التحقق من الملكية
    if (product.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا المنتج',
      });
    }

    // تحديث المنتج
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث المنتج',
    });
  }
};

// @desc    حذف منتج
// @route   DELETE /api/products/:id
// @access  Private (Store Owner)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    // التحقق من الملكية
    if (product.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا المنتج',
      });
    }

    await product.deleteOne();

    // تحديث إحصائيات المتجر
    await Store.findByIdAndUpdate(req.user.storeId, {
      $inc: { 'stats.totalProducts': -1 },
    });

    res.status(200).json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المنتج',
    });
  }
};

// @desc    جلب إحصائيات المتجر
// @route   GET /api/products/stats
// @access  Private (Store Owner)
exports.getStoreStats = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر',
      });
    }

    const store = await Store.findById(req.user.storeId);

    // إحصائيات المنتجات
    const totalProducts = await Product.countDocuments({
      storeId: req.user.storeId,
      status: 'active',
    });

    const lowStockProducts = await Product.countDocuments({
      storeId: req.user.storeId,
      stock: { $lt: 10 },
      status: 'active',
    });

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        totalOrders: store.stats.totalOrders || 0,
        totalRevenue: store.stats.totalRevenue || 0,
        totalCustomers: store.stats.totalCustomers || 0,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الإحصائيات',
    });
  }
};

// @desc    جلب منتجات متجر معين (للعملاء)
// @route   GET /api/public/stores/:storeId/products
// @access  Public
exports.getStoreProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    // بناء الفلتر
    const filter = {
      storeId,
      status: 'active',
      isVisible: true,
    };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // جلب المنتجات
    const products = await Product.find(filter)
      .select('-createdAt -updatedAt -__v')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    // جلب Categories المتاحة
    const categories = await Product.distinct('category', { storeId, status: 'active' });

    res.status(200).json({
      success: true,
      data: products,
      categories,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Store Products Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتجات',
    });
  }
};

// @desc    جلب تفاصيل منتج (للعملاء)
// @route   GET /api/public/products/:id
// @access  Public
exports.getPublicProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'storeId',
      'name slug email phone'
    );

    if (!product || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    // زيادة عدد المشاهدات
    product.stats.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get Public Product Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المنتج',
    });
  }
};

// @desc    جلب معلومات متجر (للعملاء)
// @route   GET /api/public/stores/:storeId
// @access  Public
exports.getPublicStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId).select(
      "name slug description logo banner email phone settings isActive"
    );

    if (!store || !store.isActive) {
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
    console.error('Get Public Store Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتجر',
    });
  }
};

// @desc    جلب جميع المتاجر النشطة
// @route   GET /api/public/stores
// @access  Public
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true })
      .select('name slug description logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error('Get All Stores Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المتاجر',
    });
  }
};