import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { GridItem } from './types';

interface GridGalleryRectangleProps {
  items: GridItem[];
  backgroundColor?: string;
  imageUrl?: string;
  gridTemplate?: string;
  isTemplateChanging?: boolean;
}

const GridGalleryRectangle: React.FC<GridGalleryRectangleProps> = ({
  items,
  backgroundColor = "#f9f1ed",
  imageUrl,
  gridTemplate,
  isTemplateChanging = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [rippleCenter, setRippleCenter] = useState<{x: number, y: number} | null>(null);
  const [rippleActive, setRippleActive] = useState(false);
  const [autoRevealedItems, setAutoRevealedItems] = useState<Set<number>>(new Set());
  const [isShowingFullImage, setIsShowingFullImage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setTriggerAnimation(isTemplateChanging);
  }, [isTemplateChanging]);

  // Auto reveal sequence - hiển thị và ẩn tất cả ô cùng lúc
  useEffect(() => {
    const startAutoReveal = () => {
      const revealSequence = async () => {
        // Phase 1: Hiển thị tất cả ô cùng lúc với hiệu ứng stagger nhẹ
        setIsShowingFullImage(true);
        
        // Tạo hiệu ứng cascade nhẹ khi hiển thị (từ trái sang phải, trên xuống dưới)
        for (let i = 0; i < 24; i++) {
          setAutoRevealedItems(prev => new Set([...prev, i]));
          await new Promise(resolve => setTimeout(resolve, 50)); // Rất nhanh để tạo hiệu ứng cascade
        }
        
        // Phase 2: Giữ toàn bộ ảnh hiển thị trong 4 giây để người dùng ngắm nhìn
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Phase 3: Ẩn tất cả ô cùng lúc
        setIsShowingFullImage(false);
        setAutoRevealedItems(new Set());
        
        // Đợi 3s trước khi bắt đầu chu kỳ mới
        await new Promise(resolve => setTimeout(resolve, 3000));
      };
      
      revealSequence();
    };

    // Bắt đầu sequence đầu tiên sau 2s
    const initialTimeout = setTimeout(startAutoReveal, 2000);

    // Lặp lại sequence mỗi 12s (ngắn hơn vì đã đơn giản hóa)
    const interval = setInterval(startAutoReveal, 12000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Auto ripple effect every 5 seconds - starts immediately
  useEffect(() => {
    // First ripple immediately when component mounts
    const startFirstRipple = () => {
      const centerX = Math.random() * 6;
      const centerY = Math.random() * 4;
      
      setRippleCenter({ x: centerX, y: centerY });
      setRippleActive(true);
      
      setTimeout(() => {
        setRippleActive(false);
      }, 3000);
    };

    // Start first ripple after component is visible
    const initialTimeout = setTimeout(startFirstRipple, 1000);

    // Then continue with regular intervals
    const interval = setInterval(() => {
      const centerX = Math.random() * 6;
      const centerY = Math.random() * 4;
      
      setRippleCenter({ x: centerX, y: centerY });
      setRippleActive(true);
      
      setTimeout(() => {
        setRippleActive(false);
      }, 3000);
    }, 5000); // Every 5 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Default 4x6 grid template
  const defaultTemplate = `
    "item-1 item-2 item-3 item-4 item-5 item-6"
    "item-7 item-8 item-9 item-10 item-11 item-12"
    "item-13 item-14 item-15 item-16 item-17 item-18"
    "item-19 item-20 item-21 item-22 item-23 item-24"
  `;

  const template = gridTemplate || defaultTemplate;
  const { totalGridWidth, totalGridHeight } = useMemo(() => {
    const grid = template
      .trim()
      .split("\n")
      .map(row => row.trim().replace(/"/g, '').split(/\s+/));

    const totalGridHeight = grid.length;
    const totalGridWidth = grid[0]?.length || 6;

    return { totalGridWidth, totalGridHeight };
  }, [template]);

  // Calculate grid position for each item (row, col)
  const getGridPosition = (index: number) => {
    return {
      row: Math.floor(index / 6),
      col: index % 6
    };
  };

  // Calculate distance from ripple center
  const getDistanceFromCenter = (index: number, center: {x: number, y: number}) => {
    const pos = getGridPosition(index);
    const dx = pos.col - center.x;
    const dy = pos.row - center.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get ripple animation delay based on distance from center
  const getRippleDelay = (index: number) => {
    if (!rippleCenter || !rippleActive) return 0;
    
    const distance = getDistanceFromCenter(index, rippleCenter);
    // Each "ring" of the ripple has 0.15s delay
    return distance * 0.15;
  };

  // Get ripple animation props
  const getRippleAnimation = (index: number) => {
    if (!rippleActive) return {};

    const delay = getRippleDelay(index);
    
    return {
      animate: {
        scale: [1, 1.1, 1],
        rotateZ: [0, 2, 0],
        boxShadow: [
          "0px 4px 8px rgba(0, 0, 0, 0.1)",
          "0px 8px 25px rgba(194, 167, 146, 0.4)",
          "0px 4px 8px rgba(0, 0, 0, 0.1)"
        ],
      },
      transition: {
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      }
    };
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        duration: 0.8
      },
    },
  };

  // Item animation variants with ripple integration
  const getItemVariants = () => {
    return {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        },
      },
    };
  };

  // Get image filters
  const getImageFilter = (index: number) => {
    const filters = [
      'sepia(20%) brightness(105%) saturate(110%)',
      'brightness(105%) saturate(90%) hue-rotate(5deg)',
      'sepia(30%) brightness(95%) contrast(110%)',
      'contrast(110%) brightness(110%) saturate(110%)',
    ];
    return filters[index % filters.length];
  };

  // Regular animation effects (zoom/fade)
  const getAnimationProps = (type?: string, delay: number = 0) => {
    const baseTransition = {
      duration: 3,
      repeat: triggerAnimation ? Infinity : 0,
      repeatDelay: 1,
      delay: delay,
      ease: "easeInOut"
    };

    switch (type) {
      case 'zoom':
        return {
          initial: { scale: 1 },
          animate: triggerAnimation
            ? { scale: [1, 1.05, 1], transition: baseTransition }
            : { scale: 1 }
        };
      case 'fade':
        return {
          initial: { opacity: 1 },
          animate: triggerAnimation
            ? { opacity: [1, 0.8, 1], transition: baseTransition }
            : { opacity: 1 }
        };
      default:
        return {
          initial: {},
          animate: {}
        };
    }
  };

  // Calculate background style for each grid item
  const getBackgroundStyle = (index: number) => {
    // Kiểm tra xem item này có đang được auto reveal không
    const isAutoRevealed = autoRevealedItems.has(index);
    const isHovered = hoveredIndex === index;
    
    if (imageUrl && (isAutoRevealed || isHovered)) {
      // Hiển thị ảnh thật khi được auto reveal hoặc hover
      const row = Math.floor(index / 6);
      const col = index % 6;
      
      const backgroundSizeX = 6 * 100;
      const backgroundSizeY = 4 * 100;
      
      const backgroundPositionX = (col / (6 - 1)) * 100;
      const backgroundPositionY = (row / (4 - 1)) * 100;

      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${backgroundSizeX}% ${backgroundSizeY}%`,
        backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
        backgroundRepeat: 'no-repeat',
        filter: getImageFilter(index),
        opacity: 1,
        transform: isAutoRevealed ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.3s ease-in-out'
      };
    }
    
    // Mặc định hiển thị màu nền với hiệu ứng mượt mà
    const colors = [
      '#FADADD', '#ffd1d1', '#ffb3ba', '#ff9aa2',
      '#ffcccb', '#ffe4e6', '#f8d7da', '#fce4ec'
    ];
    return {
      backgroundColor: colors[index % colors.length],
      opacity: 1,
      transform: 'scale(1)',
      transition: 'all 0.3s ease-in-out'
    };
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full max-w-[1200px] mx-auto h-[400px] md:h-[600px] relative overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* CSS Grid 4x6 layout */}
      <div className="absolute inset-0 p-2 md:p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-1 md:gap-2 w-full h-full"
          style={{
            gridTemplateAreas: template,
            gridTemplateColumns: `repeat(${totalGridWidth}, 1fr)`,
            gridTemplateRows: `repeat(${totalGridHeight}, 1fr)`
          }}
        >
          {items.slice(0, 24).map((item, index) => {
            const gridArea = `item-${index + 1}`;
            const animationProps = getAnimationProps(item.animationType, (item.animationDelay || 0) + index * 0.1);
            const rippleProps = getRippleAnimation(index);
            const itemVariants = getItemVariants();
            
            // Kiểm tra xem item này có đang được auto reveal không
            const isAutoRevealed = autoRevealedItems.has(index);
            
            return (
              <motion.div
                key={`${item.id}-${index}`}
                variants={itemVariants}
                className="relative w-full h-full cursor-pointer overflow-hidden rounded-md shadow-md will-change-transform"
                style={{ 
                  gridArea: gridArea,
                  ...getBackgroundStyle(index)
                }}
                whileHover={{
                  scale: 1.05,
                  zIndex: 10,
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                {...rippleProps}
              >
                {/* Animation wrapper for regular animations */}
                <motion.div
                  className="w-full h-full overflow-hidden"
                  initial={animationProps.initial}
                  animate={animationProps.animate}
                  style={{
                    // Đảm bảo wrapper không che phủ ảnh nền
                    backgroundColor: 'transparent'
                  }}
                >
                  {/* Content overlay - chỉ hiển thị nếu có item.id */}
                  {item.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
                      <span className="text-sm md:text-lg font-bold text-white drop-shadow-lg">
                        {item.id}
                      </span>
                    </div>
                  )}
                  
                  {/* Auto reveal effect - hiển thị ảnh tự động */}
                  {isAutoRevealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        boxShadow: [
                          "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          "0px 12px 30px rgba(194, 167, 146, 0.6)",
                          "0px 8px 20px rgba(194, 167, 146, 0.4)"
                        ]
                      }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-[#c2a792]/20 via-transparent to-[#d8bca6]/20 border-2 border-[#c2a792] rounded-md"
                    >
                      {/* Hiệu ứng shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                          duration: 0.8,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* Hover effect overlay */}
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/10"
                    />
                  )}

                  {/* Ripple indicator */}
                  {rippleActive && getRippleDelay(index) < 1.5 && (
                    <motion.div
                      className="absolute inset-0 border-2 border-[#c2a792] rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0],
                        scale: [0.8, 1.05, 0.8]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: getRippleDelay(index),
                        ease: "easeOut"
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Tooltip */}
      {hoveredIndex !== null && items[hoveredIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm shadow-lg z-50"
        >
          {items[hoveredIndex].id}
        </motion.div>
      )}

      {/* Auto Reveal Status Indicator */}
      {autoRevealedItems.size > 0 && (
        <motion.div
          className="absolute top-4 left-4 text-xs text-[#c2a792] bg-white/90 px-3 py-2 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-[#c2a792] rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Auto Gallery ({autoRevealedItems.size}/24)
          </div>
        </motion.div>
      )}

      {/* Visual indicator khi đang hiển thị ảnh hoàn chỉnh */}
      {isShowingFullImage && autoRevealedItems.size === 24 && (
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            className="text-white text-sm font-medium"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            🖼️ Đang hiển thị ảnh hoàn chỉnh
          </motion.p>
        </motion.div>
      )}

      {/* Progress indicator chỉ hiển thị khi đang load */}
      {autoRevealedItems.size > 0 && autoRevealedItems.size < 24 && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <p className="text-white text-xs">
            Đang tải... {autoRevealedItems.size}/24
          </p>
        </motion.div>
      )}

      {/* Ripple Status Indicator (optional - for debugging) */}
      {rippleActive && (
        <motion.div
          className="absolute top-4 right-4 text-xs text-[#c2a792] bg-white/80 px-2 py-1 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Ripple Wave Active
        </motion.div>
      )}
    </motion.div>
  );
};

export default GridGalleryRectangle;