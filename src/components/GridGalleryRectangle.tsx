// filepath: d:\Project_Nodejs\Smart_Market\src\components\GridGalleryRectangle.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GridItem } from './types';

interface GridGalleryRectangleProps {
  items: GridItem[];
  backgroundColor?: string;
}

const GridGalleryRectangle: React.FC<GridGalleryRectangleProps> = ({
  items,
  backgroundColor = "#f9f1ed"
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  // Animation variants for the container and shapes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        ease: "easeOut",
      },
    },
  };
  const shapeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  
  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full max-w-[1000px] mx-auto h-[400px] md:h-[500px] relative"
      style={{ backgroundColor }}
    >
      {/* Container responsive với hai layout khác nhau cho mobile và desktop */}
      <div className="absolute inset-0">
        {/* Mobile layout - hiển thị dạng grid */}
        <div className="block lg:hidden w-full h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 gap-2 h-full p-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                variants={shapeVariants}
                className={`w-full h-full flex items-center justify-center ${
                  index % 2 === 0 ? 'bg-[#FADADD]' : 'bg-[#ffd1d1]'
                }`}
                style={{
                  clipPath: index === 0 
                    ? "polygon(0 0, 100% 0, 30% 100%, 0 100%)"
                    : index === 3
                    ? "polygon(60% 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%)"
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <span className="text-base sm:text-lg font-medium text-gray-700">{item.id}</span>
              </motion.div>
            ))}
          </div>
        </div>        {/* Desktop layout - sử dụng absolute positioning */}
        <div className="hidden lg:block w-full h-full">
          {/* Hình tứ giác không đều bên trái */}
          <motion.div
            variants={shapeVariants}
            className="absolute top-0 left-0 w-[27%] h-full bg-[#FADADD] z-[2]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 30% 100%, 0 100%)"
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            {items[0] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base xl:text-xl font-medium text-gray-700">{items[0].id}</span>
              </div>
            )}
          </motion.div>
          
          {/* Hình bình hành 1 - sử dụng clip-path thay vì skew */}
          <motion.div
            variants={shapeVariants}
            className="absolute top-0 left-[120px] w-[384px] h-full bg-[#ffd1d1] z-[10]"
            style={{
              clipPath: "polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%)"
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            {items[1] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-700">
                  {items[1].id}
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Hình bình hành 2 - sử dụng clip-path thay vì skew */}
          <motion.div
            variants={shapeVariants}
            className="absolute top-0 left-[520px] w-[384px] h-full bg-[#ffd1d1] z-[10]"
            style={{
              clipPath: "polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%)"
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            {items[2] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-700">
                  {items[2].id}
                </span>
              </div>
            )}
          </motion.div>

          {/* Hình tứ giác không đều bên phải */}
          <motion.div
            variants={shapeVariants}
            className="absolute top-0 right-0 w-[270px] h-full bg-[#FADADD] z-[2]"
            style={{
              clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0 100%)"
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            {items[3] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-700">{items[3].id}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GridGalleryRectangle;