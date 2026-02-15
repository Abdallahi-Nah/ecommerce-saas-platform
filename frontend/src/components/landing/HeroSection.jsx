import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Check } from "lucide-react";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-right animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-mint-100 text-mint-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Check size={16} />
                <span>{t("landing.hero.trustedBy")}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t("landing.hero.title")}
                <span className="block gradient-primary bg-clip-text text-transparent mt-2">
                  {t("landing.hero.subtitle")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {t("landing.hero.description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <button
                  onClick={() => navigate("/register")}
                  className="group bg-mint-500 hover:bg-mint-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t("landing.hero.cta")}</span>
                  <ArrowRight
                    size={20}
                    className={`group-hover:translate-x-1 transition-transform ${
                      isRTL ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <button
                  onClick={() => window.open("#demo", "_blank")}
                  className="group border-2 border-gray-300 hover:border-mint-500 text-gray-700 hover:text-mint-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  <span>{t("landing.hero.secondaryCta")}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-end items-center opacity-60">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">5K+</p>
                  <p className="text-sm text-gray-600">متجر نشط</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-600">طلب شهرياً</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">99.9%</p>
                  <p className="text-sm text-gray-600">وقت التشغيل</p>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative animate-slideInRight">
              <div className="relative">
                {/* Dashboard Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-mint-500 to-primary-600 rounded-xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                      <div>
                        <div className="h-4 w-32 bg-white/30 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-white/20 rounded"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="h-3 w-16 bg-white/30 rounded mb-2"></div>
                        <div className="h-6 w-20 bg-white rounded"></div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                        <div className="h-3 w-16 bg-white/30 rounded mb-2"></div>
                        <div className="h-6 w-20 bg-white rounded"></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 bg-white/20 rounded"></div>
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-white/30 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-white/20 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400 rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-bounce">
                  🎉
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400 rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-pulse">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
