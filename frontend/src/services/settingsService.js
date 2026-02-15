import API from "./api";

// جلب معلومات المتجر
export const getStore = async () => {
  try {
    const response = await API.get("/auth/store");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في جلب معلومات المتجر",
    };
  }
};

// تحديث معلومات المتجر
export const updateStore = async (storeData) => {
  try {
    const response = await API.put("/auth/store", storeData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث المتجر",
    };
  }
};

// تحديث الملف الشخصي
export const updateProfile = async (profileData) => {
  try {
    const response = await API.put("/auth/profile", profileData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "فشل في تحديث الملف الشخصي",
    };
  }
};
