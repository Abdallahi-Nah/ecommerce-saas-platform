import API from "./api";

// رفع صورة واحدة
export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await API.post("/upload/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في رفع الصورة",
    };
  }
};

// رفع صور متعددة
export const uploadProductImages = async (files) => {
  try {
    const formData = new FormData();

    // إضافة جميع الملفات
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const response = await API.post("/upload/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في رفع الصور",
    };
  }
};

// حذف صورة
export const deleteImage = async (publicId) => {
  try {
    const response = await API.delete(`/upload/${publicId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في حذف الصورة",
    };
  }
};

// رفع شعار
export const uploadLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await API.post("/upload/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في رفع الشعار",
    };
  }
};
