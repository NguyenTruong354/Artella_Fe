import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default Home;
