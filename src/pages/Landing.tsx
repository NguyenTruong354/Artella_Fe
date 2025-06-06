import React from 'react';
import HeroSection from '../components/Landing/HeroSection';
import AboutSection from '../components/Landing/AboutSection';
import ServiceSection from '../components/Landing/ServiceSection';
import ExploreSection from '../components/Landing/ExploreSection';
import PricingSection from '../components/Landing/PricingSection';
import FAQSection from '../components/Landing/FAQSection';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

const Landing: React.FC = () => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="relative">
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="services">
          <ServiceSection />
        </section>
        <section id="explore">
          <ExploreSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
