import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  return (
    <section className="py-20 bg-gradient-to-br from-mint-500 via-primary-600 to-secondary-600 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Sparkles className="text-white" size={40} />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("landing.cta.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-white/90 mb-10">
            {t("landing.cta.subtitle")}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/register")}
            className="group inline-flex items-center gap-3 bg-white text-mint-600 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all"
          >
            <span>{t("landing.cta.button")}</span>
            <ArrowRight
              size={24}
              className={`group-hover:translate-x-1 transition-transform ${
                isRTL ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Trust Message */}
          <p className="text-white/80 mt-8">
            ✨ لا حاجة لبطاقة ائتمان • ابدأ في أقل من دقيقة
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
