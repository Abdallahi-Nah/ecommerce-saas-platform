import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Store, Search } from "lucide-react";
import LanguageSwitcher from "../common/LanguageSwitcher";

const StorefrontLayout = ({ children, storeInfo }) => {
  const { getCartCount } = useCart();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const cartCount = getCartCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={`/store/${storeInfo?._id}`}
              className="flex items-center gap-3"
            >
              {storeInfo?.logo ? (
                <img
                  src={storeInfo.logo}
                  alt={storeInfo.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-mint-600 rounded-lg flex items-center justify-center">
                  <Store className="text-white" size={24} />
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {storeInfo?.name || t("storefront.store")}
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {/* Cart */}
              <Link
                to={`/store/${storeInfo?._id}/cart`}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                title={t("storefront.cart")}
              >
                <ShoppingCart size={24} className="text-gray-700" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 ${
                      isRTL ? "-left-1" : "-right-1"
                    } w-5 h-5 bg-mint-500 text-white text-xs font-bold rounded-full flex items-center justify-center`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © {new Date().getFullYear()} {storeInfo?.name}.{" "}
              {t("storefront.rights")}
            </p>
            <p className="text-sm">
              {t("storefront.poweredBy")}{" "}
              <Link
                to="/"
                className="text-mint-600 hover:underline font-medium"
              >
                StorePro
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
