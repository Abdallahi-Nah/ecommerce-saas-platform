/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import API from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => Cookies.get("token") || null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // ← أضف هذا

  // التحقق من الـ token عند بدء التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = Cookies.get("token");
      if (savedToken) {
        try {
          await fetchUser();
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setInitializing(false);
    };

    checkAuth();
  }, []);

  // حفظ المستخدم والتوكن
  const saveAuthData = (userData, userToken) => {
    Cookies.set("token", userToken, { expires: 30 });
    Cookies.set("user", JSON.stringify(userData), { expires: 30 });
    setUser(userData);
    setToken(userToken);
  };

  // تسجيل الدخول
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/login", { email, password });

      const { user: userData, token: userToken } = response.data.data;

      saveAuthData(userData, userToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "خطأ في تسجيل الدخول",
      };
    } finally {
      setLoading(false);
    }
  };

  // التسجيل (عميل عادي)
  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/register", {
        name,
        email,
        password,
        phone,
        role: "customer",
      });

      const { user: userData, token: userToken } = response.data.data;

      saveAuthData(userData, userToken);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "خطأ في التسجيل",
      };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل متجر
  const registerStore = async (formData) => {
    try {
      setLoading(true);
      const response = await API.post("/auth/register-store", formData);

      const { user: userData, token: userToken } = response.data.data;

      saveAuthData(userData, userToken);

      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "خطأ في إنشاء المتجر",
      };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setToken(null);
  };

  // جلب بيانات المستخدم الحالي
  const fetchUser = async () => {
    try {
      const response = await API.get("/auth/me");
      const userData = response.data.data;

      setUser(userData);
      Cookies.set("user", JSON.stringify(userData), { expires: 30 });

      return { success: true };
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    initializing, // ← أضف هذا
    isAuthenticated: !!token,
    login,
    register,
    registerStore,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
