import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServiceSection from '../components/ServiceSection';
import ExploreSection from '../components/ExploreSection';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/Landing/FAQSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
