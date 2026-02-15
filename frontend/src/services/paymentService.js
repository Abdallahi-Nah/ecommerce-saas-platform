import API from "./api";

// إنشاء Checkout Session للطلب
export const createOrderCheckout = async (orderData) => {
  try {
    const response = await API.post("/payments/create-checkout", orderData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إنشاء جلسة الدفع",
    };
  }
};
