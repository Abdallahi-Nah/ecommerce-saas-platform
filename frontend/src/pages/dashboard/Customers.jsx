import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingCart,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getStoreCustomers } from "../../services/orderService";
import { format } from "date-fns";
import { ar, fr, enUS } from "date-fns/locale";
import toast from "react-hot-toast";

const Customers = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent"); // totalSpent, totalOrders, recent

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await getStoreCustomers();

    if (result.success) {
      setCustomers(result.data);
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const locale =
      i18n.language === "ar" ? ar : i18n.language === "fr" ? fr : enUS;
    return format(date, "dd MMM yyyy", { locale });
  };

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "totalSpent") return b.totalSpent - a.totalSpent;
      if (sortBy === "totalOrders") return b.totalOrders - a.totalOrders;
      if (sortBy === "recent")
        return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
      return 0;
    });

  const stats = {
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
        : 0,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("customers.title")}
        </h1>
        <p className="text-gray-600">{t("customers.subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            {t("customers.stats.totalCustomers")}
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalCustomers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            {t("customers.stats.totalRevenue")}
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalRevenue.toLocaleString()}{" "}
            {t("customers.stats.currency")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            {t("customers.stats.avgCustomerValue")}
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.avgOrderValue.toFixed(0)} {t("customers.stats.currency")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            {t("customers.stats.totalOrders")}
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalOrders}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
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
              placeholder={t("customers.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${
                isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
              } py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500`}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 bg-white"
          >
            <option value="totalSpent">{t("customers.sort.totalSpent")}</option>
            <option value="totalOrders">
              {t("customers.sort.totalOrders")}
            </option>
            <option value="recent">{t("customers.sort.recent")}</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredCustomers.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className={`px-6 py-4 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs font-medium text-gray-500 uppercase`}
                  >
                    {t("customers.table.customer")}
                  </th>
                  <th
                    className={`px-6 py-4 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs font-medium text-gray-500 uppercase`}
                  >
                    {t("customers.table.contactInfo")}
                  </th>
                  <th
                    className={`px-6 py-4 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs font-medium text-gray-500 uppercase`}
                  >
                    {t("customers.table.orders")}
                  </th>
                  <th
                    className={`px-6 py-4 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs font-medium text-gray-500 uppercase`}
                  >
                    {t("customers.table.totalSpent")}
                  </th>
                  <th
                    className={`px-6 py-4 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs font-medium text-gray-500 uppercase`}
                  >
                    {t("customers.table.lastOrder")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint-100 rounded-full flex items-center justify-center">
                          <span className="text-mint-600 font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("customers.table.joined")}{" "}
                            {formatDate(customer.joinedAt)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart size={18} className="text-gray-400" />
                        <span className="font-medium text-gray-800">
                          {customer.totalOrders}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">
                        {customer.totalSpent.toLocaleString()}{" "}
                        {t("customers.stats.currency")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(customer.lastOrderDate)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <div key={customer._id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-mint-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-mint-600 font-bold text-lg">
                      {customer.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {customer.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail size={14} />
                        <span className="truncate">{customer.email}</span>
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={14} />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("customers.mobile.orders")}
                    </p>
                    <p className="font-bold text-gray-800">
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("customers.mobile.spent")}
                    </p>
                    <p className="font-bold text-green-600">
                      {customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("customers.mobile.lastOrder")}
                    </p>
                    <p className="font-bold text-gray-800 text-xs">
                      {formatDate(customer.lastOrderDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t("customers.empty.title")}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? t("customers.empty.noResults")
              : t("customers.empty.noCustomers")}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Customers;
