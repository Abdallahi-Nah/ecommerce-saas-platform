import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Crown, AlertCircle, Loader } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  createCheckoutSession,
  getCurrentSubscription,
  cancelSubscription,
  resumeSubscription,
} from "../../services/subscriptionService";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const plans = [
    {
      id: "free",
      name: t("subscriptionPlans.plans.free.name"),
      price: 0,
      icon: Zap,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      features: [
        t("subscriptionPlans.plans.free.features.products"),
        t("subscriptionPlans.plans.free.features.orders"),
        t("subscriptionPlans.plans.free.features.support"),
        t("subscriptionPlans.plans.free.features.dashboard"),
        t("subscriptionPlans.plans.free.features.reports"),
      ],
    },
    {
      id: "basic",
      name: t("subscriptionPlans.plans.basic.name"),
      price: 99,
      icon: Check,
      color: "text-mint-600",
      bgColor: "bg-mint-100",
      popular: true,
      features: [
        t("subscriptionPlans.plans.basic.features.products"),
        t("subscriptionPlans.plans.basic.features.orders"),
        t("subscriptionPlans.plans.basic.features.support"),
        t("subscriptionPlans.plans.basic.features.dashboard"),
        t("subscriptionPlans.plans.basic.features.reports"),
        t("subscriptionPlans.plans.basic.features.domain"),
        t("subscriptionPlans.plans.basic.features.shipping"),
      ],
    },
    {
      id: "pro",
      name: t("subscriptionPlans.plans.pro.name"),
      price: 299,
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      features: [
        t("subscriptionPlans.plans.pro.features.products"),
        t("subscriptionPlans.plans.pro.features.orders"),
        t("subscriptionPlans.plans.pro.features.support"),
        t("subscriptionPlans.plans.pro.features.analytics"),
        t("subscriptionPlans.plans.pro.features.api"),
        t("subscriptionPlans.plans.pro.features.integration"),
        t("subscriptionPlans.plans.pro.features.team"),
        t("subscriptionPlans.plans.pro.features.training"),
      ],
    },
  ];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setLoading(true);
    const result = await getCurrentSubscription();

    if (result.success) {
      setCurrentSubscription(result.data);
    }

    setLoading(false);
  };

  const handleUpgrade = async (planId) => {
    if (planId === "free") return;

    setProcessing(true);

    const result = await createCheckoutSession(planId);

    if (result.success) {
      // Open Stripe Checkout in a new window
      const checkoutWindow = window.open(result.data.url, "_blank");

      if (!checkoutWindow) {
        // If popup was blocked
        toast.error(t("subscriptionPlans.messages.popupBlocked"));
        // Or use normal redirect:
        window.location.href = result.data.url;
      } else {
        toast.success(t("subscriptionPlans.messages.checkoutOpened"));

        // Optional: Monitor window closing
        const checkInterval = setInterval(() => {
          if (checkoutWindow.closed) {
            clearInterval(checkInterval);
            // Update subscription data
            fetchSubscription();
            setProcessing(false);
          }
        }, 1000);
      }
    } else {
      toast.error(result.error);
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(t("subscriptionPlans.confirmations.cancelSubscription"))
    )
      return;

    setProcessing(true);
    const result = await cancelSubscription();

    if (result.success) {
      toast.success(result.message);
      fetchSubscription();
    } else {
      toast.error(result.error);
    }

    setProcessing(false);
  };

  const handleResume = async () => {
    setProcessing(true);
    const result = await resumeSubscription();

    if (result.success) {
      toast.success(result.message);
      fetchSubscription();
    } else {
      toast.error(result.error);
    }

    setProcessing(false);
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("subscriptionPlans.title")}
        </h1>
        <p className="text-gray-600">{t("subscriptionPlans.subtitle")}</p>
      </div>

      {/* Current Plan Alert */}
      {currentSubscription && (
        <div className="bg-mint-50 border border-mint-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-mint-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("subscriptionPlans.currentPlan.title")}:{" "}
                {plans.find((p) => p.id === currentSubscription.plan)?.name}
              </h3>
              <p className="text-gray-700 mb-3">
                {currentSubscription.plan !== "free" && (
                  <>
                    {t("subscriptionPlans.currentPlan.expiresOn")}:{" "}
                    {new Date(
                      currentSubscription.currentPeriodEnd
                    ).toLocaleDateString()}
                    {currentSubscription.cancelAtPeriodEnd && (
                      <span className="text-red-600 font-medium mr-2">
                        {t("subscriptionPlans.currentPlan.willBeCancelled")}
                      </span>
                    )}
                  </>
                )}
              </p>

              {currentSubscription.plan !== "free" && (
                <div className="flex gap-3">
                  {currentSubscription.cancelAtPeriodEnd ? (
                    <button
                      onClick={handleResume}
                      disabled={processing}
                      className="px-4 py-2 bg-mint-500 hover:bg-mint-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                      {processing
                        ? t("subscriptionPlans.buttons.processing")
                        : t("subscriptionPlans.buttons.resume")}
                    </button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      disabled={processing}
                      className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition disabled:opacity-50"
                    >
                      {processing
                        ? t("subscriptionPlans.buttons.processing")
                        : t("subscriptionPlans.buttons.cancel")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentSubscription?.plan === plan.id;
          const canUpgrade =
            plan.id !== "free" &&
            (currentSubscription?.plan === "free" ||
              (plan.id === "pro" && currentSubscription?.plan === "basic"));

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-8 transition-all ${
                plan.popular
                  ? "border-mint-500 shadow-xl scale-105"
                  : "border-gray-200 hover:border-mint-300 hover:shadow-lg"
              } ${isCurrentPlan ? "ring-4 ring-mint-100" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-mint-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    {t("subscriptionPlans.plans.basic.popular")}
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-4 left-4">
                  <div className="bg-mint-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {t("subscriptionPlans.currentPlan.badge")}
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mb-6`}
              >
                <Icon className={plan.color} size={32} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 mr-2">
                  {t("subscriptionPlans.pricing.perMonth")}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-mint-500 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={!canUpgrade || processing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                  isCurrentPlan
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : canUpgrade
                    ? "bg-mint-500 hover:bg-mint-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin" size={20} />
                    {t("subscriptionPlans.buttons.processing")}
                  </span>
                ) : isCurrentPlan ? (
                  t("subscriptionPlans.buttons.currentPlan")
                ) : canUpgrade ? (
                  `${t("subscriptionPlans.buttons.upgrade")} ${plan.name}`
                ) : (
                  t("subscriptionPlans.buttons.notAvailable")
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t("subscriptionPlans.faq.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("subscriptionPlans.faq.questions.cancel.question")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("subscriptionPlans.faq.questions.cancel.answer")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("subscriptionPlans.faq.questions.change.question")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("subscriptionPlans.faq.questions.change.answer")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("subscriptionPlans.faq.questions.payment.question")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("subscriptionPlans.faq.questions.payment.answer")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("subscriptionPlans.faq.questions.security.question")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("subscriptionPlans.faq.questions.security.answer")}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPlans;
