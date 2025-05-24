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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setTriggerAnimation(isTemplateChanging);
  }, [isTemplateChanging]);

  // Default 4x6 grid template - tạo layout chữ nhật với 24 ô
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
  // Simplified animation variants dựa trên GridGallery
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
        duration: 0.8
      },
    },
  };

  const itemVariants = {
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

  // Get image filters giống GridGallery
  const getImageFilter = (index: number) => {
    const filters = [
      'sepia(20%) brightness(105%) saturate(110%)', // warm
      'brightness(105%) saturate(90%) hue-rotate(5deg)', // cool
      'sepia(30%) brightness(95%) contrast(110%)', // vintage
      'contrast(110%) brightness(110%) saturate(110%)', // sharp
    ];
    return filters[index % filters.length];
  };

  // Animation effects tương tự GridGallery
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

  // Calculate background style cho từng grid item
  const getBackgroundStyle = (index: number) => {
    if (imageUrl) {
      // Chia ảnh thành 4x6 = 24 parts
      const row = Math.floor(index / 6);
      const col = index % 6;
      
      const backgroundSizeX = 6 * 100; // 6 columns
      const backgroundSizeY = 4 * 100; // 4 rows
      
      const backgroundPositionX = (col / (6 - 1)) * 100;
      const backgroundPositionY = (row / (4 - 1)) * 100;

      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${backgroundSizeX}% ${backgroundSizeY}%`,
        backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
        backgroundRepeat: 'no-repeat',
        filter: getImageFilter(index),
      };
    }
    
    // Fallback colors nếu không có ảnh
    const colors = [
      '#FADADD', '#ffd1d1', '#ffb3ba', '#ff9aa2',
      '#ffcccb', '#ffe4e6', '#f8d7da', '#fce4ec'
    ];
    return {
      backgroundColor: colors[index % colors.length],
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
            // Tạo grid area cho từng item (item-1, item-2, ...)
            const gridArea = `item-${index + 1}`;
            const animationProps = getAnimationProps(item.animationType, (item.animationDelay || 0) + index * 0.1);
            
            return (
              <motion.div
                key={item.id}
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
              >
                {/* Animation wrapper giống GridGallery */}
                <motion.div
                  className="w-full h-full overflow-hidden"
                  initial={animationProps.initial}
                  animate={animationProps.animate}
                >                  {/* Content overlay - chỉ hiển thị khi có text */}
                  {item.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
                      <span className="text-sm md:text-lg font-bold text-white drop-shadow-lg">
                        {item.id}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover effect overlay */}
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/10"
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
    </motion.div>
  );
};

export default GridGalleryRectangle;