import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import { format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    const result = await getOrderById(id);

    if (result.success) {
      setOrder(result.data);
    } else {
      toast.error(result.error || t("orderDetails.messages.fetchError"));
      navigate("/orders");
    }

    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (
      !window.confirm(
        `${t("orderDetails.actions.confirmUpdate")} "${getStatusText(
          newStatus
        )}"؟`
      )
    ) {
      return;
    }

    setUpdating(true);
    const result = await updateOrderStatus(id, newStatus);

    if (result.success) {
      toast.success(t("orderDetails.messages.updateSuccess"));
      fetchOrder();
    } else {
      toast.error(result.error || t("orderDetails.messages.updateError"));
    }

    setUpdating(false);
  };

  const getStatusText = (status) => {
    return t(`orderDetails.status.${status}`) || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale =
      i18n.language === "ar" ? ar : i18n.language === "fr" ? fr : enUS;
    return format(date, "dd MMMM yyyy, HH:mm", { locale });
  };

  const getPaymentMethodText = (method) => {
    return t(`orderDetails.paymentMethods.${method}`) || method;
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  if (!order) return null;

  const nextStatuses = getNextStatuses(order.status);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/orders")}
          className={`flex items-center gap-2 text-gray-600 hover:text-mint-600 mb-4 transition ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
          <span>{t("orderDetails.backToOrders")}</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {t("orderDetails.title")} {order.orderNumber}
            </h1>
            <p className="text-gray-600">{formatDate(order.createdAt)}</p>
          </div>

          <div
            className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusText(order.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-mint-600" />
              {t("orderDetails.sections.products")}{" "}
              {t("orderDetails.products.count", { count: order.items.length })}
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
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

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {t("orderDetails.products.quantity")}: {item.quantity} ×{" "}
                      {item.price} {t("orderDetails.summary.currency")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {item.price * item.quantity}{" "}
                      {t("orderDetails.summary.currency")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{t("orderDetails.summary.subtotal")}</span>
                <span>
                  {order.subtotal} {t("orderDetails.summary.currency")}
                </span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{t("orderDetails.summary.shipping")}</span>
                  <span>
                    {order.shippingCost} {t("orderDetails.summary.currency")}
                  </span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>{t("orderDetails.summary.tax")}</span>
                  <span>
                    {order.tax} {t("orderDetails.summary.currency")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>{t("orderDetails.summary.total")}</span>
                <span>
                  {order.total} {t("orderDetails.summary.currency")}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-mint-600" />
              {t("orderDetails.sections.customerInfo")}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={18} className="text-gray-500" />
                <span>{order.customerId?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} className="text-gray-500" />
                <span>{order.customerId?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={18} className="text-gray-500" />
                <span>{order.customerId?.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-mint-600" />
                {t("orderDetails.sections.shippingAddress")}
              </h2>

              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          {nextStatuses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {t("orderDetails.sections.updateStatus")}
              </h2>

              <div className="space-y-3">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {status === "confirmed" && <CheckCircle size={20} />}
                    {status === "processing" && <Package size={20} />}
                    {status === "shipped" && <Truck size={20} />}
                    {status === "delivered" && <CheckCircle size={20} />}
                    <span>
                      {t("orderDetails.actions.updateTo")}:{" "}
                      {getStatusText(status)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {t("orderDetails.sections.orderInfo")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} className="text-gray-500" />
                <span className="font-medium">
                  {t("orderDetails.info.orderDate")}:
                </span>
                <span>{formatDate(order.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign size={16} className="text-gray-500" />
                <span className="font-medium">
                  {t("orderDetails.info.paymentMethod")}:
                </span>
                <span>{getPaymentMethodText(order.paymentMethod)}</span>
              </div>

              {order.customerNotes && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="font-medium text-gray-700 mb-1">
                    {t("orderDetails.info.customerNotes")}:
                  </p>
                  <p className="text-gray-600 text-sm">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;
