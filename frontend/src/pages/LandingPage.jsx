import { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <HeroSection />

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="pricing">
          <PricingSection />
        </div>

        <TestimonialsSection />

        <div id="faq">
          <FAQSection />
        </div>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
