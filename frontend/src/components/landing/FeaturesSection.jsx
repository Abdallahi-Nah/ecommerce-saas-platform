import { useTranslation } from "react-i18next";
import {
  Package,
  ShoppingCart,
  BarChart3,
  Globe,
  Smartphone,
  Shield,
} from "lucide-react";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Package,
      title: t("landing.features.feature1.title"),
      description: t("landing.features.feature1.description"),
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: ShoppingCart,
      title: t("landing.features.feature2.title"),
      description: t("landing.features.feature2.description"),
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: t("landing.features.feature3.title"),
      description: t("landing.features.feature3.description"),
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Globe,
      title: t("landing.features.feature4.title"),
      description: t("landing.features.feature4.description"),
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Smartphone,
      title: t("landing.features.feature5.title"),
      description: t("landing.features.feature5.description"),
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Shield,
      title: t("landing.features.feature6.title"),
      description: t("landing.features.feature6.description"),
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("landing.features.subtitle")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-gray-50 hover:bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-mint-200"
                >
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
