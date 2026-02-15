const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div
            className={`animate-spin rounded-full ${sizes[size]} border-primary-600 border-t-transparent mx-auto mb-4`}
          ></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`animate-spin rounded-full ${sizes[size]} border-primary-600 border-t-transparent`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
