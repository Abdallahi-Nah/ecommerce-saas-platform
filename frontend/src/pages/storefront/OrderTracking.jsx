import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  CreditCard,
} from "lucide-react";
import StorefrontLayout from "../../components/storefront/StorefrontLayout";
import CustomerLayout from "../../components/layout/CustomerLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getPublicStore } from "../../services/publicService";
import { getOrderById } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import toast from "react-hot-toast";

const OrderTracking = () => {
  const { storeId, orderId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const { user } = useAuth();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    // جلب المتجر
    const storeResult = await getPublicStore(storeId);
    if (storeResult.success) {
      setStoreInfo(storeResult.data);
    }

    // جلب الطلب
    const orderResult = await getOrderById(orderId);
    if (orderResult.success) {
      setOrder(orderResult.data);
    } else {
      toast.error(t("storefront.messages.orderNotFound"));
      navigate(`/store/${storeId}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // التحقق من نجاح الدفع
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      toast.success("تم الدفع بنجاح! 💳✅");

      // إفراغ السلة بعد الدفع الناجح
      clearCart();

      // إزالة query param
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [orderId, clearCart]);

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

  const getStatusText = (status) => {
    return t(`storefront.orderStatus.${status}`);
  };

  const getStatusSteps = () => {
    const allSteps = [
      {
        status: "pending",
        label: t("storefront.trackingSteps.received"),
        icon: Clock,
      },
      {
        status: "confirmed",
        label: t("storefront.trackingSteps.confirmed"),
        icon: CheckCircle,
      },
      {
        status: "processing",
        label: t("storefront.trackingSteps.processing"),
        icon: Package,
      },
      {
        status: "shipped",
        label: t("storefront.trackingSteps.shipped"),
        icon: Truck,
      },
      {
        status: "delivered",
        label: t("storefront.trackingSteps.delivered"),
        icon: CheckCircle,
      },
    ];

    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(order?.status);

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const getDateLocale = () => {
    switch (i18n.language) {
      case "ar":
        return ar;
      case "fr":
        return fr;
      case "en":
        return enUS;
      default:
        return ar;
    }
  };

  const getCurrencySymbol = () => {
    switch (i18n.language) {
      case "ar":
        return "ريال";
      case "fr":
        return "€";
      case "en":
        return "$";
      default:
        return "ريال";
    }
  };

  const getPaymentMethodText = (method) => {
    if (method === "cash") return t("storefront.cashOnDelivery");
    if (method === "card") return "💳 " + t("storefront.creditCard");
    if (method === "bank_transfer") return t("storefront.bankTransfer");
    return method;
  };

  // المحتوى المشترك
  const orderContent = order && (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-white" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("storefront.thankYouTitle")} 🎉
        </h1>
        <p className="text-gray-600 text-lg">
          {t("storefront.thankYouMessage")}
        </p>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {t("storefront.orderNumber")} {order.orderNumber}
            </h2>
            <p className="text-gray-600">
              {t("storefront.orderedOn")}{" "}
              {format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm", {
                locale: getDateLocale(),
              })}
            </p>
          </div>

          <div
            className={`px-6 py-3 rounded-lg border-2 font-bold ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusText(order.status)}
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== "cancelled" && (
          <div className="mt-8">
            <div className="flex justify-between items-start">
              {getStatusSteps().map((step, index) => {
                const Icon = step.icon;
                const steps = getStatusSteps();

                return (
                  <div key={step.status} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${
                          step.completed
                            ? "bg-mint-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        } ${step.current ? "ring-4 ring-mint-200" : ""}`}
                      >
                        <Icon size={24} />
                      </div>
                      <p
                        className={`text-xs md:text-sm text-center font-medium ${
                          step.completed ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>

                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-6 ${
                          isRTL ? "left-1/2" : "right-1/2"
                        } w-full h-1 -z-10 transition ${
                          step.completed ? "bg-mint-500" : "bg-gray-200"
                        }`}
                        style={{
                          transform: isRTL
                            ? "translateX(-50%)"
                            : "translateX(50%)",
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} className="text-mint-600" />
            {t("storefront.products")}
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price} {getCurrencySymbol()}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)}{" "}
                    {getCurrencySymbol()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>{t("storefront.subtotal")}</span>
              <span>
                {order.subtotal} {getCurrencySymbol()}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>{t("storefront.shipping")}</span>
              <span>
                {order.shippingCost === 0
                  ? t("storefront.freeShipping")
                  : `${order.shippingCost} ${getCurrencySymbol()}`}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>{t("storefront.total")}</span>
              <span className="text-mint-600">
                {order.total} {getCurrencySymbol()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-mint-600" />
              {t("storefront.shippingAddress")}
            </h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                {order.shippingAddress.phone}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.zipCode && (
                <p>الرمز البريدي: {order.shippingAddress.zipCode}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-mint-600" />
              {t("storefront.paymentMethod")}
            </h2>
            <p className="text-gray-700 font-medium">
              {getPaymentMethodText(order.paymentMethod)}
            </p>
            {order.paymentStatus && (
              <p className="text-sm text-gray-600 mt-2">
                الحالة:{" "}
                {order.paymentStatus === "paid" ? (
                  <span className="text-green-600 font-semibold">مدفوع ✅</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">
                    قيد الانتظار ⏳
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Store Info */}
          {storeInfo && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-600 text-center">
                تم الطلب من متجر{" "}
                <span className="font-bold text-gray-900">
                  {storeInfo.name}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Back Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        {user?.role === "customer" && (
          <button
            onClick={() => navigate("/my-orders")}
            className="inline-flex items-center justify-center gap-2 text-mint-600 hover:text-mint-700 font-semibold px-6 py-3 border-2 border-mint-600 hover:bg-mint-50 rounded-lg transition"
          >
            <Package size={20} />
            <span>طلباتي</span>
          </button>
        )}

        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          <span>متابعة التسوق</span>
          <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return user?.role === "customer" ? (
      <CustomerLayout>
        <LoadingSpinner fullScreen />
      </CustomerLayout>
    ) : (
      <StorefrontLayout storeInfo={storeInfo}>
        <LoadingSpinner fullScreen />
      </StorefrontLayout>
    );
  }

  if (!order) return null;

  // استخدام Layout المناسب
  if (user?.role === "customer") {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">{orderContent}</div>
      </CustomerLayout>
    );
  }

  // للزوار غير المسجلين
  return (
    <StorefrontLayout storeInfo={storeInfo}>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button للزوار */}
        <button
          onClick={() => navigate(`/store/${storeId}`)}
          className={`flex items-center gap-2 text-gray-600 hover:text-mint-600 mb-6 transition ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
          <span>{t("storefront.backToStore")}</span>
        </button>

        {orderContent}
      </div>
    </StorefrontLayout>
  );
};

export default OrderTracking;
