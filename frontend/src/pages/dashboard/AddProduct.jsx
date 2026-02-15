import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Upload,
  X,
  Package,
  DollarSign,
  Hash,
  FileText,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { createProduct } from "../../services/productService";
import toast from "react-hot-toast";
import ImageUpload from "../../components/dashboard/ImageUpload";

const AddProduct = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    cost: "",
    stock: "",
    category: "",
    tags: "",
    status: "active",
    trackInventory: true,
  });

  const [imageUrls, setImageUrls] = useState([""]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrlField = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error(t("errors.required"));
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error(t("addProduct.priceValidation"));
      return;
    }

    setLoading(true);

    // تحضير بيانات الصور
    const validImageUrls = imageUrls.filter((url) => url.trim() !== "");
    const imageObjects = validImageUrls.map((url, index) => ({
      url,
      alt: formData.name,
      isPrimary: index === 0,
    }));

    // تحضير البيانات
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : null,
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      stock: parseInt(formData.stock),
      category: formData.category,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
      images: images, // ← استبدل هذا
      status: formData.status,
      trackInventory: formData.trackInventory,
    };

    const result = await createProduct(productData);

    if (result.success) {
      toast.success(t("addProduct.successMessage"));
      navigate("/products");
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/products")}
          className={`flex items-center gap-2 text-gray-600 hover:text-mint-600 mb-4 transition ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowRight size={20} className={isRTL ? "rotate-180" : ""} />
          <span>{t("addProduct.backToProducts")}</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {t("addProduct.title")}
        </h1>
        <p className="text-gray-600">{t("addProduct.subtitle")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-mint-600" />
                {t("addProduct.basicInfo")}
              </h2>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.productName")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("addProduct.productNamePlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline ml-1" />
                    {t("addProduct.description")}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder={t("addProduct.descriptionPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline ml-1" />
                    {t("addProduct.category")}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder={t("addProduct.categoryPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.tags")}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder={t("addProduct.tagsPlaceholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("addProduct.tagsHint")}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-mint-600" />
                {t("addProduct.pricing")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.price")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                      required
                    />
                  </div>
                </div>

                {/* Compare at Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.compareAtPrice")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="compareAtPrice"
                      value={formData.compareAtPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.cost")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("addProduct.internalOnly")}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-mint-600" />
                {t("imageUpload.title")}
              </h2>

              <ImageUpload
                images={images}
                setImages={setImages}
                maxImages={5}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {t("addProduct.status")}
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                    className="w-4 h-4 text-mint-600 focus:ring-mint-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {t("addProduct.active")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("addProduct.activeDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={handleChange}
                    className="w-4 h-4 text-mint-600 focus:ring-mint-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {t("addProduct.draft")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("addProduct.draftDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Hash size={20} className="text-mint-600" />
                {t("addProduct.inventory")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("addProduct.availableQuantity")}
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="trackInventory"
                    checked={formData.trackInventory}
                    onChange={handleChange}
                    className="w-4 h-4 text-mint-600 rounded focus:ring-mint-500"
                  />
                  <span className="text-sm text-gray-700">
                    {t("addProduct.trackInventory")}
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-mint-500 hover:bg-mint-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading
                    ? t("addProduct.saving")
                    : t("addProduct.saveProduct")}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  {t("addProduct.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddProduct;
