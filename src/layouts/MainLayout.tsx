import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="theme-transition">
      <main>
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
