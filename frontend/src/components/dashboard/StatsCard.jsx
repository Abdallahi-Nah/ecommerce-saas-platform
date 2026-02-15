const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const colorClasses = {
    mint: "bg-mint-50 text-mint-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon size={24} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{trend === "up" ? "↑" : "↓"}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatsCard;
