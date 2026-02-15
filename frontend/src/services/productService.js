import API from "./api";

// جلب إحصائيات المتجر
export const getStoreStats = async () => {
  try {
    const response = await API.get("/products/stats");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الإحصائيات",
    };
  }
};

// جلب المنتجات
export const getProducts = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/products?${queryString}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب المنتجات",
    };
  }
};

// إنشاء منتج
export const createProduct = async (productData) => {
  try {
    const response = await API.post("/products", productData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إنشاء المنتج",
    };
  }
};

// تحديث منتج
export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/products/${id}`, productData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث المنتج",
    };
  }
};

// حذف منتج
export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في حذف المنتج",
    };
  }
};
