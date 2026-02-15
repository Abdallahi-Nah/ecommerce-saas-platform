import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CustomerLayout from "../../components/layout/CustomerLayout";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const CustomerCart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useCart();

  // تجميع المنتجات حسب المتجر
  const groupedByStore = cart.reduce((acc, item) => {
    const storeId = item.storeId;
    if (!acc[storeId]) {
      acc[storeId] = {
        storeId: storeId,
        storeName: item.storeName || "متجر",
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {});

  const stores = Object.values(groupedByStore);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const product = cart.find((item) => item._id === productId);
    if (product && newQuantity > product.stock) {
      toast.error("الكمية المطلوبة غير متوفرة");
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = (storeId) => {
    navigate(`/store/${storeId}/checkout`);
  };

  const handleClearCart = () => {
    if (window.confirm("هل أنت متأكد من إفراغ السلة؟")) {
      clearCart();
      toast.success("تم إفراغ السلة");
    }
  };

  if (cart.length === 0) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              السلة فارغة
            </h2>
            <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات بعد</p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              <span>تصفح المنتجات</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              سلة التسوق
            </h1>
            <p className="text-gray-600">لديك {cart.length} منتج في السلة</p>
          </div>

          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            <Trash2 size={20} />
            <span>إفراغ السلة</span>
          </button>
        </div>

        {/* Cart Items by Store */}
        <div className="space-y-8">
          {stores.map((store) => {
            const storeTotal = store.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div
                key={store.storeId}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Store Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    {store.storeName}
                  </h2>
                </div>

                {/* Items */}
                <div className="p-6 space-y-4">
                  {store.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-mint-300 transition"
                    >
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
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.category}
                        </p>
                        <p className="text-lg font-bold text-mint-600">
                          {item.price} ريال
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-semibold">
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

                        <div className="text-right">
                          <p className="text-sm text-gray-600">الإجمالي</p>
                          <p className="text-xl font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2)} ريال
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Store Summary */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      إجمالي المتجر:
                    </span>
                    <span className="text-2xl font-bold text-mint-600">
                      {storeTotal.toFixed(2)} ريال
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckout(store.storeId)}
                    className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <span>إتمام الطلب من {store.storeName}</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">الإجمالي الكلي</p>
              <p className="text-3xl font-bold text-gray-900">
                {getCartTotal().toFixed(2)} ريال
              </p>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2 text-mint-600 hover:text-mint-700 font-semibold"
            >
              <span>متابعة التسوق</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerCart;
