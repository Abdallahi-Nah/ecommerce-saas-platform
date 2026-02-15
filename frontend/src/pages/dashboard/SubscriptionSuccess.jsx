import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Loader } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getCurrentSubscription } from "../../services/subscriptionService";
import { useTranslation } from "react-i18next";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifySubscription();
  }, []);

  const verifySubscription = async () => {
    // Wait a bit to allow the webhook to process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Verify subscription
    const result = await getCurrentSubscription();

    if (result.success && result.data.plan !== "free") {
      setVerified(true);
    }

    setLoading(false);

    // Redirect after 5 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <Loader
            className="animate-spin mx-auto mb-4 text-mint-600"
            size={64}
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("subscriptionSuccess.loading.title")}
          </h2>
          <p className="text-gray-600">
            {t("subscriptionSuccess.loading.subtitle")}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-green-600" size={64} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {verified
            ? t("subscriptionSuccess.success.titleVerified")
            : t("subscriptionSuccess.success.titlePending")}
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          {verified
            ? t("subscriptionSuccess.success.messageVerified")
            : t("subscriptionSuccess.success.messagePending")}
        </p>

        <div className="bg-mint-50 border border-mint-200 rounded-xl p-6 mb-8">
          <p className="text-gray-700">
            {t("subscriptionSuccess.success.redirectMessage")}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 bg-mint-500 hover:bg-mint-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
        >
          <span>{t("subscriptionSuccess.success.dashboardButton")}</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSuccess;
