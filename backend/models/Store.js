const mongoose = require("mongoose");
const slugify = require("slugify");

const StoreSchema = new mongoose.Schema(
  {
    // معلومات المتجر الأساسية
    name: {
      type: String,
      required: [true, "اسم المتجر مطلوب"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    banner: {
      type: String,
      default: null,
    },

    // معلومات الاتصال
    email: {
      type: String,
      required: [true, "البريد الإلكتروني للمتجر مطلوب"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // صاحب المتجر
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // إعدادات المتجر
    settings: {
      currency: {
        type: String,
        default: "SAR",
      },
      language: {
        type: String,
        enum: ["en", "ar", "fr"],
        default: "ar",
      },
      timezone: {
        type: String,
        default: "Asia/Riyadh",
      },
      isRTL: {
        type: Boolean,
        default: true,
      },
    },

    // الاشتراك والباقة
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "suspended", "cancelled"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: null,
      },
      stripeSubscriptionId: {
        type: String,
        default: null,
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      stripePriceId: String,
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
    },

    // حدود الباقة
    limits: {
      products: {
        type: Number,
        default: 10, // Free plan: 10 products
      },
      orders: {
        type: Number,
        default: 100, // Free plan: 100 orders/month
      },
      storage: {
        type: Number,
        default: 100, // بالـ MB
      },
    },

    // الإحصائيات
    stats: {
      totalProducts: {
        type: Number,
        default: 0,
      },
      totalOrders: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      totalCustomers: {
        type: Number,
        default: 0,
      },
    },

    // حالة المتجر
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Domain مخصص (اختياري)
    customDomain: {
      type: String,
      default: null,
    },

    // تاريخ الإطلاق
    launchedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
StoreSchema.index({ slug: 1 });
StoreSchema.index({ ownerId: 1 });
StoreSchema.index({ "subscription.status": 1 });

// دالة لإنشاء slug من الاسم
StoreSchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      locale: "ar", // Support de l'arabe
      trim: true,
    });
  }
});


module.exports = mongoose.model("Store", StoreSchema);
