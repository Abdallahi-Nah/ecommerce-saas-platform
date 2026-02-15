import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Store,
  User,
  LogOut,
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Search,
} from "lucide-react";
import { getMyOrders } from "../../services/customerOrderService";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import { format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get date-fns locale based on current language
  const getDateLocale = () => {
    switch (i18n.language) {
      case "ar":
        return ar;
      case "fr":
        return fr;
      default:
        return enUS;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter !== "all") params.status = statusFilter;

    const result = await getMyOrders(params);
    if (result.success) {
      setOrders(result.data.data || []);
    } else {
      toast.error(t("myOrders.messages.fetchError"));
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      processing: "bg-purple-100 text-purple-800 border-purple-300",
      shipped: "bg-orange-100 text-orange-800 border-orange-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusText = (status) => {
    return t(`myOrders.status.${status}`);
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    return icons[status] || Clock;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success(t("myOrders.messages.logoutSuccess"));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div
            className={`flex items-center justify-between h-16 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Logo */}
            <Link
              to="/shop"
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-10 h-10 bg-mint-600 rounded-lg flex items-center justify-center">
                <Store className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {t("myOrders.navbar.logo")}
              </span>
            </Link>

            {/* Right Actions */}
            <div
              className={`flex items-center gap-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <LanguageSwitcher />

              {/* Cart */}
              <button
                onClick={() => navigate("/shop")}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
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

                {showUserMenu && (
                  <div
                    className={`absolute ${
                      isRTL ? "right-0" : "left-0"
                    } mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2`}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => navigate("/my-orders")}
                      className={`w-full px-4 py-2 ${
                        isRTL ? "text-right" : "text-left"
                      } hover:bg-gray-50 flex items-center gap-2 text-gray-700`}
                    >
                      <Package size={16} />
                      <span>{t("myOrders.navbar.user.myOrders")}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-2 ${
                        isRTL ? "text-right" : "text-left"
                      } hover:bg-gray-50 flex items-center gap-2 text-red-600`}
                    >
                      <LogOut size={16} />
                      <span>{t("myOrders.navbar.user.logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("myOrders.pageTitle")}
          </h1>
          <p className="text-gray-600">{t("myOrders.pageSubtitle")}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400`}
                size={20}
              />
              <input
                type="text"
                placeholder={t("myOrders.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${
                  isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500`}
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white"
              >
                <option value="all">
                  {t("myOrders.filters.statusFilter.all")}
                </option>
                <option value="pending">
                  {t("myOrders.filters.statusFilter.pending")}
                </option>
                <option value="confirmed">
                  {t("myOrders.filters.statusFilter.confirmed")}
                </option>
                <option value="processing">
                  {t("myOrders.filters.statusFilter.processing")}
                </option>
                <option value="shipped">
                  {t("myOrders.filters.statusFilter.shipped")}
                </option>
                <option value="delivered">
                  {t("myOrders.filters.statusFilter.delivered")}
                </option>
                <option value="cancelled">
                  {t("myOrders.filters.statusFilter.cancelled")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint-600 border-t-transparent"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);

              return (
                <div
                  key={order._id}
                  onClick={() =>
                    navigate(`/store/${order.storeId._id}/orders/${order._id}`)
                  }
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 p-6 cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div
                        className={`flex items-center gap-3 mb-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {order.storeId?.logo ? (
                            <img
                              src={order.storeId.logo}
                              alt={order.storeId.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Store size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-mint-600 transition">
                            {order.storeId?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t("myOrders.orderCard.orderNumber")}:{" "}
                            {order.orderNumber}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex flex-wrap gap-4 text-sm text-gray-600 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span>
                          📦 {order.items?.length}{" "}
                          {t("myOrders.orderCard.items")}
                        </span>
                        <span>
                          💰 {order.total} {t("myOrders.orderCard.price")}
                        </span>
                        <span>
                          📅{" "}
                          {format(new Date(order.createdAt), "dd MMM yyyy", {
                            locale: getDateLocale(),
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-3 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <StatusIcon size={18} />
                        <span className="font-semibold">
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <ArrowRight
                        size={20}
                        className={`text-gray-400 group-hover:text-mint-600 group-hover:translate-x-1 transition ${
                          isRTL ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("myOrders.emptyState.noOrders")}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? t("myOrders.emptyState.noResults")
                : t("myOrders.emptyState.noOrdersYet")}
            </p>
            <button
              onClick={() => navigate("/shop")}
              className={`inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-8 py-3 rounded-lg font-semibold transition ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span>{t("myOrders.emptyState.startShopping")}</span>
              <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
