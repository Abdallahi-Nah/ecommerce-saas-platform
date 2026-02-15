import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Store, Menu, X } from "lucide-react";
import LanguageSwitcher from "../common/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-mint-600 rounded-lg flex items-center justify-center">
              <Store className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">StorePro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-700 hover:text-mint-600 font-medium transition"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-mint-600 font-medium transition"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-mint-500 hover:bg-mint-600 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                {t("nav.register")}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-mint-600 font-medium py-2"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center text-gray-700 hover:text-mint-600 font-medium py-2"
              >
                {t("nav.login")}
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
                className="block w-full bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                {t("nav.register")}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
