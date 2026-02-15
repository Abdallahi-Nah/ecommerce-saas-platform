import { useNavigate } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useTranslation } from "react-i18next";

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="text-red-600" size={64} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("subscriptionCancel.title")}
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          {t("subscriptionCancel.message")}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard/subscription")}
            className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-8 py-4 rounded-lg font-bold transition"
          >
            <span>{t("subscriptionCancel.buttons.retry")}</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-mint-500 text-gray-700 hover:text-mint-600 px-8 py-4 rounded-lg font-bold transition"
          >
            {t("subscriptionCancel.buttons.dashboard")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionCancel;
