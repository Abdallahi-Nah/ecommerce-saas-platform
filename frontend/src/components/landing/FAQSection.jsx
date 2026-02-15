import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: t("landing.faq.q1.question"),
      answer: t("landing.faq.q1.answer"),
    },
    {
      question: t("landing.faq.q2.question"),
      answer: t("landing.faq.q2.answer"),
    },
    {
      question: t("landing.faq.q3.question"),
      answer: t("landing.faq.q3.answer"),
    },
    {
      question: t("landing.faq.q4.question"),
      answer: t("landing.faq.q4.answer"),
    },
    {
      question: t("landing.faq.q5.question"),
      answer: t("landing.faq.q5.answer"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.faq.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("landing.faq.subtitle")}</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-mint-300 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-right"
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-mint-600 transition-transform flex-shrink-0 mr-4 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
