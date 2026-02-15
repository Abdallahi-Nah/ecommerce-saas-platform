import API from "./api";

// جلب طلبات العميل
export const getMyOrders = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/orders/my-orders?${queryString}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الطلبات",
    };
  }
};
