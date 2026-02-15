import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة التوكن تلقائياً لكل طلب
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة الأخطاء العامة
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إزالة التوكن وإعادة التوجيه
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
      toast.error("انتهت جلستك، يرجى تسجيل الدخول مرة أخرى");
    } else if (error.response?.status === 500) {
      toast.error("خطأ في الخادم، يرجى المحاولة لاحقاً");
    } else if (!error.response) {
      toast.error("خطأ في الاتصال، تحقق من الإنترنت");
    }
    return Promise.reject(error);
  }
);

export default API;
