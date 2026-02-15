import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getStoreOrders } from "../../services/orderService";
import { format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import toast from "react-hot-toast";

const Orders = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);

    const params = {};
    if (filterStatus !== "all") {
      params.status = filterStatus;
    }

    const result = await getStoreOrders(params);

    if (result.success) {
      setOrders(result.data.data);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="text-yellow-600" size={20} />,
      confirmed: <CheckCircle className="text-blue-600" size={20} />,
      processing: <Package className="text-purple-600" size={20} />,
      shipped: <Truck className="text-orange-600" size={20} />,
      delivered: <CheckCircle className="text-green-600" size={20} />,
      cancelled: <XCircle className="text-red-600" size={20} />,
    };
    return icons[status] || <Clock size={20} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-orange-100 text-orange-800 border-orange-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    return t(`orders.status.${status}`) || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale =
      i18n.language === "ar" ? ar : i18n.language === "fr" ? fr : enUS;
    return format(date, "dd MMM yyyy, HH:mm", { locale });
  };

  const getProductsText = (count) => {
    if (count === 1) {
      return t("orders.details.products");
    }
    return t("orders.details.products_plural");
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("orders.title")}
        </h1>
        <p className="text-gray-600">
          {t("orders.subtitle")} ({filteredOrders.length})
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
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
              placeholder={t("orders.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500`}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`appearance-none ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white cursor-pointer`}
            >
              <option value="all">{t("orders.filters.all")}</option>
              <option value="pending">{t("orders.filters.pending")}</option>
              <option value="confirmed">{t("orders.filters.confirmed")}</option>
              <option value="processing">
                {t("orders.filters.processing")}
              </option>
              <option value="shipped">{t("orders.filters.shipped")}</option>
              <option value="delivered">{t("orders.filters.delivered")}</option>
              <option value="cancelled">{t("orders.filters.cancelled")}</option>
            </select>
            <Filter
              className={`absolute ${
                isRTL ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-mint-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-mint-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {order.customerId?.name} •{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {order.total} {t("orders.details.currency")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length}{" "}
                          {getProductsText(order.items.length)}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="font-medium">
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="p-3 hover:bg-gray-100 rounded-lg transition"
                        title={t("orders.actions.viewTooltip")}
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={24} className="text-gray-500" />
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mint-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-mint-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {order.orderNumber}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {order.customerId?.name}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={t("orders.actions.viewTooltip")}
                  >
                    <Eye size={18} className="text-gray-600" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="font-medium">
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {order.total} {t("orders.details.currency")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.items.length} {getProductsText(order.items.length)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t("orders.empty.title")}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? t("orders.empty.noResults")
              : t("orders.empty.noOrders")}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Orders;
