const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary Storage للمنتجات
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "storepro/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Cloudinary Storage للشعارات
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "storepro/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Multer Config
const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("صيغة الملف غير مدعومة! يُرجى رفع صورة."), false);
    }
  },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("صيغة الملف غير مدعومة! يُرجى رفع صورة."), false);
    }
  },
});

module.exports = {
  uploadProduct,
  uploadLogo,
};
