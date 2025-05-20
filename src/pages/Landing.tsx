import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServiceSection from '../components/ServiceSection';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServiceSection />
    </div>
  );
};

export default Home;
