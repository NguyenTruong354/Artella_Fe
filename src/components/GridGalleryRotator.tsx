import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GridGallery from './GridGallery';
import { GridItem, TransitionEffectType, AnimationDirection } from './types';

// Các template grid khác nhau
const gridTemplates = [
  // Template 1: Mẫu ban đầu (6x6)
  `
    ". . area-1-3 area-1-4-2-5 area-1-4-2-5 ."
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-1-4-2-5 area-1-4-2-5 area-2-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-2-4-1-3 area-2-4-1-3 area-2-4-1-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    "area-5-1 area-5-2-6-3 area-5-2-6-3 area-3-4-5-6 area-3-4-5-6 area-3-4-5-6"
    ". area-5-2-6-3 area-5-2-6-3 . . ."
  `,
  // Template 2: Mẫu theo hình xoáy trôn ốc (6x6)
  `
    "area-1-1 area-1-2 area-1-3 area-1-4 area-1-5 area-1-6"
    "area-2-6 area-2-1 area-2-2 area-2-3 area-2-4 area-2-5"
    "area-3-5 area-3-6 area-3-1 area-3-2 area-3-3 area-3-4"
    "area-4-4 area-4-5 area-4-6 area-4-1 area-4-2 area-4-3"
    "area-5-3 area-5-4 area-5-5 area-5-6 area-5-1 area-5-2"
    "area-6-2 area-6-3 area-6-4 area-6-5 area-6-6 area-6-1"
  `,
  // Template 3: Mẫu theo kiểu lưới không đều (6x6)
  `
    "area-big area-big area-big area-1 area-2 area-3"
    "area-big area-big area-big area-4 area-5 area-6"
    "area-big area-big area-big area-7 area-7 area-7"
    "area-8 area-9 area-10 area-11 area-11 area-11"
    "area-12 area-13 area-14 area-11 area-11 area-11"
    "area-15 area-16 area-17 area-18 area-19 area-20"
  `,
  // Template 4: Mẫu lưới đối xứng (6x6)
  `
    "area-v1 area-v1 area-v2 area-v2 area-v3 area-v3"
    "area-v1 area-v1 area-v2 area-v2 area-v3 area-v3"
    "area-v4 area-v4 area-v5 area-v5 area-v6 area-v6"
    "area-v4 area-v4 area-v5 area-v5 area-v6 area-v6"
    "area-v7 area-v7 area-v8 area-v8 area-v9 area-v9"
    "area-v7 area-v7 area-v8 area-v8 area-v9 area-v9"
  `,
  // Template 5: Kiểu lưới chữ nhật xen kẽ lớn nhỏ
  `
    "rect-big rect-big rect-big rect1 rect2 rect3"
    "rect-big rect-big rect-big rect4 rect5 rect6"
    "rect-big rect-big rect-big rect7 rect8 rect9"
    "rect10 rect10 rect10 rect10 rect10 rect10"
    "rect11 rect12 rect13 rect14 rect15 rect16"
    "rect17 rect18 rect19 rect20 rect21 rect22"
  `
];

