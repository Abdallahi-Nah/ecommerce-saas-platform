const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // رقم الطلب
    orderNumber: {
      type: String,
      required: true,
      // unique: true,
    },

    // العميل
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // المتجر
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    // المنتجات
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],

    // الأسعار
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },

    // معلومات الشحن
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // الحالة
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // طريقة الدفع
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    stripePaymentIntentId: String,
    stripeSessionId: String,

    // ملاحظات
    customerNotes: String,
    adminNotes: String,

    // تواريخ مهمة
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ storeId: 1, status: 1 });
OrderSchema.index({ customerId: 1 });

// توليد رقم الطلب تلقائياً
// OrderSchema.pre("save", async function (next) {
//   if (!this.orderNumber) {
//     const count = await mongoose.model("Order").countDocuments();
//     this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
//   }
// //   next();
// });

module.exports = mongoose.model("Order", OrderSchema);
