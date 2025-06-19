import React, { ReactNode } from "react";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="theme-transition">
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
