import React from 'react';
import HeroSection from '../components/Landing/HeroSection';
import AboutSection from '../components/Landing/AboutSection';
import ServiceSection from '../components/Landing/ServiceSection';
import ExploreSection from '../components/Landing/ExploreSection';
import PricingSection from '../components/Landing/PricingSection';
import FAQSection from '../components/Landing/FAQSection';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <ExploreSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;
