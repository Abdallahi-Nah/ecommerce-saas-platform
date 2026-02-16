import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getStoreStats, getProducts } from "../../services/productService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // جلب الإحصائيات
      const statsResult = await getStoreStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // جلب آخر المنتجات
      const productsResult = await getProducts({ limit: 5 });
      if (productsResult.success) {
        setRecentProducts(productsResult.data.data);
      }
    } catch (error) {
      toast.error("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        {t("dashboard.welcome")}, {user?.name}! 👋
      </h1>
      <p className="text-gray-600">{t("dashboard.overview")}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t("dashboard.stats.totalProducts")}
          value={stats.totalProducts}
          icon={Package}
          color="mint"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title={t("dashboard.stats.orders")}
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="blue"
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title={t("dashboard.stats.revenue")}
          value={`${stats.totalRevenue.toFixed(2)} ${t("dashboard.currency")}`}
          icon={DollarSign}
          color="purple"
          trend={stats.totalRevenue > 0 ? "up" : undefined}
          trendValue={stats.totalRevenue > 0 ? "+23%" : undefined}
        />
        <StatsCard
          title={t("dashboard.stats.customers")}
          value={stats.totalCustomers}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Quick Actions + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/products/new")}
              className="flex items-center justify-center gap-2 bg-mint-500 hover:bg-mint-600 text-white py-3 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              <span>{t("products.addProduct")}</span>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              <ShoppingCart size={20} />
              <span>{t("dashboard.viewOrders")}</span>
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.lowStockProducts > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-orange-600 flex-shrink-0"
                size={24}
              />
              <div>
                <h3 className="font-bold text-orange-800 mb-1">
                  {t("dashboard.lowStockAlert")}
                </h3>
                <p className="text-sm text-orange-700">
                  {stats.lowStockProducts} {t("dashboard.stock")}
                </p>
                <button
                  onClick={() => navigate("/products?lowStock=true")}
                  className="text-sm text-orange-600 hover:underline font-medium mt-2"
                >
                  {t("dashboard.viewProducts")} →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {t("dashboard.recentProducts")}
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="text-mint-600 hover:underline text-sm font-medium"
          >
            {t("products.viewAll")} →
          </button>
        </div>

        {recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.product")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.price")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.stock")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t("dashboard.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-gray-500" />
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
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {product.price} ريال
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          product.stock < 10 ? "text-red-600" : "text-gray-800"
                        } font-medium`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status === "active"
                          ? t("dashboard.active")
                          : t("dashboard.inactive")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("dashboard.noProducts")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("dashboard.addFirstProduct")}
            </p>
            <button
              onClick={() => navigate("/products/new")}
              className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              {t("dashboard.addProduct")}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
