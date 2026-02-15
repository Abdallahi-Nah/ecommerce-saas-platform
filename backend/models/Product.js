const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema(
  {
    // معلومات المنتج الأساسية
    name: {
      type: String,
      required: [true, "اسم المنتج مطلوب"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // السعر والمخزون
    price: {
      type: Number,
      required: [true, "السعر مطلوب"],
      min: [0, "السعر لا يمكن أن يكون سالباً"],
    },
    compareAtPrice: {
      type: Number,
      default: null, // السعر قبل التخفيض
    },
    cost: {
      type: Number,
      default: 0, // تكلفة المنتج
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "المخزون لا يمكن أن يكون سالباً"],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },

    // الصور
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // التصنيف
    category: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // المتجر المالك
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // الحالة
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // الإحصائيات
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      sales: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewsCount: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index للبحث السريع
ProductSchema.index({ slug: 1, storeId: 1 });
ProductSchema.index({ storeId: 1, status: 1 });
ProductSchema.index({ name: "text", description: "text" });

// دالة لإنشاء slug
ProductSchema.pre("validate", function () {
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

module.exports = mongoose.model("Product", ProductSchema);
