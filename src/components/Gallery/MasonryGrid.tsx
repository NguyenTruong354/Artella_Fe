import React, { memo } from "react";

// Pinterest-style Masonry Grid Component
export const MasonryGrid = memo(
  ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div
        className={`masonry-grid ${className}`}
        style={{
          columnCount: "auto",
          columnWidth: "320px",
          columnGap: "1.5rem",
          columnFill: "balance",
        }}
      >
        {children}
      </div>
    );
  }
);
