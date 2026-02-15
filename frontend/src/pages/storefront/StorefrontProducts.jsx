import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import { Search, Filter, ShoppingCart, Package, X } from "lucide-react";
import StorefrontLayout from "../../components/storefront/StorefrontLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getPublicStore, getStoreProducts } from "../../services/publicService";
import toast from "react-hot-toast";

const StorefrontProducts = () => {
  const { storeId } = useParams();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [storeId, selectedCategory, minPrice, maxPrice]);

  const fetchData = async () => {
    setLoading(true);

    // جلب معلومات المتجر
    const storeResult = await getPublicStore(storeId);
    if (storeResult.success) {
      setStoreInfo(storeResult.data);
    } else {
      toast.error(t("storefront.messages.storeNotFound"));
      navigate("/");
      return;
    }

    // جلب المنتجات
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (searchTerm) params.search = searchTerm;

    const productsResult = await getStoreProducts(storeId, params);
    if (productsResult.success) {
      setProducts(productsResult.data.data);
      setCategories(productsResult.data.categories || []);
    }

    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error(t("storefront.messages.productUnavailable"));
      return;
    }
    addToCart(product, 1);
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

  return (
    <StorefrontLayout storeInfo={storeInfo}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Search & Filters Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } top-1/2 transform -translate-y-1/2 text-gray-400`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder={t("storefront.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full ${
                    isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                  } py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500`}
                />
              </form>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter size={20} />
                <span>{t("storefront.filter")}</span>
              </button>
            </div>

            {/* Filters (Desktop + Mobile when opened) */}
            <div
              className={`mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${
                showFilters ? "block" : "hidden md:grid"
              }`}
            >
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white"
              >
                <option value="">{t("storefront.allProducts")}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Min Price */}
              <input
                type="number"
                placeholder={t("storefront.min")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder={t("storefront.max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
              />
            </div>

            {/* Clear Filters */}
            {(selectedCategory || minPrice || maxPrice || searchTerm) && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-mint-600 hover:text-mint-700 font-medium"
              >
                <X size={18} />
                <span>{t("storefront.clearFilters")}</span>
              </button>
            )}
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group"
                >
                  {/* Image */}
                  <div
                    onClick={() =>
                      navigate(`/store/${storeId}/product/${product._id}`)
                    }
                    className="relative h-64 bg-gray-200 overflow-hidden cursor-pointer"
                  >
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={64} className="text-gray-400" />
                      </div>
                    )}

                    {/* Badge */}
                    {product.compareAtPrice && (
                      <div
                        className={`absolute top-3 ${
                          isRTL ? "right-3" : "left-3"
                        } bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold`}
                      >
                        {t("storefront.discount")}{" "}
                        {Math.round(
                          ((product.compareAtPrice - product.price) /
                            product.compareAtPrice) *
                            100
                        )}
                        %
                      </div>
                    )}

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
                          {t("storefront.outOfStock")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3
                      onClick={() =>
                        navigate(`/store/${storeId}/product/${product._id}`)
                      }
                      className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-mint-600 transition"
                    >
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-bold text-mint-600">
                        {product.price} {getCurrencySymbol()}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.compareAtPrice} {getCurrencySymbol()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      <span>{t("storefront.addToCart")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <Package className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("storefront.noProducts")}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory || minPrice || maxPrice
                  ? t("storefront.noProductsWithFilters")
                  : t("storefront.noProductsYet")}
              </p>
            </div>
          )}
        </>
      )}
    </StorefrontLayout>
  );
};

export default StorefrontProducts;
