const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Store = require("../models/Store");
const { sendOrderConfirmationEmail } = require("../services/emailService");
const User = require("../models/User");

// @desc    إنشاء Checkout Session للطلب
// @route   POST /api/payments/create-checkout
// @access  Private (Customer)
exports.createOrderCheckout = async (req, res) => {
  try {
    const { storeId, items, shippingAddress, customerNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "يجب إضافة منتجات للطلب",
      });
    }

    // حساب الإجماليات وتجهيز المنتجات
    let subtotal = 0;
    const orderItems = [];
    const lineItems = [];

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

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || null,
      });

      // تجهيز line items لـ Stripe
      lineItems.push({
        price_data: {
          currency: "sar",
          product_data: {
            name: product.name,
            description: product.description?.substring(0, 100) || "",
            images: product.images?.[0]?.url ? [product.images[0].url] : [],
          },
          unit_amount: Math.round(product.price * 100), // تحويل للهللات
        },
        quantity: item.quantity,
      });
    }

    const shippingCost = 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // إنشاء الطلب مسبقاً مع حالة pending
    const order = await Order.create({
      customerId: req.user._id,
      storeId: storeId,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      total,
      shippingAddress,
      paymentMethod: "card",
      paymentStatus: "pending",
      customerNotes,
      orderNumber: `ORD-${Date.now()}-${await Order.countDocuments()}`,
    });

    // إنشاء Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/store/${storeId}/orders/${order._id}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/store/${storeId}/checkout?payment=cancelled`,
      customer_email: req.user.email,
      metadata: {
        orderId: order._id.toString(),
        storeId: storeId,
        customerId: req.user._id.toString(),
      },
    });

    // حفظ session ID في الطلب
    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create Order Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء جلسة الدفع",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Webhook للتأكد من الدفع
// @route   POST /api/payments/webhook
// @access  Public (Stripe only)
exports.paymentWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

// معالجات الأحداث
async function handleCheckoutCompleted(session) {
  const orderId = session.metadata.orderId;
  const order = await Order.findById(orderId);

  if (order) {
    // تحديث حالة الطلب
    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.stripePaymentIntentId = session.payment_intent;
    await order.save();

    // تحديث المخزون
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;
        if (product.stats) {
          product.stats.sales = (product.stats.sales || 0) + item.quantity;
        }
        await product.save();
      }
    }

    // تحديث إحصائيات المتجر
    await Store.findByIdAndUpdate(order.storeId, {
      $inc: {
        "stats.totalOrders": 1,
        "stats.totalRevenue": order.total,
      },
    });

    // إرسال إيميل تأكيد الطلب
    try {
      const user = await User.findById(order.customerId);
      const store = await Store.findById(order.storeId);

      if (user && store) {
        await sendOrderConfirmationEmail(order, user, store);
        console.log("Order confirmation email sent");
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent) {
  const order = await Order.findOne({
    stripePaymentIntentId: paymentIntent.id,
  });

  if (order) {
    order.paymentStatus = "failed";
    await order.save();
  }
}

