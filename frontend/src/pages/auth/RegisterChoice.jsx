import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Store, ShoppingBag, ArrowRight, Check } from "lucide-react";

const RegisterChoice = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const options = [
    {
      type: "customer",
      title: t("registerChoice.options.customer.title"),
      subtitle: t("registerChoice.options.customer.subtitle"),
      icon: ShoppingBag,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      features: [
        t("registerChoice.options.customer.features.browse"),
        t("registerChoice.options.customer.features.cart"),
        t("registerChoice.options.customer.features.purchase"),
        t("registerChoice.options.customer.features.track"),
        t("registerChoice.options.customer.features.addresses"),
      ],
      path: "/register/customer",
    },
    {
      type: "store",
      title: t("registerChoice.options.store.title"),
      subtitle: t("registerChoice.options.store.subtitle"),
      icon: Store,
      color: "from-mint-500 to-emerald-500",
      bgColor: "bg-mint-50",
      popular: true,
      features: [
        t("registerChoice.options.store.features.create"),
        t("registerChoice.options.store.features.manage"),
        t("registerChoice.options.store.features.dashboard"),
        t("registerChoice.options.store.features.reports"),
        t("registerChoice.options.store.features.support"),
      ],
      path: "/register/store",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-mint-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-mint-600 rounded-xl flex items-center justify-center">
              <Store className="text-white" size={28} />
            </div>
            <span className="text-3xl font-bold text-gray-900">StorePro</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t("registerChoice.header.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("registerChoice.header.subtitle")}
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.type}
                className={`relative bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                  option.popular
                    ? "border-mint-500 transform md:-translate-y-2"
                    : "border-gray-200 hover:border-mint-300"
                }`}
              >
                {/* Popular Badge */}
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-mint-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      {t("registerChoice.badges.popular")}
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${option.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <Icon className="text-white" size={36} />
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {option.title}
                </h2>
                <p className="text-gray-600 mb-6">{option.subtitle}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-mint-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(option.path)}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    option.popular
                      ? "bg-gradient-to-r from-mint-500 to-emerald-500 text-white"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <span>{t("registerChoice.buttons.choose")}</span>
                  <ArrowRight size={24} className={isRTL ? "rotate-180" : ""} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            {t("registerChoice.footer.haveAccount")}{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-mint-600 hover:text-mint-700 font-semibold"
            >
              {t("registerChoice.footer.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
