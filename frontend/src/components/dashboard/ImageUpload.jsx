import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import { uploadProductImages, deleteImage } from "../../services/uploadService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // التحقق من العدد الأقصى
    if (images.length + files.length > maxImages) {
      toast.error(t("imageUpload.maxImagesError", { max: maxImages }));
      return;
    }

    // التحقق من الحجم (5MB لكل صورة)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      toast.error(t("imageUpload.fileSizeError"));
      return;
    }

    setUploading(true);

    const result = await uploadProductImages(files);

    if (result.success) {
      const newImages = result.data.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        alt: "",
        isPrimary: images.length === 0 && index === 0,
      }));

      setImages([...images, ...newImages]);
      toast.success(t("imageUpload.uploadSuccess", { count: files.length }));
    } else {
      toast.error(result.error);
    }

    setUploading(false);
    e.target.value = "";
  };

  const handleRemove = async (index) => {
    const image = images[index];

    if (image.publicId) {
      // حذف من Cloudinary
      const result = await deleteImage(image.publicId);
      if (!result.success) {
        toast.error(t("imageUpload.deleteError"));
        return;
      }
    }

    const newImages = images.filter((_, i) => i !== index);

    // إذا تم حذف الصورة الأساسية، اجعل الأولى أساسية
    if (image.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
    toast.success(t("imageUpload.deleteSuccess"));
  };

  const setPrimaryImage = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  return (
    <div>
      {/* Upload Area */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="w-full border-2 border-dashed border-gray-300 hover:border-mint-500 rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader className="animate-spin text-mint-600" size={48} />
              <p className="text-gray-600">{t("imageUpload.uploading")}</p>
            </>
          ) : (
            <>
              <Upload className="text-gray-400" size={48} />
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-1">
                  {t("imageUpload.clickToUpload")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("imageUpload.fileFormats", { max: maxImages })}
                </p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition ${
                image.isPrimary
                  ? "border-mint-500 ring-2 ring-mint-200"
                  : "border-gray-200 hover:border-mint-300"
              }`}
            >
              {/* Image */}
              <img
                src={image.url}
                alt={
                  image.alt || t("imageUpload.imageAlt", { number: index + 1 })
                }
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-mint-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {t("imageUpload.primaryBadge")}
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className="p-2 bg-white hover:bg-mint-500 hover:text-white rounded-lg transition"
                    title={t("imageUpload.setPrimaryTitle")}
                  >
                    <ImageIcon size={20} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-white hover:bg-red-500 hover:text-white rounded-lg transition"
                  title={t("imageUpload.deleteTitle")}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-500 mt-3">{t("imageUpload.infoText")}</p>
    </div>
  );
};

export default ImageUpload;
