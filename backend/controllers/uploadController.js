const cloudinary = require("../config/cloudinary");

// @desc    رفع صورة منتج واحدة
// @route   POST /api/upload/product
// @access  Private (Store Owner)
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "لم يتم رفع أي صورة",
      });
    }

    res.status(200).json({
      success: true,
      message: "تم رفع الصورة بنجاح",
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في رفع الصورة",
    });
  }
};

// @desc    رفع صور متعددة للمنتج
// @route   POST /api/upload/products
// @access  Private (Store Owner)
exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "لم يتم رفع أي صور",
      });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: `تم رفع ${images.length} صورة بنجاح`,
      data: images,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في رفع الصور",
    });
  }
};

// @desc    حذف صورة
// @route   DELETE /api/upload/:publicId
// @access  Private (Store Owner)
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "معرف الصورة مطلوب",
      });
    }

    // حذف من Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "تم حذف الصورة بنجاح",
    });
  } catch (error) {
    console.error("Delete Image Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في حذف الصورة",
    });
  }
};

// @desc    رفع شعار المتجر
// @route   POST /api/upload/logo
// @access  Private (Store Owner)
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "لم يتم رفع أي صورة",
      });
    }

    res.status(200).json({
      success: true,
      message: "تم رفع الشعار بنجاح",
      data: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Upload Logo Error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في رفع الشعار",
    });
  }
};
