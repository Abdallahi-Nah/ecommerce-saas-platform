import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  Store,
  User,
  Lock,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Save,
  Upload,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  getStore,
  updateStore,
  updateProfile,
} from "../../services/settingsService";
import toast from "react-hot-toast";
import { uploadLogo } from "../../services/uploadService";

const Settings = () => {
  const { user, fetchUser } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [activeTab, setActiveTab] = useState("store"); // store, profile, security
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    logo: "",
    banner: "",
    currency: "SAR",
    language: "ar",
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchSettings = async () => {
    setLoading(true);

    // جلب معلومات المتجر
    const result = await getStore();
    if (result.success) {
      const store = result.data;
      setStoreData({
        name: store.name || "",
        description: store.description || "",
        email: store.email || "",
        phone: store.phone || "",
        logo: store.logo || "",
        banner: store.banner || "",
        currency: store.settings?.currency || "SAR",
        language: store.settings?.language || "ar",
      });
    }

    // تعيين بيانات المستخدم
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من الحجم
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الشعار يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    setUploadingLogo(true);

    const result = await uploadLogo(file);

    if (result.success) {
      setStoreData({ ...storeData, logo: result.data.url });
      toast.success("تم رفع الشعار بنجاح!");
    } else {
      toast.error(result.error);
    }

    setUploadingLogo(false);
    e.target.value = "";
  };

  const handleStoreChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateStore(storeData);

    if (result.success) {
      toast.success(t("settings.messages.storeUpdateSuccess"));
    } else {
      toast.error(result.error || t("settings.messages.updateError"));
    }

    setSaving(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateProfile(profileData);

    if (result.success) {
      toast.success(t("settings.messages.profileUpdateSuccess"));
      await fetchUser();
    } else {
      toast.error(result.error || t("settings.messages.updateError"));
    }

    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t("settings.messages.passwordMismatch"));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(t("settings.messages.passwordTooShort"));
      return;
    }

    setSaving(true);

    const result = await updateProfile({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      toast.success(t("settings.messages.passwordChangeSuccess"));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.error || t("settings.messages.updateError"));
    }

    setSaving(false);
  };

  const tabs = [
    { id: "store", label: t("settings.tabs.store"), icon: Store },
    { id: "profile", label: t("settings.tabs.profile"), icon: User },
    { id: "security", label: t("settings.tabs.security"), icon: Lock },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-gray-600">{t("settings.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition border-b border-gray-100 last:border-0 ${
                    activeTab === tab.id
                      ? "bg-mint-50 text-mint-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Store Settings */}
          {activeTab === "store" && (
            <form onSubmit={handleSaveStore} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  {t("settings.store.title")}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.store.name")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={storeData.name}
                      onChange={handleStoreChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.store.description")}
                    </label>
                    <textarea
                      name="description"
                      value={storeData.description}
                      onChange={handleStoreChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail
                          size={16}
                          className={`inline ${isRTL ? "mr-1" : "ml-1"}`}
                        />
                        {t("settings.store.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={storeData.email}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone
                          size={16}
                          className={`inline ${isRTL ? "mr-1" : "ml-1"}`}
                        />
                        {t("settings.store.phone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={storeData.phone}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ImageIcon size={16} className="inline ml-1" />
                      {t("imageUpload.storeLogo")}
                    </label>

                    {/* Preview */}
                    {storeData.logo && (
                      <div className="mb-3">
                        <img
                          src={storeData.logo}
                          alt="Logo"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                        />
                      </div>
                    )}

                    {/* Upload Button */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                        uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingLogo ? (
                        <>
                          <Loader className="animate-spin" size={18} />
                          <span>{t("imageUpload.uploading")}</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          <span>{t("imageUpload.uploadLogo")}</span>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("imageUpload.logoFileFormats")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe
                          size={16}
                          className={`inline ${isRTL ? "mr-1" : "ml-1"}`}
                        />
                        {t("settings.store.currency")}
                      </label>
                      <select
                        name="currency"
                        value={storeData.currency}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white"
                      >
                        <option value="SAR">
                          {t("settings.store.currencies.SAR")}
                        </option>
                        <option value="USD">
                          {t("settings.store.currencies.USD")}
                        </option>
                        <option value="EUR">
                          {t("settings.store.currencies.EUR")}
                        </option>
                        <option value="AED">
                          {t("settings.store.currencies.AED")}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("settings.store.language")}
                      </label>
                      <select
                        name="language"
                        value={storeData.language}
                        onChange={handleStoreChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white"
                      >
                        <option value="ar">
                          {t("settings.store.languages.ar")}
                        </option>
                        <option value="en">
                          {t("settings.store.languages.en")}
                        </option>
                        <option value="fr">
                          {t("settings.store.languages.fr")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving
                    ? t("settings.actions.saving")
                    : t("settings.actions.save")}
                </button>
              </div>
            </form>
          )}

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  {t("settings.profile.title")}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.profile.fullName")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.profile.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.profile.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving
                    ? t("settings.actions.saving")
                    : t("settings.actions.save")}
                </button>
              </div>
            </form>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  {t("settings.security.title")}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.security.currentPassword")}
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.security.newPassword")}
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t("settings.security.passwordHint")}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("settings.security.confirmPassword")}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  <Lock size={20} />
                  {saving
                    ? t("settings.actions.saving")
                    : t("settings.security.changePassword")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
