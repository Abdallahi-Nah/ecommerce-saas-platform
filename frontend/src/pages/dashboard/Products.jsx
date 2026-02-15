import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../services/productService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Products = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

  const fetchProducts = async () => {
    setLoading(true);

    const params = {};
    if (filterStatus !== "all") {
      params.status = filterStatus;
    }

    const result = await getProducts(params);

    if (result.success) {
      setProducts(result.data.data);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filterStatus]);

  const handleDelete = async (productId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      return;
    }

    const result = await deleteProduct(productId);

    if (result.success) {
      toast.success("تم حذف المنتج بنجاح");
      fetchProducts();
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "draft" : "active";

    const result = await updateProduct(product._id, { status: newStatus });

    if (result.success) {
      toast.success(`تم ${newStatus === "active" ? "تفعيل" : "إيقاف"} المنتج`);
      fetchProducts();
    } else {
      toast.error(result.error);
    }
  };

  const handleMenuToggle = (productId) => {
    if (openMenuId === productId) {
      setOpenMenuId(null);
    } else {
      const button = buttonRefs.current[productId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX - 192 + 40,
        });
      }
      setOpenMenuId(productId);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t("products.title")}
          </h1>
          <p className="text-gray-600">
            {t("products.manage")} ({filteredProducts.length})
          </p>
        </div>

        <button
          onClick={() => navigate("/products/new")}
          className="flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
        >
          <Plus size={20} />
          {t("products.addProduct")}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("products.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white cursor-pointer"
            >
              <option value="all">{t("products.allProducts")}</option>
              <option value="active">{t("products.active")}</option>
              <option value="draft">{t("products.draft")}</option>
              <option value="archived">{t("products.archived")}</option>
            </select>

            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredProducts.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.product")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.price")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.stock")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.status")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("products.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={24} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category || "غير مصنف"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.price} ريال
                        </p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            {product.compareAtPrice} ريال
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.stock < 10 ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : product.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status === "active"
                          ? t("products.active")
                          : product.status === "draft"
                          ? t("products.draft")
                          : t("products.archived")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          ref={(el) => (buttonRefs.current[product._id] = el)}
                          onClick={() => handleMenuToggle(product._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dropdown Menu */}
          {openMenuId && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenMenuId(null)}
              ></div>
              <div
                className="fixed z-20 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                <button
                  onClick={() => {
                    const product = filteredProducts.find(
                      (p) => p._id === openMenuId
                    );
                    if (product) handleToggleStatus(product);
                    setOpenMenuId(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg"
                >
                  {filteredProducts.find((p) => p._id === openMenuId)
                    ?.status === "active" ? (
                    <>
                      <EyeOff size={18} />
                      <span>{t("products.deactivate")}</span>
                    </>
                  ) : (
                    <>
                      <Eye size={18} />
                      <span>{t("products.activate")}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setOpenMenuId(null);
                    navigate(`/products/edit/${openMenuId}`);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  <Edit2 size={18} />
                  <span>{t("products.edit")}</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete(openMenuId);
                    setOpenMenuId(null);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                >
                  <Trash2 size={18} />
                  <span>{t("products.delete")}</span>
                </button>
              </div>
            </>
          )}

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product._id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={24} className="text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.price} ريال
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status === "active"
                          ? t("dashboard.active")
                          : t("products.draft")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t("dashboard.stock")}: {product.stock}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === product._id ? null : product._id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Package className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t("products.noProducts")}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? t("products.noResults") : ""}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/products/new")}
              className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              {t("products.addProduct")}
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Products;
