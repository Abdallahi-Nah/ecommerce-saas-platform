const stripe = require("../config/stripe");
const Store = require("../models/Store");

// خطط الاشتراك
const PLANS = {
  free: {
    name: "Free",
    price: 0,
    stripePriceId: null,
    features: {
      maxProducts: 10,
      maxOrders: 100,
    },
  },
  basic: {
    name: "Basic",
    price: 99,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: {
      maxProducts: 100,
      maxOrders: 1000,
    },
  },
  pro: {
    name: "Pro",
    price: 299,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      maxProducts: -1,
      maxOrders: -1,
    },
  },
};

// معالجات الأحداث (يجب أن تكون قبل الـ exports)
async function handleCheckoutCompleted(session) {
  const storeId = session.metadata.storeId;
  const plan = session.metadata.plan;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription
  );

  await Store.findByIdAndUpdate(storeId, {
    "subscription.plan": plan,
    "subscription.status": "active",
    "subscription.stripeCustomerId": session.customer,
    "subscription.stripeSubscriptionId": session.subscription,
    "subscription.stripePriceId": subscription.items.data[0].price.id,
    "subscription.currentPeriodStart": new Date(
      subscription.current_period_start * 1000
    ),
    "subscription.currentPeriodEnd": new Date(
      subscription.current_period_end * 1000
    ),
    "subscription.cancelAtPeriodEnd": false,
    "limits.maxProducts": PLANS[plan].features.maxProducts,
    "limits.maxOrders": PLANS[plan].features.maxOrders,
  });
}

async function handleSubscriptionUpdated(subscription) {
  const store = await Store.findOne({
    "subscription.stripeSubscriptionId": subscription.id,
  });

  if (store) {
    store.subscription.status = subscription.status;
    store.subscription.currentPeriodStart = new Date(
      subscription.current_period_start * 1000
    );
    store.subscription.currentPeriodEnd = new Date(
      subscription.current_period_end * 1000
    );
    store.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
    await store.save();
  }
}

async function handleSubscriptionDeleted(subscription) {
  const store = await Store.findOne({
    "subscription.stripeSubscriptionId": subscription.id,
  });

  if (store) {
    store.subscription.plan = "free";
    store.subscription.status = "cancelled";
    store.limits.maxProducts = PLANS.free.features.maxProducts;
    store.limits.maxOrders = PLANS.free.features.maxOrders;
    await store.save();
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log("Payment succeeded for invoice:", invoice.id);
}

async function handlePaymentFailed(invoice) {
  const store = await Store.findOne({
    "subscription.stripeCustomerId": invoice.customer,
  });

  if (store) {
    store.subscription.status = "past_due";
    await store.save();
  }
}

// @desc    إنشاء Checkout Session
// @route   POST /api/subscriptions/create-checkout
// @access  Private (Store Owner)
const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["basic", "pro"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "خطة غير صالحة",
      });
    }

    const store = await Store.findById(req.user.storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "المتجر غير موجود",
      });
    }

    const selectedPlan = PLANS[plan];

    if (!selectedPlan.stripePriceId) {
      return res.status(400).json({
        success: false,
        message: "معرف السعر غير موجود. يرجى التحقق من إعدادات Stripe",
      });
    }

    // إنشاء أو جلب Stripe Customer
    let customerId = store.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          storeId: store._id.toString(),
          userId: req.user._id.toString(),
        },
      });
      customerId = customer.id;
    }

    // إنشاء Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // استخدم localhost مباشرة لـ Development
      success_url: `http://localhost:5173/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/dashboard/subscription/cancel`,
      metadata: {
        storeId: store._id.toString(),
        plan: plan,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Create Checkout Session Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إنشاء جلسة الدفع",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    جلب معلومات الاشتراك
// @route   GET /api/subscriptions/current
// @access  Private (Store Owner)
const getCurrentSubscription = async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "المتجر غير موجود",
      });
    }

    const currentPlan = PLANS[store.subscription?.plan || "free"];

    res.status(200).json({
      success: true,
      data: {
        plan: store.subscription?.plan || "free",
        status: store.subscription?.status || "active",
        features: currentPlan.features,
        currentPeriodEnd: store.subscription?.currentPeriodEnd,
        cancelAtPeriodEnd: store.subscription?.cancelAtPeriodEnd,
      },
    });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في جلب معلومات الاشتراك",
    });
  }
};

// @desc    إلغاء الاشتراك
// @route   POST /api/subscriptions/cancel
// @access  Private (Store Owner)
const cancelSubscription = async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);

    if (!store || !store.subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "لا يوجد اشتراك نشط",
      });
    }

    await stripe.subscriptions.update(store.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    store.subscription.cancelAtPeriodEnd = true;
    await store.save();

    res.status(200).json({
      success: true,
      message: "سيتم إلغاء الاشتراك في نهاية الفترة الحالية",
    });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في إلغاء الاشتراك",
    });
  }
};

// @desc    استئناف الاشتراك
// @route   POST /api/subscriptions/resume
// @access  Private (Store Owner)
const resumeSubscription = async (req, res) => {
  try {
    const store = await Store.findById(req.user.storeId);

    if (!store || !store.subscription?.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "لا يوجد اشتراك للاستئناف",
      });
    }

    await stripe.subscriptions.update(store.subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    store.subscription.cancelAtPeriodEnd = false;
    await store.save();

    res.status(200).json({
      success: true,
      message: "تم استئناف الاشتراك بنجاح",
    });
  } catch (error) {
    console.error("Resume Subscription Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في استئناف الاشتراك",
    });
  }
};

// @desc    Stripe Webhook
// @route   POST /api/subscriptions/webhook
// @access  Public (Stripe only)
const stripeWebhook = async (req, res) => {
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

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
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

module.exports = {
  createCheckoutSession,
  getCurrentSubscription,
  cancelSubscription,
  resumeSubscription,
  stripeWebhook,
};
