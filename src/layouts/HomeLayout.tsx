import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Home/Sidebar';

const HomeLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="min-h-screen bg-[#F8F1E9] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-30"></div>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 relative z-10 ${sidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
