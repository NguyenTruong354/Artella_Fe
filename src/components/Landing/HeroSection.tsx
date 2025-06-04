import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation, useMotionValue, AnimatePresence } from "framer-motion";
import ArtCard from "./ArtCard";

// Mảng dữ liệu nghệ thuật
const artworks = [
  {
    id: 1,
    title: "Abstract Emotions",
    quote: '"Art is not what you see, but what you make others see."',
    imageUrl: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
  },
  {
    id: 2,
    title: "Autumn Landscape",
    quote: '"Nature always wears the colors of the spirit."',
    imageUrl: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
  },
  {
    id: 3,
    title: "The Starry Night",
    quote:
      '"I look at the stars and with all my being feel that I am part of one of these stars."',
    imageUrl: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
  },
  {
    id: 4,
    title: "Peaceful Mountains",
    quote: '"The mountains are calling and I must go."',
    imageUrl: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
  },
  {
    id: 5,
    title: "Museum Masterpiece",
    quote: '"Every artist was first an amateur."',
    imageUrl: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
  },
];

// Variants cho animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function EnhancedHeroSection() {
  // State để theo dõi index của card hiện tại (trung tâm)
  const [activeIndex, setActiveIndex] = useState<number>(2);
  // State để lưu trữ hướng chuyển động (trái hoặc phải)
  const [direction, setDirection] = useState<number>(0);
  // State để theo dõi kích thước màn hình cho responsive
  const [isMobile, setIsMobile] = useState<boolean>(false);  // State để lưu trữ kích thước màn hình
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // State để theo dõi khi người dùng tương tác với slide
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  // Animation controls
  const controls = useAnimation();
  // Ref cho parallax effect
  const parallaxRef = useRef<HTMLDivElement>(null);
  // Motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Effect để preload tất cả hình ảnh
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = artworks.map((artwork) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.src = artwork.imageUrl;
          img.onload = () => resolve(artwork.imageUrl);
          img.onerror = () => reject();
        });
      });

      Promise.all(imagePromises)
        .then(() => {
          console.log("All images preloaded successfully");
        })
        .catch((err: Error) => {
          console.error("Error preloading images", err);
        });
    };

    preloadImages();
  }, []);

  // Effect để xử lý chuyển động parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Cập nhật giá trị motion values theo vị trí chuột
      mouseX.set(clientX / windowSize.width - 0.5);
      mouseY.set(clientY / windowSize.height - 0.5);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, windowSize]);  // Effect để xử lý auto-sliding
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    // Auto-slide khi người dùng không tương tác với slider
    if (!userInteracted) {
      intervalId = setInterval(() => {
        setDirection(1);
        setActiveIndex((prevIndex) => {
          if (prevIndex >= artworks.length - 1) {
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
        controls.start("visible");
      }, 5000); // Chuyển slide sau mỗi 5 giây
    }
    
    return () => {
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, userInteracted]);

  // Effect tạm dừng auto-slide nếu người dùng tương tác, và khôi phục sau 10 giây
  useEffect(() => {
    let pauseTimeout: NodeJS.Timeout;
    
    if (userInteracted) {
      pauseTimeout = setTimeout(() => {
        setUserInteracted(false);
      }, 10000);
    }
    
    return () => {
      clearTimeout(pauseTimeout);
    };
  }, [userInteracted]);

  // Effect để kiểm tra kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Kiểm tra khi component mount
    handleResize();

    // Thêm event listener để kiểm tra khi resize màn hình
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sử dụng background image dựa trên card hiện tại với hiệu ứng parallax
  const backgroundStyle = {
    backgroundImage: `url(${artworks[activeIndex].imageUrl})`,
    backgroundSize: "cover", 
    backgroundPosition: `calc(50% + ${mouseX.get() * 20}px) calc(50% + ${mouseY.get() * 20}px)`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    transition: "background-image 0.8s ease-in-out",
  };

  // Xử lý khi nhấn nút điều hướng trước đó
  const handlePrevClick = (userInitiated: boolean = true) => {
    if(userInitiated) {
      setUserInteracted(true);
    }
    setDirection(-1);
    setActiveIndex((prevIndex) => {
      // Tạo hiệu ứng vòng tròn khi quay lại
      if (prevIndex <= 0) {
        return artworks.length - 1; // Quay lại card cuối cùng
      } else {
        return prevIndex - 1;
      }
    });
    
    // Animate elements
    controls.start("visible");
  };
  // Xử lý khi nhấn nút điều hướng tiếp theo
  const handleNextClick = useCallback((userInitiated: boolean = true) => {
    if(userInitiated) {
      setUserInteracted(true);
    }
    setDirection(1);
    setActiveIndex((prevIndex) => {
      // Tạo hiệu ứng vòng tròn khi đi tiếp
      if (prevIndex >= artworks.length - 1) {
        return 0; // Quay lại card đầu tiên
      } else {
        return prevIndex + 1;
      }
    });
    
    // Animate elements
    controls.start("visible");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUserInteracted, setDirection, setActiveIndex, controls, artworks.length]);

  // Tính toán vị trí và z-index cho mỗi card
  const getCardStyles = (index: number) => {
    // Tính toán khoảng cách từ card hiện tại
    const distance = Math.abs(index - activeIndex);

    // Đặt các thuộc tính dựa trên khoảng cách
    const translateY = 30; // Dịch xuống 30px so với ban đầu
    let scale = 1;
    let opacity = 1;
    // Card ở giữa luôn có z-index cao nhất
    // Cards khác giảm dần theo khoảng cách
    const zIndex = 100 - Math.abs(index - activeIndex) * 10;

    // Điều chỉnh biến dựa trên kích thước màn hình
    const screenWidth = windowSize.width; // Sử dụng kích thước màn hình thực tế

    // Tính toán offset tối ưu cho từng loại màn hình
    const maxOffset = isMobile ? screenWidth * 0.35 : screenWidth * 0.25;
    const cardOffset = Math.min(maxOffset, isMobile ? 120 : 220);

    // Tính toán vị trí X dựa trên index và kích thước màn hình
    let translateX = 0;
    if (index === activeIndex) {
      // Card hiện tại ở giữa
      translateX = 0;
      scale = 1;
    } else if (index < activeIndex) {
      // Card ở bên trái
      const positionFromLeft = index - activeIndex;
      translateX = positionFromLeft * cardOffset;
      scale = 0.9 - 0.1 * distance;
    } else {
      // Card ở bên phải
      const positionFromRight = index - activeIndex;
      translateX = positionFromRight * cardOffset;
      scale = 0.9 - 0.1 * distance;
    }

    // Xác định độ mờ dựa trên khoảng cách
    opacity = 1 - distance * 0.2;
    opacity = Math.max(opacity, 0.5); // Đảm bảo độ mờ tối thiểu là 0.5

    // Xác định góc quay cho hiệu ứng chuyển động vòng tròn
    let rotate = 0;
    if (index < activeIndex) {
      rotate = -5 * distance; // Góc nghiêng nhẹ cho card bên trái
    } else if (index > activeIndex) {
      rotate = 5 * distance; // Góc nghiêng nhẹ cho card bên phải
    }

    return {
      zIndex,
      x: translateX,
      y: translateY,
      scale,
      opacity,
      rotate,
      // Luôn hiển thị tất cả các card
      display: "block",
    };
  };
  return (
    <div
      ref={parallaxRef}
      style={backgroundStyle}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-blue-900"
    >
      {/* Overlay gradient với hiệu ứng nhẹ */}      
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ backgroundPosition: `calc(50% + ${mouseX.get() * 10}px) calc(50% + ${mouseY.get() * 10}px)` }}
      />

      {/* Container cho toàn bộ nội dung với hiệu ứng stagger */}
      <motion.div 
        className="w-full h-full flex flex-col items-center justify-center px-4 pt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center space-y-4 mt-16"
          variants={itemVariants}
        >
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white relative z-40 drop-shadow-lg"
            style={{
              fontFamily: "'Segoe Print', cursive",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              letterSpacing: "1px",
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <motion.span 
              className="inline-block" 
              animate={{ 
                y: [0, -5, 0],
                rotateZ: [0, 2, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              Touch the art.
            </motion.span>
            <br />
            <motion.span 
              className="inline-block" 
              animate={{ 
                y: [0, -3, 0],
                rotateZ: [0, -1, 0]
              }}
              transition={{ 
                duration: 4, 
                delay: 0.5,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              Own the emotion
            </motion.span>
          </motion.h1>
          <motion.button
            className="px-6 py-2 bg-yellow-500 text-white rounded-md text-lg font-semibold shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none z-40"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 15px rgba(255,200,0,0.5)",
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore More
          </motion.button>
        </motion.div>
        
        {/* Indicator cho navigation */}
        <motion.div 
          className="absolute bottom-8 flex space-x-2 z-50"
          variants={itemVariants}
        >
          {artworks.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full cursor-pointer ${index === activeIndex ? 'w-6 bg-yellow-500' : 'w-2 bg-white/50'}`}
              onClick={() => {
                setUserInteracted(true);
                setActiveIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={index === activeIndex ? { 
                width: 24,
                backgroundColor: "rgb(234 179 8)" 
              } : { 
                width: 8,
                backgroundColor: "rgba(255, 255, 255, 0.5)" 
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
            />
          ))}
        </motion.div>
        
        {/* Container for art cards */}
        <div className="relative w-full h-[200px] sm:h-[220px] md:h-[250px] lg:h-[300px] flex items-center justify-center mt-8">
          <AnimatePresence mode="wait">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="absolute pointer-events-auto"
                custom={direction}
                initial={false}
                animate={getCardStyles(index)}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                whileHover={{ 
                  y: index === activeIndex ? [0, -10, 0] : 30,
                  transition: {
                    y: {
                      repeat: index === activeIndex ? Infinity : 0,
                      duration: index === activeIndex ? 2 : 0.3,
                      repeatType: "reverse"
                    }
                  }
                }}
              >
                <ArtCard
                  title={artwork.title}
                  quote={artwork.quote}
                  imageUrl={artwork.imageUrl}
                  onPrev={() => handlePrevClick()}
                  onNext={() => handleNextClick()}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
