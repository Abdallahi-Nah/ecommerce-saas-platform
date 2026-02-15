import API from "./api";

// إنشاء Checkout Session
export const createCheckoutSession = async (plan) => {
  try {
    const response = await API.post("/subscriptions/create-checkout", { plan });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إنشاء جلسة الدفع",
    };
  }
};

// جلب الاشتراك الحالي
export const getCurrentSubscription = async () => {
  try {
    const response = await API.get("/subscriptions/current");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب الاشتراك",
    };
  }
};

// إلغاء الاشتراك
export const cancelSubscription = async () => {
  try {
    const response = await API.post("/subscriptions/cancel");
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في إلغاء الاشتراك",
    };
  }
};

// استئناف الاشتراك
export const resumeSubscription = async () => {
  try {
    const response = await API.post("/subscriptions/resume");
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في استئناف الاشتراك",
    };
  }
};
