import React, { useState } from 'react';
import HomeSection from '../components/Home/HomeSection';
import Sidebar from '../components/Home/Sidebar';

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-700">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
        <HomeSection />
      </div>
    </div>
  );
};

export default Home;
