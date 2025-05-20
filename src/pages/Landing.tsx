// filepath: d:\Project_Nodejs\Smart_Market\src\pages\Home.tsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Home;
