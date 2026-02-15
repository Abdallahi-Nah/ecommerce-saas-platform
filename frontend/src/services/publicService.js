import API from "./api";

// جلب معلومات متجر
export const getPublicStore = async (storeId) => {
  try {
    const response = await API.get(`/public/stores/${storeId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب المتجر",
    };
  }
};

// جلب منتجات متجر
export const getStoreProducts = async (storeId, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(
      `/public/stores/${storeId}/products?${queryString}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب المنتجات",
    };
  }
};

// جلب تفاصيل منتج
export const getPublicProduct = async (productId) => {
  try {
    const response = await API.get(`/public/products/${productId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب المنتج",
    };
  }
};
