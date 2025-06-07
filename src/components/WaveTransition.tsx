import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveTransitionProps {
  isTransitioning: boolean;
  isDark: boolean;
}

// Sử dụng React.memo để tránh render lại không cần thiết
export const WaveTransition: React.FC<WaveTransitionProps> = memo(({ isTransitioning, isDark }) => {
  // Đơn giản hóa state và hiệu ứng để tránh lag
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Quản lý hiệu ứng chuyển tiếp đơn giản hóa
  useEffect(() => {
    if (isTransitioning) {
      // Hiển thị overlay nhẹ khi đang chuyển đổi
      setShowOverlay(true);
      
      // Ẩn overlay sau khi chuyển đổi hoàn tất
      const hideTimer = setTimeout(() => {
        setShowOverlay(false);
      }, 400);
      
      // Cleanup timer
      return () => {
        clearTimeout(hideTimer);
      };
    } else {
      setShowOverlay(false);
    }
  }, [isTransitioning]);
  
  // Không render gì nếu không trong trạng thái chuyển tiếp
  if (!isTransitioning && !showOverlay) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {/* Chỉ sử dụng một overlay đơn giản để tránh gây lag */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className={`absolute inset-0 ${
              isDark 
                ? 'bg-white/5' 
                : 'bg-black/5'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: "linear" // Sử dụng linear để giảm tải tính toán
            }}
            // Các thuộc tính tối ưu hiệu suất
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// Đặt displayName cho memo component để dễ debug
WaveTransition.displayName = 'WaveTransition';
