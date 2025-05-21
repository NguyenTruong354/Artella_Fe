import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import './GridGallery.css';
import { GridItem } from './types';

interface GridGalleryProps {
  imageUrl: string; // Single background image URL
  items: GridItem[];
  gridTemplate?: string; // Optional grid template for dynamic grid sizes
  isTemplateChanging?: boolean; // Thêm prop mới, để biết khi nào template đang thay đổi
}

const GridGallery: React.FC<GridGalleryProps> = ({ 
  imageUrl, 
  items, 
  gridTemplate,
  isTemplateChanging = false 
}) => {
  // State để theo dõi khi nào kích hoạt animation
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  // Kích hoạt animation khi template thay đổi
  useEffect(() => {
    if (isTemplateChanging) {
      // Kích hoạt animation
      setTriggerAnimation(true);
    } else {
      // Đặt lại trạng thái animation
      setTriggerAnimation(false);
    }
  }, [isTemplateChanging, gridTemplate]);

  // Default grid template for 6x6 grid
  const defaultTemplate = `
    ". . area-1-3 area-1-4-2-5 area-1-4-2-5 ."
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-1-4-2-5 area-1-4-2-5 area-2-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-5-1 area-5-2-6-3 area-5-2-6-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    ". area-5-2-6-3 area-5-2-6-3 . . ."
  `;

  // Use provided gridTemplate or default
  const template = gridTemplate || defaultTemplate;

  // Parse grid template to get grid dimensions and area map
  const { gridCellMap, totalGridWidth, totalGridHeight } = useMemo(() => {
    const grid = template
      .trim()
      .split("\n")
      .map(row => row.trim().replace(/"/g, '').split(/\s+/));

    const totalGridHeight = grid.length;
    const totalGridWidth = grid[0].length;

    const areaMap = new Map<string, Array<{ row: number; col: number }>>();

    grid.forEach((row, rowIndex) => {
      row.forEach((area, colIndex) => {
        if (area !== ".") {
          if (!areaMap.has(area)) {
            areaMap.set(area, []);
          }
          areaMap.get(area)!.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    return { gridCellMap: areaMap, totalGridWidth, totalGridHeight };
  }, [template]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.8,
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
        ease: "easeOut",
      },
    },
  };

  // Lấy class animation dựa trên loại animation
  const getAnimationClass = (type?: string) => {
    switch(type) {
      case 'zoom': return 'pulse';
      case 'slide': return 'float';
      case 'rotate': return 'rotate';
      case 'fade': return 'shimmer';
      default: return '';
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-2xl ml-auto mr-0">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-1 md:gap-2 lg:gap-3 w-full h-full grid-transition"
        style={{
          gridTemplateAreas: template,
          gridTemplateColumns: `repeat(${totalGridWidth}, 1fr)`,
          gridTemplateRows: `repeat(${totalGridHeight}, 1fr)`,
        }}
      >
        {items.map((item) => {
          const gridAreaStyle = {
            gridArea: item.area,
          };

          // Get all cells this area occupies
          const cells = gridCellMap.get(item.area) || [];

          // Calculate the area width and height in terms of grid cells
          const areaCols = new Set(cells.map(cell => cell.col));
          const areaRows = new Set(cells.map(cell => cell.row));
          const areaWidth = areaCols.size;
          const areaHeight = areaRows.size;

          // Calculate background size based on grid dimensions
          const bgSizeX = (totalGridWidth / areaWidth) * 100;
          const bgSizeY = (totalGridHeight / areaHeight) * 100;

          // Find the top-left cell for background position
          const firstCell = cells.reduce(
            (min, cell) =>
              cell.row < min.row || (cell.row === min.row && cell.col < min.col) ? cell : min,
            cells[0]
          );

          // Calculate background position
          const backgroundPosition = firstCell
            ? `${(firstCell.col / (totalGridWidth - 1)) * 100}% ${
                (firstCell.row / (totalGridHeight - 1)) * 100
              }%`
            : "center";
            
          // Xác định lớp filter cho ảnh
          const filterClasses = ['filter-warm', 'filter-cool', 'filter-vintage', 'filter-sharp'];
          const filterIndex = parseInt(item.id.replace(/[^0-9]/g, '')) % filterClasses.length;
          const filterClass = filterClasses[filterIndex];
          
          // Xác định lớp stagger cho animation delay
          const staggerIndex = (parseInt(item.id.replace(/[^0-9]/g, '')) % 5) + 1;
          const staggerClass = `stagger-${staggerIndex}`;
          
          // Lấy class animation
          const animationClass = getAnimationClass(item.animationType);

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              style={gridAreaStyle}
              className={`rounded-2xl overflow-hidden shadow-md will-change-transform gallery-item-animate zoom-hover ${item.className || ""} ${staggerClass} ${animationClass}`}
            >
              <motion.div
                className={`w-full h-full overflow-hidden ${filterClass}`}                initial={{ scale: 1 }}                
                animate={
                  triggerAnimation ? (
                    item.animationType === "zoom" 
                      ? { scale: [1, 1.05, 1] } 
                      : item.animationType === "rotate"
                      ? { rotate: [0, 3, 0, -3, 0] }
                      : item.animationType === "slide"
                      ? { y: [0, -5, 0] }
                      : item.animationType === "fade"
                      ? { opacity: [1, 0.8, 1] }
                      : {}
                  ) : {}
                }
                transition={{
                  repeat: 0, // Không lặp lại animation
                  duration: 3 + (item.animationDelay || 0),
                  delay: item.animationDelay || 0,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
                  backgroundPosition,
                  backgroundOrigin: "border-box",
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default GridGallery;
