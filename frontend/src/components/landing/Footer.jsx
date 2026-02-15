import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-mint-500 rounded-lg flex items-center justify-center">
                  <Store className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">StorePro</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                {t("landing.footer.description")}
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-mint-500 rounded-lg flex items-center justify-center transition"
                >
                  <span className="text-xl">📘</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-mint-500 rounded-lg flex items-center justify-center transition"
                >
                  <span className="text-xl">🐦</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-mint-500 rounded-lg flex items-center justify-center transition"
                >
                  <span className="text-xl">📸</span>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                {t("landing.footer.product")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="hover:text-mint-400 transition"
                  >
                    {t("landing.footer.features")}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-mint-400 transition">
                    {t("landing.footer.pricing")}
                  </a>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-mint-400 transition"
                  >
                    {t("nav.register")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                {t("landing.footer.company")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="hover:text-mint-400 transition">
                    {t("landing.footer.aboutUs")}
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-mint-400 transition">
                    {t("landing.footer.blog")}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-mint-400 transition">
                    {t("landing.footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                {t("landing.footer.support")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail size={18} className="text-mint-400" />
                  <a
                    href="mailto:support@storepro.com"
                    className="hover:text-mint-400 transition"
                  >
                    support@storepro.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={18} className="text-mint-400" />
                  <a
                    href="tel:+966501234567"
                    className="hover:text-mint-400 transition"
                  >
                    +966 50 123 4567
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin
                    size={18}
                    className="text-mint-400 flex-shrink-0 mt-1"
                  />
                  <span>الرياض، المملكة العربية السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} StorePro. {t("landing.footer.rights")}
              </p>

              <div className="flex gap-6 text-sm">
                <a href="#privacy" className="hover:text-mint-400 transition">
                  {t("landing.footer.privacy")}
                </a>
                <a href="#terms" className="hover:text-mint-400 transition">
                  {t("landing.footer.terms")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
