import API from "./api";

// جلب طلبات المتجر
export const getStoreOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/orders?${queryString}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الطلبات",
    };
  }
};

// جلب تفاصيل طلب
export const getOrderById = async (id) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الطلب",
    };
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await API.put(`/orders/${id}/status`, { status });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث الحالة",
    };
  }
};

// جلب إحصائيات الطلبات
export const getOrderStats = async () => {
  try {
    const response = await API.get("/orders/stats");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الإحصائيات",
    };
  }
};

// جلب عملاء المتجر
export const getStoreCustomers = async () => {
  try {
    const response = await API.get('/orders/customers');
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'فشل في جلب العملاء',
    };
  }
};