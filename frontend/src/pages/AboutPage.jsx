import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Target,
  Eye,
  Heart,
  Zap,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Rocket,
  ArrowRight,
  Globe,
  Shield,
  Clock,
  BarChart3,
  Star,
  Package,
  Headphones,
  Code,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("data-section");
          setVisibleSections((prev) => [...new Set([...prev, sectionId])]);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    document.querySelectorAll("[data-section]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: Zap,
      title: t("about.values.value1.title"),
      description: t("about.values.value1.description"),
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Rocket,
      title: t("about.values.value2.title"),
      description: t("about.values.value2.description"),
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Award,
      title: t("about.values.value3.title"),
      description: t("about.values.value3.description"),
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Heart,
      title: t("about.values.value4.title"),
      description: t("about.values.value4.description"),
      color: "from-red-400 to-pink-500",
      bgColor: "bg-red-50",
    },
  ];

  const stats = [
    {
      value: "5,000+",
      label: t("about.stats.stores"),
      icon: Package,
      color: "text-mint-600",
    },
    {
      value: "50,000+",
      label: t("about.stats.orders"),
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      value: "2+",
      label: t("about.stats.revenue"),
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      value: "99%",
      label: t("about.stats.satisfaction"),
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const journey = [
    {
      year: "2023",
      title: t("about.journey.2023.title"),
      description: t("about.journey.2023.description"),
      icon: Rocket,
      color: "bg-blue-500",
    },
    {
      year: "2024",
      title: t("about.journey.2024.title"),
      description: t("about.journey.2024.description"),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      year: "2025",
      title: t("about.journey.2025.title"),
      description: t("about.journey.2025.description"),
      icon: Globe,
      color: "bg-purple-500",
    },
    {
      year: "2026",
      title: t("about.journey.2026.title"),
      description: t("about.journey.2026.description"),
      icon: Star,
      color: "bg-yellow-500",
    },
  ];

  const features = [
    {
      icon: Code,
      title: "تقنية متطورة",
      description: "نستخدم أحدث التقنيات لضمان أداء عالي وسرعة فائقة",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "أمان عالي",
      description: "حماية متقدمة لبياناتك ومعلومات عملائك",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      title: "متاح دائماً",
      description: "خدمة متواصلة 24/7 بدون توقف",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Headphones,
      title: "دعم فني",
      description: "فريق متخصص جاهز لمساعدتك في أي وقت",
      color: "from-orange-500 to-red-500",
    },
  ];

  const team = [
    {
      name: "محمد أحمد",
      role: "المدير التنفيذي",
      avatar: "👨‍💼",
      color: "from-mint-400 to-mint-600",
    },
    {
      name: "فاطمة علي",
      role: "مديرة التطوير",
      avatar: "👩‍💻",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "عبدالله سعيد",
      role: "مدير المنتجات",
      avatar: "👨‍🔧",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "نورة خالد",
      role: "مديرة التسويق",
      avatar: "👩‍💼",
      color: "from-pink-400 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        data-section="hero"
        className={`relative overflow-hidden bg-gradient-to-br from-mint-50 via-white to-primary-50 pt-32 pb-24 transition-all duration-1000 ${
          visibleSections.includes("hero")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 animate-bounce">
              <div className="w-20 h-20 bg-gradient-to-br from-mint-400 to-primary-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Store className="text-white" size={40} />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t("about.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-mint-600 font-semibold mb-6">
              {t("about.hero.subtitle")}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t("about.hero.description")}
            </p>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-40 h-40 bg-mint-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
      </section>

      {/* Stats Section */}
      <section
        data-section="stats"
        className={`py-20 bg-white transition-all duration-1000 delay-200 ${
          visibleSections.includes("stats")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                    visibleSections.includes("stats") ? "animate-fadeInUp" : ""
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Icon className={`mx-auto mb-4 ${stat.color}`} size={48} />
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mint-600 to-primary-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-semibold text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        data-section="mission"
        className={`py-20 bg-gray-50 transition-all duration-1000 delay-300 ${
          visibleSections.includes("mission")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-mint-100 hover:border-mint-300">
              <div className="w-20 h-20 bg-gradient-to-br from-mint-400 to-mint-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Target className="text-white" size={36} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t("about.mission.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t("about.mission.description")}
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-primary-100 hover:border-primary-300">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Eye className="text-white" size={36} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t("about.vision.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {t("about.vision.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        data-section="features"
        className={`py-20 bg-white transition-all duration-1000 delay-400 ${
          visibleSections.includes("features")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                لماذا StorePro؟
              </h2>
              <p className="text-xl text-gray-600">
                نقدم أفضل الحلول لنجاح متجرك
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 ${
                      visibleSections.includes("features")
                        ? "animate-fadeInUp"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}
                    >
                      <Icon className="text-white" size={28} />
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

      {/* Values Section */}
      <section
        data-section="values"
        className={`py-20 bg-gradient-to-br from-gray-50 to-mint-50 transition-all duration-1000 delay-500 ${
          visibleSections.includes("values")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t("about.values.title")}
              </h2>
              <p className="text-xl text-gray-600">المبادئ التي نؤمن بها</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className={`group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-2 ${
                      visibleSections.includes("values")
                        ? "animate-fadeInUp"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform shadow-2xl`}
                    >
                      <Icon className="text-white" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        data-section="team"
        className={`py-20 bg-white transition-all duration-1000 delay-600 ${
          visibleSections.includes("team")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t("about.team.title")}
              </h2>
              <p className="text-xl text-gray-600">
                {t("about.team.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`group text-center ${
                    visibleSections.includes("team") ? "animate-fadeInUp" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`relative w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-6xl shadow-2xl group-hover:scale-110 transition-transform`}
                  >
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-mint-600 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section
        data-section="journey"
        className={`py-20 bg-gray-50 transition-all duration-1000 delay-700 ${
          visibleSections.includes("journey")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t("about.journey.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {journey.map((item, index) => {
                const Icon = item.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-6 ${
                      isEven ? "flex-row" : "flex-row-reverse"
                    } ${
                      visibleSections.includes("journey")
                        ? "animate-fadeInUp"
                        : ""
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex-1">
                      <div
                        className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                          isEven ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`inline-block ${item.color} text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg`}
                          >
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-20 h-20 ${item.color} rounded-full flex items-center justify-center shadow-2xl flex-shrink-0`}
                    >
                      <Icon className="text-white" size={32} />
                    </div>

                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        data-section="cta"
        className={`py-24 bg-gradient-to-br from-mint-500 via-primary-600 to-secondary-600 relative overflow-hidden transition-all duration-1000 delay-800 ${
          visibleSections.includes("cta")
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle
                className="mx-auto text-white animate-bounce"
                size={80}
              />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("about.cta.title")}
            </h2>
            <p className="text-2xl text-white/95 mb-10 leading-relaxed">
              {t("about.cta.description")}
            </p>

            <button
              onClick={() => navigate("/register")}
              className="group inline-flex items-center gap-3 bg-white text-mint-600 px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all"
            >
              <span>{t("about.cta.button")}</span>
              <ArrowRight
                size={28}
                className={`group-hover:translate-x-2 transition-transform ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </button>

            <p className="text-white/90 mt-8 text-lg">
              ✨ ابدأ مجاناً • لا حاجة لبطاقة ائتمان
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const Store = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
    <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
    <path d="M5 9v5" />
    <path d="M19 9v5" />
  </svg>
);

export default AboutPage;
