import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Store,
  User,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import LanguageSwitcher from "../common/LanguageSwitcher";

const CustomerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("تم تسجيل الخروج بنجاح");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/shop" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-mint-600 rounded-lg flex items-center justify-center">
                <Store className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">StorePro</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

              {/* Orders Icon */}
              <button
                onClick={() => navigate("/my-orders")}
                className={`p-2 hover:bg-gray-100 rounded-lg transition ${
                  isActive("/my-orders") ? "bg-mint-50 text-mint-600" : ""
                }`}
                title="طلباتي"
              >
                <Package size={24} />
              </button>

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                title="السلة"
              >
                <ShoppingCart size={24} className="text-gray-700" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-mint-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={18} />
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/my-orders");
                          setShowUserMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2 ${
                          isActive("/my-orders")
                            ? "text-mint-600 bg-mint-50"
                            : "text-gray-700"
                        }`}
                      >
                        <Package size={16} />
                        <span>طلباتي</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={16} />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default CustomerLayout;
