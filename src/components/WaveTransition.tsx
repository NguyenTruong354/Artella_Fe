import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveTransitionProps {
  isTransitioning: boolean;
  isDark: boolean;
}

// Sử dụng React.memo để tránh render lại không cần thiết
export const WaveTransition: React.FC<WaveTransitionProps> = memo(({ isTransitioning, isDark }) => {
  // Thêm hiệu ứng hai lớp để tăng tính thị giác
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSecondaryOverlay, setShowSecondaryOverlay] = useState(false);
  
  // Quản lý hiệu ứng chuyển tiếp cải tiến
  useEffect(() => {
    if (isTransitioning) {
      // Hiển thị overlay chính ngay lập tức
      setShowOverlay(true);
      
      // Hiển thị overlay thứ hai sau một khoảng thời gian ngắn
      const secondaryTimer = setTimeout(() => {
        setShowSecondaryOverlay(true);
      }, 50);
      
      // Ẩn overlay thứ hai trước
      const hideSecondaryTimer = setTimeout(() => {
        setShowSecondaryOverlay(false);
      }, 600);
      
      // Ẩn overlay chính sau
      const hideTimer = setTimeout(() => {
        setShowOverlay(false);
      }, 800);
      
      // Cleanup các timer
      return () => {
        clearTimeout(secondaryTimer);
        clearTimeout(hideSecondaryTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowOverlay(false);
      setShowSecondaryOverlay(false);
    }
  }, [isTransitioning]);
  
  // Không render gì nếu không trong trạng thái chuyển tiếp
  if (!isTransitioning && !showOverlay && !showSecondaryOverlay) return null;
  
  return (    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {/* Sử dụng hai lớp overlay để tăng hiệu ứng chuyển tiếp */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className={`absolute inset-0 ${
              isDark 
                ? 'bg-white/15 backdrop-blur-[1.5px]' // Tăng độ opacity và blur
                : 'bg-black/15 backdrop-blur-[1.5px]' // Tăng độ opacity và blur
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }} // Tăng độ opacity từ 0.4 lên 0.5
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.4, // Tăng từ 0.3 lên 0.4
              ease: "easeOut" 
            }}
            // Các thuộc tính tối ưu hiệu suất + thêm hiệu ứng phát sáng
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              boxShadow: isDark ? 'inset 0 0 100px rgba(255,255,255,0.1)' : 'inset 0 0 100px rgba(0,0,0,0.1)'
            }}
          />
        )}
        
        {/* Overlay thứ hai với hiệu ứng gradient phóng đại */}
        {showSecondaryOverlay && (
          <motion.div
            className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-radial from-white/10 to-transparent' 
                : 'bg-gradient-radial from-black/10 to-transparent'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
            style={{
              willChange: 'opacity, transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              transformOrigin: 'center center',
              mixBlendMode: isDark ? 'soft-light' : 'multiply',
              filter: 'brightness(1.05) contrast(1.05)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// Đặt displayName cho memo component để dễ debug
WaveTransition.displayName = 'WaveTransition';
