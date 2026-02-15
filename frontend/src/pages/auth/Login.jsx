import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Store, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error(t("errors.required"));
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success(t("auth.loginSuccess"));
      navigate("/dashboard");
    } else {
      toast.error(result.error);
    }
  };

  // Stats with translation
  const stats = [
    {
      number: t("login.sidebar.stats.stores.number"),
      label: t("login.sidebar.stats.stores.label"),
    },
    {
      number: t("login.sidebar.stats.uptime.number"),
      label: t("login.sidebar.stats.uptime.label"),
    },
    {
      number: t("login.sidebar.stats.support.number"),
      label: t("login.sidebar.stats.support.label"),
    },
    {
      number: t("login.sidebar.stats.features.number"),
      label: t("login.sidebar.stats.features.label"),
    },
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
            <div className="w-8 h-8 md:w-10 md:h-10 bg-mint-600 rounded-lg flex items-center justify-center">
              <Store className="text-white" size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              StorePro
            </h1>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {t("login.welcome.title")}
              </h2>
              <p className="text-gray-600">{t("login.welcome.subtitle")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.form.email.label")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("login.form.email.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent text-sm md:text-base"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("login.form.password.label")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("login.form.password.placeholder")}
                    className={`w-full px-4 py-3 ${
                      isRTL ? "pl-12 pr-4" : "pr-12 pl-4"
                    } border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent text-sm md:text-base`}
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-mint-600 border-gray-300 rounded focus:ring-mint-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t("login.form.rememberMe")}
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-mint-600 hover:underline"
                >
                  {t("login.form.forgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 md:py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm md:text-base"
              >
                {loading
                  ? t("login.buttons.loading")
                  : t("login.buttons.login")}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {t("login.register.text")}{" "}
                <Link
                  to="/register"
                  className="text-mint-600 hover:underline font-medium"
                >
                  {t("login.register.link")}
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {t("login.divider.or")}
                </span>
              </div>
            </div>

            {/* Customer Login Link */}
            <Link
              to="/customer-login"
              className="flex items-center justify-center gap-2 w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              <span>{t("login.buttons.customerLogin")}</span>
              <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
        </div>
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint-50 to-mint-100 p-12 flex-col justify-center items-center">
        <div className="max-w-md text-center space-y-8">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t("login.sidebar.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("login.sidebar.description")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-mint-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
