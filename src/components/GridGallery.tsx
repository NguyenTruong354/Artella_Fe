import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import './GridGallery.css';
import { GridItem } from './types';

interface GridGalleryProps {
  imageUrl: string;
  items: GridItem[];
  gridTemplate?: string;
  isTemplateChanging?: boolean;
}

const GridGallery: React.FC<GridGalleryProps> = ({
  imageUrl,
  items,
  gridTemplate,
  isTemplateChanging = false
}) => {
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  useEffect(() => {
    setTriggerAnimation(isTemplateChanging);
  }, [isTemplateChanging]);

  const defaultTemplate = `
    ". . area-1-3 area-1-4-2-5 area-1-4-2-5 ."
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-1-4-2-5 area-1-4-2-5 area-2-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-5-1 area-5-2-6-3 area-5-2-6-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    ". area-5-2-6-3 area-5-2-6-3 . . ."
  `;

  const template = gridTemplate || defaultTemplate;

  const { gridCellMap, totalGridWidth, totalGridHeight, validAreas } = useMemo(() => {
    const grid = template
      .trim()
      .split("\n")
      .map(row => row.trim().replace(/"/g, '').split(/\s+/));

    const totalGridHeight = grid.length;
    const totalGridWidth = grid[0]?.length || 6;

    const areaMap = new Map<string, Array<{ row: number; col: number }>>();
    const validAreas = new Set<string>();

    grid.forEach((row, rowIndex) => {
      row.forEach((area, colIndex) => {
        if (area !== ".") {
          if (!areaMap.has(area)) {
            areaMap.set(area, []);
          }
          areaMap.get(area)!.push({ row: rowIndex, col: colIndex });
          validAreas.add(area);
        }
      });
    });

    // Kiểm tra trùng lặp khu vực
    const areaCount = new Map<string, number>();
    items.forEach(item => {
      areaCount.set(item.area, (areaCount.get(item.area) || 0) + 1);
    });
    areaCount.forEach((count, area) => {
      if (count > 1) {
        console.warn(`Cảnh báo: Khu vực "${area}" được gán cho ${count} items. Chỉ item cuối cùng sẽ hiển thị.`);
      }
    });

    return { gridCellMap: areaMap, totalGridWidth, totalGridHeight, validAreas };
  }, [template, items]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getAnimationProps = (type?: string, delay: number = 0, slideDirection?: string) => {
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
      case 'slide':
        let xMove = 0;
        let yMove = 0;
        if (slideDirection === 'left') xMove = -5;
        else if (slideDirection === 'right') xMove = 5;
        else if (slideDirection === 'up') yMove = -5;
        else if (slideDirection === 'down') yMove = 5;
        return {
          initial: { x: 0, y: 0 },
          animate: triggerAnimation
            ? { x: [0, xMove, 0], y: [0, yMove, 0], transition: baseTransition }
            : { x: 0, y: 0 }
        };
      case 'rotate':
        return {
          initial: { rotate: 0 },
          animate: triggerAnimation
            ? { rotate: [0, 3, 0, -3, 0], transition: baseTransition }
            : { rotate: 0 }
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

  return (
    <div className="relative w-full h-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-1 md:gap-1.5 w-full h-full grid-transition p-0.5"
        style={{
          gridTemplateAreas: template,
          gridTemplateColumns: `repeat(${totalGridWidth}, 1fr)`,
          gridTemplateRows: `repeat(${totalGridHeight}, 1fr)`
        }}
      >
        {items
          .filter(item => validAreas.has(item.area))
          .map((item, index, filteredItems) => {
            // Chỉ render item cuối cùng nếu có nhiều item cho cùng một khu vực
            const isLastInArea = filteredItems
              .filter(i => i.area === item.area)
              .reduce((last, i) => (i.animationDelay || 0) > (last.animationDelay || 0) ? i : last, filteredItems[0]).id === item.id;

            if (!isLastInArea) return null;

            const gridAreaStyle = { gridArea: item.area };
            const cells = gridCellMap.get(item.area) || [];
            const areaCols = new Set(cells.map(cell => cell.col));
            const areaRows = new Set(cells.map(cell => cell.row));
            const areaWidth = areaCols.size || 1;
            const areaHeight = areaRows.size || 1;

            const bgSizeX = (totalGridWidth / areaWidth) * 100;
            const bgSizeY = (totalGridHeight / areaHeight) * 100;

            const firstCell = cells.length
              ? cells.reduce(
                  (min, cell) =>
                    cell.row < min.row || (cell.row === min.row && cell.col < min.col) ? cell : min,
                  cells[0]
                )
              : { row: 0, col: 0 };

            const backgroundPosition = cells.length
              ? `${(firstCell.col / (totalGridWidth - 1)) * 100}% ${(firstCell.row / (totalGridHeight - 1)) * 100}%`
              : "center";

            const filterClasses = ['filter-warm', 'filter-cool', 'filter-vintage', 'filter-sharp'];
            const filterIndex = parseInt(item.id.replace(/[^0-9]/g, '')) % filterClasses.length;
            const filterClass = filterClasses[filterIndex] || '';

            const animationProps = getAnimationProps(item.animationType, item.animationDelay || 0, item.slideDirection);

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  zIndex: 10,
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                style={gridAreaStyle}
                className={`rounded-md md:rounded-lg overflow-hidden shadow-sm md:shadow-md will-change-transform zoom-hover ${item.className || ""}`}
              >
                <motion.div
                  className={`w-full h-full overflow-hidden ${filterClass}`}
                  initial={animationProps.initial}
                  animate={animationProps.animate}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
                    backgroundPosition,
                    backgroundOrigin: "border-box",
                    padding: "2px",
                    backgroundColor: item.backgroundColor || 'transparent'
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