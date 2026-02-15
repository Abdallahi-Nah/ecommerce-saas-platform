import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ShoppingBag, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import API from "../../services/api";

const RegisterCustomer = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("register");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    countryCode: "+966",
  });

  const countryCodes = [
    { code: "+966", flag: "🇸🇦", name: "السعودية" },
    { code: "+971", flag: "🇦🇪", name: "الإمارات" },
    { code: "+222", flag: "🇲🇷", name: "موريتانيا" },
    { code: "+20", flag: "🇪🇬", name: "مصر" },
    { code: "+212", flag: "🇲🇦", name: "المغرب" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error(t("registerCustomer.validation.allFieldsRequired"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("registerCustomer.validation.passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t("registerCustomer.validation.passwordMinLength"));
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/register-customer", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? `${formData.countryCode}${formData.phone}` : "",
        password: formData.password,
      });

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        toast.success(t("registerCustomer.messages.success"));
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("registerCustomer.messages.error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Sidebar features with translation
  const sidebarFeatures = [
    t("registerCustomer.sidebar.features.browse"),
    t("registerCustomer.sidebar.features.payment"),
    t("registerCustomer.sidebar.features.shipping"),
    t("registerCustomer.sidebar.features.support"),
  ];

  return (
    <div
      className={`min-h-screen flex ${
        isRTL ? "flex-row-reverse" : ""
      } bg-gray-50`}
    >
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              StorePro
            </h1>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-3 md:py-4 text-sm md:text-base text-center font-semibold transition text-gray-500 hover:text-gray-700"
          >
            {t("auth.login")}
          </button>
          <button className="flex-1 py-3 md:py-4 text-sm md:text-base text-center font-semibold transition text-blue-600 border-b-2 border-blue-600">
            {t("registerCustomer.pageTitle")}
          </button>
        </div>

        {/* Back to Choice Link */}
        <div className="px-4 pt-3 pb-2">
          <Link
            to="/register"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            {isRTL ? "← " : "→ "}
            {t("registerCustomer.backToChoice")}
          </Link>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            {/* Personal Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("registerCustomer.sections.personalInfo")}
              </h3>

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registerCustomer.form.name.label")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("registerCustomer.form.name.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registerCustomer.form.email.label")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("registerCustomer.form.email.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              {/* Phone with Country Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registerCustomer.form.phone.label")}
                </label>
                <div className="flex gap-2">
                  <div className="relative w-28">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryCode: e.target.value,
                        })
                      }
                      className="appearance-none w-full px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("registerCustomer.form.phone.placeholder")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registerCustomer.form.password.label")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t(
                      "registerCustomer.form.password.placeholder"
                    )}
                    className={`w-full px-4 py-3 ${
                      isRTL ? "pl-12 pr-4" : "pr-12 pl-4"
                    } border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRTL ? "left-3" : "right-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("registerCustomer.form.confirmPassword.label")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t(
                      "registerCustomer.form.confirmPassword.placeholder"
                    )}
                    className={`w-full px-4 py-3 ${
                      isRTL ? "pl-12 pr-4" : "pr-12 pl-4"
                    } border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      isRTL ? "left-3" : "right-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 md:py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-6 text-sm md:text-base"
            >
              {loading
                ? t("registerCustomer.buttons.loading")
                : t("registerCustomer.buttons.register")}
            </button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 mt-4">
              {t("registerCustomer.terms.text")}{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {t("registerCustomer.terms.termsOfUse")}
              </a>{" "}
              {t("registerCustomer.terms.and")}{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {t("registerCustomer.terms.privacyPolicy")}
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-cyan-100 p-12 flex-col justify-center items-center">
        <div className="max-w-md text-center space-y-8">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("registerCustomer.sidebar.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("registerCustomer.sidebar.description")}
          </p>

          {/* Features */}
          <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            {sidebarFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomer;
