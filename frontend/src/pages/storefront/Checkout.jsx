import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  MapPin,
  CreditCard,
  Package,
  CheckCircle,
  Shield,
} from "lucide-react";
import StorefrontLayout from "../../components/storefront/StorefrontLayout";
import { getPublicStore } from "../../services/publicService";
import API from "../../services/api";
import toast from "react-hot-toast";
import { createOrderCheckout } from "../../services/paymentService";

const Checkout = () => {
  const { storeId } = useParams();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [processingCard, setProcessingCard] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    country:
      i18n.language === "ar"
        ? "السعودية"
        : i18n.language === "fr"
        ? "France"
        : "USA",
    zipCode: "",
    paymentMethod: "cash",
    customerNotes: "",
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate(`/store/${storeId}/cart`);
      return;
    }
    fetchStore();
  }, [storeId]);

  const fetchStore = async () => {
    const result = await getPublicStore(storeId);
    if (result.success) {
      setStoreInfo(result.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      navigate("/login");
      return;
    }

    if (paymentMethod === "card") {
      // الدفع بالبطاقة
      setProcessingCard(true);

      const orderData = {
        storeId,
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
        customerNotes: formData.customerNotes,
      };

      try {
        const result = await createOrderCheckout(orderData);

        if (result.success) {
          // إفراغ السلة قبل التحويل
          clearCart();
          // إعادة التوجيه لصفحة Stripe
          window.location.href = result.data.url;
        } else {
          toast.error(result.error);
          setProcessingCard(false);
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("فشل في إنشاء جلسة الدفع");
        setProcessingCard(false);
      }
    } else {
      // الدفع عند الاستلام
      setLoading(true);

      try {
        const orderData = {
          storeId,
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
          paymentMethod: "cash",
          customerNotes: formData.customerNotes,
        };

        console.log("📦 Sending order:", orderData);

        const response = await API.post("/orders", orderData);

        console.log("✅ Order response:", response.data);

        if (response.data.success) {
          toast.success("تم إنشاء الطلب بنجاح! 🎉");

          // إفراغ السلة
          clearCart();

          // التوجيه لصفحة التتبع
          navigate(`/store/${storeId}/orders/${response.data.data._id}`);
        } else {
          toast.error(response.data.message || "فشل في إنشاء الطلب");
        }
      } catch (error) {
        console.error("❌ Order creation error:", error);

        // التحقق من نوع الخطأ
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.response?.status === 500) {
          toast.error("خطأ في الخادم. يرجى المحاولة مرة أخرى.");
        } else {
          toast.error("فشل في إنشاء الطلب");
        }
      } finally {
        setLoading(false);
      }
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

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <StorefrontLayout storeInfo={storeInfo}>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/store/${storeId}/cart`)}
        className={`flex items-center gap-2 text-gray-600 hover:text-mint-600 mb-6 transition ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
        <span>{t("storefront.backToCart")}</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("storefront.checkoutTitle")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin size={24} className="text-mint-600" />
                  {t("storefront.shippingAddress")}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("storefront.fullName")} {t("storefront.required")}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("storefront.phone")} {t("storefront.required")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("storefront.address")} {t("storefront.required")}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t("storefront.addressPlaceholder")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("storefront.city")} {t("storefront.required")}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("storefront.state")}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("storefront.zipCode")}
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={24} className="text-mint-600" />
                  طريقة الدفع
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-mint-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-mint-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        الدفع عند الاستلام
                      </p>
                      <p className="text-sm text-gray-600">
                        ادفع نقداً عند استلام الطلب
                      </p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  {/* Card Payment */}
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-mint-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-mint-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">بطاقة ائتمان</p>
                      <p className="text-sm text-gray-600">
                        الدفع الآمن عبر Stripe (Visa, Mastercard)
                      </p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <Shield size={16} />
                      <span>سيتم تحويلك لصفحة الدفع الآمنة من Stripe</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("storefront.notesOptional")}
                </label>
                <textarea
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t("storefront.notesPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package size={24} className="text-mint-600" />
                  {t("storefront.orderSummary")}
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.images?.[0]?.url ? (
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.price} {getCurrencySymbol()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>{t("storefront.subtotal")}</span>
                    <span className="font-medium">
                      {subtotal} {getCurrencySymbol()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>{t("storefront.shipping")}</span>
                    <span className="font-medium">
                      {shipping === 0
                        ? t("storefront.freeShipping")
                        : `${shipping} ${getCurrencySymbol()}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>{t("storefront.total")}</span>
                  <span className="text-mint-600">
                    {total} {getCurrencySymbol()}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || processingCard}
                  className="w-full bg-mint-500 hover:bg-mint-600 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading || processingCard ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      <span>
                        {processingCard
                          ? "جاري التحويل للدفع..."
                          : "جاري إتمام الطلب..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      <span>
                        {paymentMethod === "card"
                          ? "الدفع بالبطاقة"
                          : "تأكيد الطلب"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StorefrontLayout>
  );
};

export default Checkout;
