import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Check, Star } from "lucide-react";

const PricingSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: t("landing.pricing.free.name"),
      price: t("landing.pricing.free.price"),
      description: t("landing.pricing.free.description"),
      features: t("landing.pricing.free.features", { returnObjects: true }),
      cta: t("landing.pricing.free.cta"),
      popular: false,
      color: "border-gray-200",
    },
    {
      name: t("landing.pricing.basic.name"),
      price: isYearly ? "79" : t("landing.pricing.basic.price"),
      description: t("landing.pricing.basic.description"),
      features: t("landing.pricing.basic.features", { returnObjects: true }),
      cta: t("landing.pricing.basic.cta"),
      popular: true,
      color: "border-mint-500 ring-4 ring-mint-100",
    },
    {
      name: t("landing.pricing.pro.name"),
      price: isYearly ? "239" : t("landing.pricing.pro.price"),
      description: t("landing.pricing.pro.description"),
      features: t("landing.pricing.pro.features", { returnObjects: true }),
      cta: t("landing.pricing.pro.cta"),
      popular: false,
      color: "border-gray-200",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.pricing.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("landing.pricing.subtitle")}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 bg-white p-2 rounded-full shadow-md">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  !isYearly
                    ? "bg-mint-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("landing.pricing.monthly")}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                  isYearly
                    ? "bg-mint-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("landing.pricing.yearly")}
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                  {t("landing.pricing.save")}
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 ${
                  plan.color
                } ${
                  plan.popular ? "transform md:-translate-y-4" : ""
                } transition-all hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-mint-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <Star size={16} fill="currentColor" />
                      {t("landing.pricing.basic.popular")}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-gray-600 mb-2">
                        {t("landing.pricing.currency")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-mint-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigate("/register")}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-mint-500 hover:bg-mint-600 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-gray-300 hover:border-mint-500 text-gray-700 hover:text-mint-600"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