// Items cho mỗi template
const templateItems: GridItem[][] = [
  // Items cho template 1
  [
    { id: "item-1", area: "area-2-4-1-3", animationDelay: 0, animationType: "fade" },
    { id: "item-2", area: "area-1-4-2-5", animationDelay: 0.2, animationType: "zoom" },
    { id: "item-3", area: "area-3-4-5-6", animationDelay: 0.4, animationType: "slide" },
    { id: "item-4", area: "area-5-2-6-3", animationDelay: 0.6, animationType: "rotate" },
    { id: "item-5", area: "area-1-3", animationDelay: 0.8, animationType: "fade" },
    { id: "item-6", area: "area-2-6", animationDelay: 1, animationType: "zoom" },
    { id: "item-7", area: "area-5-1", animationDelay: 1.2, animationType: "slide" }
  ],
  // Items cho template 2 (xoáy trôn ốc với hiệu ứng đa dạng)
  [
    { id: "spiral-1", area: "area-1-1", animationDelay: 0, animationType: "fade", backgroundColor: "rgba(219, 39, 119, 0.7)" },
    { id: "spiral-2", area: "area-1-2", animationDelay: 0.1, animationType: "fade", backgroundColor: "rgba(236, 72, 153, 0.7)" },
    { id: "spiral-3", area: "area-1-3", animationDelay: 0.2, animationType: "fade", backgroundColor: "rgba(244, 114, 182, 0.7)" },
    { id: "spiral-4", area: "area-1-4", animationDelay: 0.3, animationType: "fade", backgroundColor: "rgba(251, 207, 232, 0.7)" },
    { id: "spiral-5", area: "area-1-5", animationDelay: 0.4, animationType: "fade", backgroundColor: "rgba(249, 168, 212, 0.7)" },
    { id: "spiral-6", area: "area-1-6", animationDelay: 0.5, animationType: "fade", backgroundColor: "rgba(244, 114, 182, 0.7)" },
    { id: "spiral-7", area: "area-2-6", animationDelay: 0.6, animationType: "slide", backgroundColor: "rgba(124, 58, 237, 0.7)", slideDirection: "down" },
    { id: "spiral-8", area: "area-3-6", animationDelay: 0.7, animationType: "slide", backgroundColor: "rgba(139, 92, 246, 0.7)", slideDirection: "down" },
    { id: "spiral-9", area: "area-4-6", animationDelay: 0.8, animationType: "slide", backgroundColor: "rgba(167, 139, 250, 0.7)", slideDirection: "down" },
    { id: "spiral-10", area: "area-5-6", animationDelay: 0.9, animationType: "slide", backgroundColor: "rgba(139, 92, 246, 0.7)", slideDirection: "down" },
    { id: "spiral-11", area: "area-6-6", animationDelay: 1.0, animationType: "slide", backgroundColor: "rgba(124, 58, 237, 0.7)", slideDirection: "down" },
    { id: "spiral-12", area: "area-6-5", animationDelay: 1.1, animationType: "zoom", backgroundColor: "rgba(37, 99, 235, 0.7)" },
    { id: "spiral-13", area: "area-6-4", animationDelay: 1.2, animationType: "zoom", backgroundColor: "rgba(59, 130, 246, 0.7)" },
    { id: "spiral-14", area: "area-6-3", animationDelay: 1.3, animationType: "zoom", backgroundColor: "rgba(96, 165, 250, 0.7)" },
    { id: "spiral-15", area: "area-6-2", animationDelay: 1.4, animationType: "zoom", backgroundColor: "rgba(59, 130, 246, 0.7)" },
    { id: "spiral-16", area: "area-6-1", animationDelay: 1.5, animationType: "zoom", backgroundColor: "rgba(37, 99, 235, 0.7)" },
    { id: "spiral-17", area: "area-5-1", animationDelay: 1.6, animationType: "rotate", backgroundColor: "rgba(5, 150, 105, 0.7)" },
    { id: "spiral-18", area: "area-4-1", animationDelay: 1.7, animationType: "rotate", backgroundColor: "rgba(16, 185, 129, 0.7)" },
    { id: "spiral-19", area: "area-3-1", animationDelay: 1.8, animationType: "rotate", backgroundColor: "rgba(52, 211, 153, 0.7)" },
    { id: "spiral-20", area: "area-2-1", animationDelay: 1.9, animationType: "rotate", backgroundColor: "rgba(16, 185, 129, 0.7)" },
    { id: "spiral-21", area: "area-2-2", animationDelay: 2.0, animationType: "fade", backgroundColor: "rgba(245, 158, 11, 0.7)" },
    { id: "spiral-22", area: "area-2-3", animationDelay: 2.1, animationType: "fade", backgroundColor: "rgba(251, 191, 36, 0.7)" },
    { id: "spiral-23", area: "area-2-4", animationDelay: 2.2, animationType: "fade", backgroundColor: "rgba(245, 158, 11, 0.7)" },
    { id: "spiral-24", area: "area-2-5", animationDelay: 2.3, animationType: "fade", backgroundColor: "rgba(251, 191, 36, 0.7)" },
    { id: "spiral-25", area: "area-3-5", animationDelay: 2.4, animationType: "slide", backgroundColor: "rgba(220, 38, 38, 0.7)", slideDirection: "down" },
    { id: "spiral-26", area: "area-4-5", animationDelay: 2.5, animationType: "slide", backgroundColor: "rgba(239, 68, 68, 0.7)", slideDirection: "down" },
    { id: "spiral-27", area: "area-5-5", animationDelay: 2.6, animationType: "slide", backgroundColor: "rgba(220, 38, 38, 0.7)", slideDirection: "down" },
    { id: "spiral-28", area: "area-5-4", animationDelay: 2.7, animationType: "zoom", backgroundColor: "rgba(8, 145, 178, 0.7)" },
    { id: "spiral-29", area: "area-5-3", animationDelay: 2.8, animationType: "zoom", backgroundColor: "rgba(14, 165, 233, 0.7)" },
    { id: "spiral-30", area: "area-5-2", animationDelay: 2.9, animationType: "zoom", backgroundColor: "rgba(8, 145, 178, 0.7)" },
    { id: "spiral-31", area: "area-4-2", animationDelay: 3.0, animationType: "rotate", backgroundColor: "rgba(217, 119, 6, 0.7)" },
    { id: "spiral-32", area: "area-3-2", animationDelay: 3.1, animationType: "rotate", backgroundColor: "rgba(180, 83, 9, 0.7)" },
    { id: "spiral-33", area: "area-3-3", animationDelay: 3.2, animationType: "fade", backgroundColor: "rgba(79, 70, 229, 0.7)" },
    { id: "spiral-34", area: "area-3-4", animationDelay: 3.3, animationType: "zoom", backgroundColor: "rgba(99, 102, 241, 0.7)" },
    { id: "spiral-35", area: "area-4-4", animationDelay: 3.4, animationType: "rotate", backgroundColor: "rgba(16, 185, 129, 0.7)" },
    { id: "spiral-36", area: "area-4-3", animationDelay: 3.5, animationType: "fade", backgroundColor: "rgba(244, 63, 94, 0.7)" }
  ],
  // Items cho template 3 (lưới không đều)
  [
    { id: "irreg-1", area: "area-big", animationDelay: 0, animationType: "zoom" },
    { id: "irreg-2", area: "area-1", animationDelay: 0.2, animationType: "fade" },
    { id: "irreg-3", area: "area-2", animationDelay: 0.3, animationType: "fade" },
    { id: "irreg-4", area: "area-3", animationDelay: 0.4, animationType: "fade" },
    { id: "irreg-5", area: "area-4", animationDelay: 0.5, animationType: "fade" },
    { id: "irreg-6", area: "area-5", animationDelay: 0.6, animationType: "fade" },
    { id: "irreg-7", area: "area-6", animationDelay: 0.7, animationType: "fade" },
    { id: "irreg-8", area: "area-7", animationDelay: 0.8, animationType: "slide" },
    { id: "irreg-9", area: "area-11", animationDelay: 0.9, animationType: "zoom" },
    { id: "irreg-10", area: "area-8", animationDelay: 1.0, animationType: "fade" },
    { id: "irreg-11", area: "area-9", animationDelay: 1.1, animationType: "fade" },
    { id: "irreg-12", area: "area-10", animationDelay: 1.2, animationType: "fade" }
  ],
  // Items cho template 4 (lưới đối xứng)
  [
    { id: "sym-1", area: "area-v1", animationDelay: 0, animationType: "fade" },
    { id: "sym-2", area: "area-v2", animationDelay: 0.2, animationType: "slide" },
    { id: "sym-3", area: "area-v3", animationDelay: 0.4, animationType: "fade" },
    { id: "sym-4", area: "area-v4", animationDelay: 0.6, animationType: "zoom" },
    { id: "sym-5", area: "area-v5", animationDelay: 0.8, animationType: "rotate" },
    { id: "sym-6", area: "area-v6", animationDelay: 1.0, animationType: "zoom" },
    { id: "sym-7", area: "area-v7", animationDelay: 1.2, animationType: "fade" },
    { id: "sym-8", area: "area-v8", animationDelay: 1.4, animationType: "slide" },
    { id: "sym-9", area: "area-v9", animationDelay: 1.6, animationType: "fade" }
  ],
  // Items cho template 5 (lưới chữ nhật xen kẽ lớn nhỏ)
  [
    { id: "rect-big-1", area: "rect-big", animationDelay: 0, animationType: "zoom", backgroundColor: "rgba(59, 130, 246, 0.7)", className: "min-h-[100px] min-w-[100px]" },
    { id: "rect1-1", area: "rect1", animationDelay: 0.2, animationType: "fade", backgroundColor: "rgba(99, 102, 241, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect2-1", area: "rect2", animationDelay: 0.3, animationType: "fade", backgroundColor: "rgba(79, 70, 229, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect3-1", area: "rect3", animationDelay: 0.4, animationType: "fade", backgroundColor: "rgba(139, 92, 246, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect4-1", area: "rect4", animationDelay: 0.5, animationType: "slide", backgroundColor: "rgba(124, 58, 237, 0.7)", slideDirection: "down", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect5-1", area: "rect5", animationDelay: 0.6, animationType: "slide", backgroundColor: "rgba(167, 139, 250, 0.7)", slideDirection: "down", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect6-1", area: "rect6", animationDelay: 0.7, animationType: "slide", backgroundColor: "rgba(96, 165, 250, 0.7)", slideDirection: "down", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect7-1", area: "rect7", animationDelay: 0.8, animationType: "rotate", backgroundColor: "rgba(37, 99, 235, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect8-1", area: "rect8", animationDelay: 0.9, animationType: "rotate", backgroundColor: "rgba(59, 130, 246, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect9-1", area: "rect9", animationDelay: 1.0, animationType: "rotate", backgroundColor: "rgba(99, 102, 241, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect10-1", area: "rect10", animationDelay: 1.1, animationType: "zoom", backgroundColor: "rgba(220, 38, 38, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect11-1", area: "rect11", animationDelay: 1.2, animationType: "fade", backgroundColor: "rgba(239, 68, 68, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect12-1", area: "rect12", animationDelay: 1.3, animationType: "fade", backgroundColor: "rgba(244, 63, 94, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect13-1", area: "rect13", animationDelay: 1.4, animationType: "fade", backgroundColor: "rgba(251, 191, 36, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect14-1", area: "rect14", animationDelay: 1.5, animationType: "slide", backgroundColor: "rgba(245, 158, 11, 0.7)", slideDirection: "left", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect15-1", area: "rect15", animationDelay: 1.6, animationType: "slide", backgroundColor: "rgba(217, 119, 6, 0.7)", slideDirection: "left", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect16-1", area: "rect16", animationDelay: 1.7, animationType: "slide", backgroundColor: "rgba(180, 83, 9, 0.7)", slideDirection: "left", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect17-1", area: "rect17", animationDelay: 1.8, animationType: "rotate", backgroundColor: "rgba(16, 185, 129, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect18-1", area: "rect18", animationDelay: 1.9, animationType: "rotate", backgroundColor: "rgba(52, 211, 153, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect19-1", area: "rect19", animationDelay: 2.0, animationType: "rotate", backgroundColor: "rgba(5, 150, 105, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect20-1", area: "rect20", animationDelay: 2.1, animationType: "zoom", backgroundColor: "rgba(8, 145, 178, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect21-1", area: "rect21", animationDelay: 2.2, animationType: "zoom", backgroundColor: "rgba(14, 165, 233, 0.7)", className: "min-h-[50px] min-w-[50px]" },
    { id: "rect22-1", area: "rect22", animationDelay: 2.3, animationType: "zoom", backgroundColor: "rgba(96, 165, 250, 0.7)", className: "min-h-[50px] min-w-[50px]" }
  ]
];

interface GridGalleryRotatorProps {
  imageUrl: string;
  rotationInterval?: number;
  autoRotate?: boolean;
  initialTemplate?: number;
  transitionEffect?: TransitionEffectType;
}

const GridGalleryRotator: React.FC<GridGalleryRotatorProps> = ({
  imageUrl,
  rotationInterval = 8000,
  autoRotate = true,
  initialTemplate = 0,
  transitionEffect = 'fade'
}) => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(initialTemplate);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [direction] = useState<AnimationDirection>(1);

  useEffect(() => {
    if (!autoRotate) return;

    const rotateTemplates = () => {
      setIsTransitioning(false);
      const animationTimer = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentTemplateIndex(prev => (prev + 1) % gridTemplates.length);
        }, 3000);
      }, 5000);
      return animationTimer;
    };

    let animationTimer = rotateTemplates();
    const mainTimer = setInterval(() => {
      clearTimeout(animationTimer);
      animationTimer = rotateTemplates();
    }, rotationInterval);

    return () => {
      clearInterval(mainTimer);
      clearTimeout(animationTimer);
    };
  }, [autoRotate, rotationInterval]);

  return (
    <div className="relative w-full h-full overflow-visible">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`template-${currentTemplateIndex}`}
          custom={direction}
          initial={{
            opacity: transitionEffect === 'fade' ? 0 : transitionEffect === 'slide' ? 1 : transitionEffect === 'zoom' ? 0 : 1,
            x: transitionEffect === 'slide' ? direction * 300 : 0,
            scale: transitionEffect === 'zoom' ? 0.8 : 1,
            rotateY: transitionEffect === 'flip' ? direction * 90 : 0
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            rotateY: 0
          }}
          exit={{
            opacity: transitionEffect === 'fade' ? 0 : transitionEffect === 'slide' ? 0 : transitionEffect === 'zoom' ? 0 : 0,
            x: transitionEffect === 'slide' ? direction * -300 : 0,
            scale: transitionEffect === 'zoom' ? 1.2 : 1,
            rotateY: transitionEffect === 'flip' ? direction * -90 : 0
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <GridGallery
            imageUrl={imageUrl}
            items={templateItems[currentTemplateIndex]}
            gridTemplate={gridTemplates[currentTemplateIndex]}
            isTemplateChanging={isTransitioning}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GridGalleryRotator;