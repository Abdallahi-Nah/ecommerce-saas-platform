import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      text: t("landing.testimonials.testimonial1.text"),
      author: t("landing.testimonials.testimonial1.author"),
      role: t("landing.testimonials.testimonial1.role"),
      avatar: "👨‍💼",
      rating: 5,
    },
    {
      text: t("landing.testimonials.testimonial2.text"),
      author: t("landing.testimonials.testimonial2.author"),
      role: t("landing.testimonials.testimonial2.role"),
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      text: t("landing.testimonials.testimonial3.text"),
      author: t("landing.testimonials.testimonial3.author"),
      role: t("landing.testimonials.testimonial3.role"),
      avatar: "👨",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-xl transition-all border border-gray-100 hover:border-mint-200"
              >
                {/* Quote Icon */}
                <Quote
                  className="absolute top-6 right-6 text-mint-200"
                  size={48}
                />

                {/* Rating */}
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-primary-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
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

export default TestimonialsSection;
