import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />      <main>
        {/* Không có padding-top để navbar đè lên nội dung */}
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;