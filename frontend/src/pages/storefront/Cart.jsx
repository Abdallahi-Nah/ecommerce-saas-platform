import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Package,
} from "lucide-react";
import StorefrontLayout from "../../components/storefront/StorefrontLayout";
import { getPublicStore } from "../../services/publicService";
import toast from "react-hot-toast";

const Cart = () => {
  const { storeId } = useParams();
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [storeInfo, setStoreInfo] = useState(null);

  const fetchStore = async () => {
    const result = await getPublicStore(storeId);
    if (result.success) {
      setStoreInfo(result.data);
    }
  };

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    if (window.confirm(t("storefront.confirmRemove"))) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm(t("storefront.confirmClearCart"))) {
      clearCart();
      toast.success(t("storefront.cartCleared"));
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
  const shipping = 0; // يمكن حسابه لاحقاً
  const total = subtotal + shipping;

  return (
    <StorefrontLayout storeInfo={storeInfo}>
      {/* Back Button */}
      <button
        onClick={() => navigate(`/store/${storeId}`)}
        className={`flex items-center gap-2 text-gray-600 hover:text-mint-600 mb-6 transition ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
        <span>{t("storefront.continueShopping")}</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("storefront.cart")}
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() =>
                          navigate(`/store/${storeId}/product/${item._id}`)
                        }
                        className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-mint-600 transition line-clamp-2"
                      >
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3">
                        {item.category}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-mint-600">
                            {item.price * item.quantity} {getCurrencySymbol()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.price} {getCurrencySymbol()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2 h-10 hover:bg-red-50 text-red-600 rounded-lg transition"
                      title={t("storefront.remove")}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {t("storefront.orderSummary")}
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
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

                <button
                  onClick={() => navigate(`/store/${storeId}/checkout`)}
                  className="w-full bg-mint-500 hover:bg-mint-600 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={24} />
                  <span>{t("storefront.checkout")}</span>
                </button>

                <button
                  onClick={handleClearCart}
                  className="w-full mt-3 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 py-3 rounded-lg font-medium transition"
                >
                  {t("storefront.clearCart")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("storefront.emptyCart")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("storefront.emptyCartDescription")}
            </p>
            <button
              onClick={() => navigate(`/store/${storeId}`)}
              className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
              <span>{t("storefront.continueShopping")}</span>
            </button>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
};

export default Cart;
