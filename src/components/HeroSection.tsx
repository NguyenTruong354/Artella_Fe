// filepath: d:\Project_Nodejs\Smart_Market\src\components\HeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArtCard from "./ArtCard";

// Mảng dữ liệu nghệ thuật
const artworks = [
  {
    id: 1,
    title: "Abstract Emotions",
    quote: '"Art is not what you see, but what you make others see."',
    imageUrl: "/src/assets/background_3.jpg",
  },
  {
    id: 2,
    title: "Autumn Landscape",
    quote: '"Nature always wears the colors of the spirit."',
    imageUrl: "/src/assets/background_2.jpg",
  },
  {
    id: 3,
    title: "The Starry Night",
    quote:
      '"I look at the stars and with all my being feel that I am part of one of these stars."',
    imageUrl: "/src/assets/background_1.jpg",
  },
  {
    id: 4,
    title: "Peaceful Mountains",
    quote: '"The mountains are calling and I must go."',
    imageUrl: "/src/assets/background_4.jpg",
  },
  {
    id: 5,
    title: "Museum Masterpiece",
    quote: '"Every artist was first an amateur."',
    imageUrl: "/src/assets/background_5.jpg",
  },
];

export default function HeroSection() {
  // State để theo dõi index của card hiện tại (trung tâm)
  const [activeIndex, setActiveIndex] = useState<number>(2);
  // State để lưu trữ hướng chuyển động (trái hoặc phải)
  const [direction, setDirection] = useState<number>(0);  // State để theo dõi kích thước màn hình cho responsive
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // State để lưu trữ kích thước màn hình
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
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
        .catch((err) => {
          console.error("Error preloading images", err);
        });
    };

    preloadImages();
  }, []);
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
  // Sử dụng background image dựa trên card hiện tại
  const backgroundStyle = {
    backgroundImage: `url(${artworks[activeIndex].imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    transition: "background-image 0.8s ease-in-out",
  };

  // Xử lý khi nhấn nút điều hướng trước đó
  const handlePrevClick = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) => {
      // Tạo hiệu ứng vòng tròn khi quay lại
      if (prevIndex <= 0) {
        return artworks.length - 1; // Quay lại card cuối cùng
      } else {
        return prevIndex - 1;
      }
    });
  };

  // Xử lý khi nhấn nút điều hướng tiếp theo
  const handleNextClick = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => {
      // Tạo hiệu ứng vòng tròn khi đi tiếp
      if (prevIndex >= artworks.length - 1) {
        return 0; // Quay lại card đầu tiên
      } else {
        return prevIndex + 1;
      }
    });
  };

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
      style={backgroundStyle}
      className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-blue-900"
    >
      {/* Overlay gradient để làm tối nhẹ background mà không làm mờ */}      <motion.div
        className="absolute inset-0 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Container cho toàn bộ nội dung - đảm bảo không vượt quá kích thước màn hình */}
      <div className="w-full h-full flex flex-col items-center justify-center px-4 pt-12">
        <div className="text-center space-y-4 mt-16">
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white relative z-40 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: "'Segoe Print', cursive",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              letterSpacing: "1px",
            }}
          >
            Touch the art.<br />
            Own the emotion
          </motion.h1>
          <motion.button
            className="px-6 py-2 bg-yellow-500 text-white rounded-md text-lg font-semibold shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore More
          </motion.button>
        </div>
        
        {/* Container for art cards */}
        <div className="relative w-full h-[200px] sm:h-[220px] md:h-[250px] lg:h-[300px] flex items-center justify-center mt-8">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              className="absolute pointer-events-auto"
              custom={direction}
              initial={false}
              animate={getCardStyles(index)}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                mass: 1,
              }}
            >
              <ArtCard
                title={artwork.title}
                quote={artwork.quote}
                imageUrl={artwork.imageUrl}
                onPrev={handlePrevClick}
                onNext={handleNextClick}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
