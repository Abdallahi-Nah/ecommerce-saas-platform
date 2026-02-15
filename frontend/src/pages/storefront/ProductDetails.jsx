import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  Store as StoreIcon,
} from "lucide-react";
import StorefrontLayout from "../../components/storefront/StorefrontLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getPublicProduct, getPublicStore } from "../../services/publicService";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { storeId, productId } = useParams();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    setLoading(true);

    // جلب المنتج
    const productResult = await getPublicProduct(productId);
    if (productResult.success) {
      setProduct(productResult.data);
      setStoreInfo(productResult.data.storeId);
    } else {
      toast.error(t("storefront.messages.productNotFound"));
      navigate(`/store/${storeId}`);
    }

    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error(t("storefront.messages.productUnavailable"));
      return;
    }

    if (quantity > product.stock) {
      toast.error(
        t("storefront.messages.availableStock", { stock: product.stock })
      );
      return;
    }

    addToCart(product, quantity);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
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

  if (loading) {
    return (
      <StorefrontLayout storeInfo={storeInfo}>
        <LoadingSpinner fullScreen />
      </StorefrontLayout>
    );
  }

  if (!product) return null;

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
        <span>{t("storefront.backToProducts")}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images?.[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={96} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-mint-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            {/* Category */}
            {product.category && (
              <span className="inline-block bg-mint-100 text-mint-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-mint-600">
                {product.price} {getCurrencySymbol()}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {product.compareAtPrice} {getCurrencySymbol()}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {t("storefront.discount")}{" "}
                    {Math.round(
                      ((product.compareAtPrice - product.price) /
                        product.compareAtPrice) *
                        100
                    )}
                    %
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t("storefront.description")}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">
                  {t("storefront.status")}:
                </span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    {t("storefront.inStock")} ({product.stock}{" "}
                    {t("storefront.pieces")})
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    {t("storefront.outOfStock")}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">
                  {t("storefront.quantity")}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 hover:bg-gray-100 transition"
                      disabled={quantity <= 1}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="px-6 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="p-3 hover:bg-gray-100 transition"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-mint-500 hover:bg-mint-600 text-white py-4 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart size={24} />
              <span>{t("storefront.addToCart")}</span>
            </button>

            {/* Store Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <StoreIcon size={20} />
                <span>
                  {t("storefront.soldBy")}: {storeInfo?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default ProductDetails;
