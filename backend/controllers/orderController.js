const Order = require("../models/Order");
const Product = require("../models/Product");
const Store = require("../models/Store");
const {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} = require("../services/emailService");

// @desc    إنشاء طلب جديد
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res) => {
  try {
    const { storeId, items, shippingAddress, paymentMethod, customerNotes } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "يجب إضافة منتجات للطلب",
      });
    }

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "معرف المتجر مطلوب",
      });
    }

    // حساب الإجماليات
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `المنتج ${item.productId} غير موجود`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `المخزون غير كافٍ للمنتج ${product.name}`,
        });
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || null,
      });

      // تحديث المخزون
      product.stock -= item.quantity;
      if (product.stats) {
        product.stats.sales = (product.stats.sales || 0) + item.quantity;
      }
      await product.save();
    }

    const shippingCost = 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // توليد رقم الطلب يدوياً
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // إنشاء الطلب
    const order = await Order.create({
      orderNumber, // ← أضف هذا
      customerId: req.user._id,
      storeId: storeId,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || "cash",
      customerNotes,
    });

    // تحديث إحصائيات المتجر
    await Store.findByIdAndUpdate(storeId, {
      $inc: {
        "stats.totalOrders": 1,
        "stats.totalRevenue": total,
      },
    });

    // إرسال إيميل تأكيد الطلب
    sendOrderConfirmationEmail(order, req.user, store).catch((err) =>
      console.error("Order confirmation email error:", err)
    );

    res.status(201).json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      data: order,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الطلب',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    جلب طلبات المتجر
// @route   GET /api/orders
// @access  Private (Store Owner)
exports.getStoreOrders = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: "يجب أن يكون لديك متجر",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    const filter = { storeId: req.user.storeId };
    if (status && status !== "all") {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الطلبات",
    });
  }
};

// @desc    جلب تفاصيل طلب
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customerId", "name email phone")
      .populate("items.productId", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب غير موجود",
      });
    }

    // التحقق من الصلاحيات
    const isOwner = order.storeId.toString() === req.user.storeId?.toString();
    const isCustomer =
      order.customerId._id.toString() === req.user._id.toString();

    if (!isOwner && !isCustomer) {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بالوصول لهذا الطلب",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الطلب",
    });
  }
};

// @desc    جلب طلبات العميل
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { customerId: req.user._id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('storeId', 'name logo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات',
    });
  }
};

// @desc    تحديث حالة الطلب
// @route   PUT /api/orders/:id/status
// @access  Private (Store Owner)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب غير موجود",
      });
    }

    // التحقق من الملكية
    if (order.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(403).json({
        success: false,
        message: "غير مصرح لك بتعديل هذا الطلب",
      });
    }

    const oldStatus = order.status;

    order.status = status;

    // تحديث التواريخ
    if (status === "shipped") order.shippedAt = Date.now();
    if (status === "delivered") order.deliveredAt = Date.now();
    if (status === "cancelled") order.cancelledAt = Date.now();

    await order.save();

    // جلب بيانات العميل والمتجر
    const user = await User.findById(order.customerId);
    const store = await Store.findById(order.storeId);

    // إرسال إيميل تحديث الحالة
    if (user && store && oldStatus !== status) {
      sendOrderStatusUpdateEmail(order, user, store, oldStatus).catch((err) =>
        console.error("Order status email error:", err)
      );
    }

    res.status(200).json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في تحديث حالة الطلب",
    });
  }
};

// @desc    إحصائيات الطلبات
// @route   GET /api/orders/stats
// @access  Private (Store Owner)
exports.getOrderStats = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: "يجب أن يكون لديك متجر",
      });
    }

    const totalOrders = await Order.countDocuments({
      storeId: req.user.storeId,
    });
    const pendingOrders = await Order.countDocuments({
      storeId: req.user.storeId,
      status: "pending",
    });
    const processingOrders = await Order.countDocuments({
      storeId: req.user.storeId,
      status: "processing",
    });
    const shippedOrders = await Order.countDocuments({
      storeId: req.user.storeId,
      status: "shipped",
    });
    const deliveredOrders = await Order.countDocuments({
      storeId: req.user.storeId,
      status: "delivered",
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error("Get Order Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب الإحصائيات",
    });
  }
};

// @desc    جلب عملاء المتجر
// @route   GET /api/orders/customers
// @access  Private (Store Owner)
exports.getStoreCustomers = async (req, res) => {
  try {
    if (!req.user.storeId) {
      return res.status(403).json({
        success: false,
        message: 'يجب أن يكون لديك متجر',
      });
    }

    // جلب جميع الطلبات وتجميع العملاء
    const orders = await Order.find({ storeId: req.user.storeId })
      .populate('customerId', 'name email phone createdAt')
      .sort({ createdAt: -1 });

    // تجميع بيانات العملاء
    const customersMap = new Map();

    orders.forEach((order) => {
      const customerId = order.customerId?._id?.toString();
      if (!customerId) return;

      if (!customersMap.has(customerId)) {
        customersMap.set(customerId, {
          _id: order.customerId._id,
          name: order.customerId.name,
          email: order.customerId.email,
          phone: order.customerId.phone,
          joinedAt: order.customerId.createdAt,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null,
        });
      }

      const customer = customersMap.get(customerId);
      customer.totalOrders += 1;
      customer.totalSpent += order.total;
      
      if (!customer.lastOrderDate || new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.createdAt;
      }
    });

    const customers = Array.from(customersMap.values());

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب العملاء',
    });
  }
};
