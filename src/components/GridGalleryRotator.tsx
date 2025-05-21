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
  // Thêm template 5: Dạng bảng cờ
  `
    "area-c1 area-c2 area-c3 area-c4 area-c5 area-c6"
    "area-c7 area-c8 area-c9 area-c10 area-c11 area-c12"
    "area-c13 area-c14 area-c15 area-c16 area-c17 area-c18"
    "area-c19 area-c20 area-c21 area-c22 area-c23 area-c24"
    "area-c25 area-c26 area-c27 area-c28 area-c29 area-c30"
    "area-c31 area-c32 area-c33 area-c34 area-c35 area-c36"
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
  // Items cho template 2 (xoáy trôn ốc)
  [
    { id: "spiral-1", area: "area-1-1", animationDelay: 0, animationType: "fade" },
    { id: "spiral-2", area: "area-1-2", animationDelay: 0.1, animationType: "fade" },
    { id: "spiral-3", area: "area-1-3", animationDelay: 0.2, animationType: "fade" },
    { id: "spiral-4", area: "area-1-4", animationDelay: 0.3, animationType: "fade" },
    { id: "spiral-5", area: "area-1-5", animationDelay: 0.4, animationType: "fade" },
    { id: "spiral-6", area: "area-1-6", animationDelay: 0.5, animationType: "fade" },
    { id: "spiral-7", area: "area-2-6", animationDelay: 0.6, animationType: "fade" },
    { id: "spiral-8", area: "area-2-5", animationDelay: 0.7, animationType: "fade" },
    // Thêm các item theo xoáy trôn ốc
    { id: "spiral-9", area: "area-2-4", animationDelay: 0.8, animationType: "fade" },
    { id: "spiral-10", area: "area-2-3", animationDelay: 0.9, animationType: "fade" },
    { id: "spiral-11", area: "area-2-2", animationDelay: 1.0, animationType: "fade" },
    { id: "spiral-12", area: "area-2-1", animationDelay: 1.1, animationType: "fade" },
    { id: "spiral-13", area: "area-3-1", animationDelay: 1.2, animationType: "fade" },
    { id: "spiral-14", area: "area-3-2", animationDelay: 1.3, animationType: "fade" }
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
    // Thêm các item cho các area còn lại
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
  // Items cho template 5 (dạng bảng cờ)
  [
    { id: "c-1", area: "area-c1", animationDelay: 0, animationType: "fade" },
    { id: "c-2", area: "area-c2", animationDelay: 0.1, animationType: "zoom" },
    { id: "c-3", area: "area-c3", animationDelay: 0.2, animationType: "fade" },
    { id: "c-4", area: "area-c4", animationDelay: 0.3, animationType: "zoom" },
    { id: "c-5", area: "area-c5", animationDelay: 0.4, animationType: "fade" },
    { id: "c-6", area: "area-c6", animationDelay: 0.5, animationType: "zoom" },
    { id: "c-7", area: "area-c7", animationDelay: 0.6, animationType: "fade" },
    { id: "c-8", area: "area-c8", animationDelay: 0.7, animationType: "zoom" },
    { id: "c-9", area: "area-c9", animationDelay: 0.8, animationType: "fade" },
    { id: "c-10", area: "area-c10", animationDelay: 0.9, animationType: "zoom" },
    // Thêm các item cho các ô còn lại
    { id: "c-11", area: "area-c11", animationDelay: 1.0, animationType: "fade" },
    { id: "c-12", area: "area-c12", animationDelay: 1.1, animationType: "zoom" },
    { id: "c-13", area: "area-c13", animationDelay: 1.2, animationType: "fade" },
    { id: "c-14", area: "area-c14", animationDelay: 1.3, animationType: "zoom" },
    { id: "c-15", area: "area-c15", animationDelay: 1.4, animationType: "fade" },
    { id: "c-16", area: "area-c16", animationDelay: 1.5, animationType: "zoom" }
  ]
];

interface GridGalleryRotatorProps {
  imageUrl: string;
  rotationInterval?: number; // Thời gian giữa các lần thay đổi template (tính bằng ms)
  autoRotate?: boolean; // Tự động xoay vòng template
  initialTemplate?: number; // Template ban đầu
  transitionEffect?: TransitionEffectType; // Hiệu ứng chuyển đổi
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
  const [direction] = useState<AnimationDirection>(1); // 1 for forward, -1 for backward
  
  // Xoay vòng template theo thời gian nếu autoRotate = true
  useEffect(() => {
    if (!autoRotate) return;
    
    const rotateTemplates = () => {
      // 1. Đầu tiên, hiển thị template tĩnh (không animation)
      setIsTransitioning(false);
      
      // 2. Giữ nguyên template trong 5 giây
      const animationTimer = setTimeout(() => {
        // 3. Kích hoạt animation trong 3 giây
        setIsTransitioning(true);
        
        // 4. Sau 3 giây tắt animation và chuyển template
        setTimeout(() => {
          setIsTransitioning(false);
          // 5. Chuyển đến template tiếp theo
          setCurrentTemplateIndex(prev => (prev + 1) % gridTemplates.length);
        }, 3000);
      }, 5000);
      
      return animationTimer;
    };
    
    // Kích hoạt lần đầu 
    let animationTimer = rotateTemplates();
    
    // Tạo interval để lặp lại quá trình
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
            opacity: transitionEffect === 'fade' ? 0 : 
                    transitionEffect === 'slide' ? 1 : 
                    transitionEffect === 'zoom' ? 0 : 1,
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
            opacity: transitionEffect === 'fade' ? 0 : 
                   transitionEffect === 'slide' ? 0 : 
                   transitionEffect === 'zoom' ? 0 : 0,
            x: transitionEffect === 'slide' ? direction * -300 : 0,
            scale: transitionEffect === 'zoom' ? 1.2 : 1,
            rotateY: transitionEffect === 'flip' ? direction * -90 : 0
          }}          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full"
        >          <GridGallery
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
