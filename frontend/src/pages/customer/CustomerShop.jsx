import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingCart,
  Package,
  Store,
  Filter,
  ChevronDown,
} from "lucide-react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import API from "../../services/api";
import toast from "react-hot-toast";

const CustomerShop = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedStore, searchTerm]);

  const fetchData = async () => {
    setLoading(true);

    try {
      // Fetch all stores
      const storesResponse = await API.get("/public/stores");
      if (storesResponse.data.success) {
        setStores(storesResponse.data.data || []);
      }

      // Fetch products
      let allProducts = [];

      if (selectedStore) {
        const params = searchTerm ? `?search=${searchTerm}` : "";
        const response = await API.get(
          `/public/stores/${selectedStore}/products${params}`
        );
        if (response.data.success) {
          allProducts = response.data.data || [];
        }
      } else {
        const storesData = storesResponse.data.data || [];

        for (const store of storesData.slice(0, 10)) {
          try {
            const params = searchTerm ? `?search=${searchTerm}` : "";
            const response = await API.get(
              `/public/stores/${store._id}/products${params}`
            );
            if (response.data.success) {
              allProducts = [...allProducts, ...(response.data.data || [])];
            }
          } catch (error) {
            console.error(`Error fetching products for store ${store._id}`);
          }
        }
      }

      setProducts(allProducts);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(t("customerShopLayout.messages.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error(t("customerShopLayout.messages.outOfStock"));
      return;
    }
    // ابحث عن اسم المتجر
    const store = stores.find((s) => s._id === product.storeId);

    addToCart(
      {
        ...product,
        storeName: store?.name || "متجر",
      },
      1
    );
    // addToCart(product, 1);
  };

  const handleProductClick = (product) => {
    navigate(`/store/${product.storeId}/product/${product._id}`);
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
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
                placeholder={t("customerShopLayout.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${
                  isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500`}
              />
            </div>

            {/* Store Filter */}
            <div className="md:w-64 relative">
              <Filter
                className={`absolute ${
                  isRTL ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}
                size={20}
              />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className={`w-full ${
                  isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white appearance-none`}
              >
                <option value="">
                  {t("customerShopLayout.search.storeFilter")}
                </option>
                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute ${
                  isRTL ? "left-3" : "right-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint-600 border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <div
                  onClick={() => handleProductClick(product)}
                  className="relative h-64 bg-gray-200 overflow-hidden"
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

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
                        {t("customerShopLayout.product.outOfStock")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    onClick={() => handleProductClick(product)}
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-mint-600 transition"
                  >
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div
                    className={`flex items-end gap-2 mb-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-2xl font-bold text-mint-600">
                      {product.price} {t("customerShopLayout.product.price")}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {product.compareAtPrice}{" "}
                        {t("customerShopLayout.product.price")}
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
                    <span>{t("customerShopLayout.product.addToCart")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("customerShopLayout.emptyState.noProducts")}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedStore
                ? t("customerShopLayout.emptyState.noResults")
                : t("customerShopLayout.emptyState.noAvailable")}
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerShop;
