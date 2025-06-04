import { motion } from "framer-motion";
import { useState, useEffect, memo } from "react";

interface ArtCardProps {
  title: string;
  quote: string;
  imageUrl: string;
  onPrev?: () => void;
  onNext?: () => void;
  index?: number; 
}

// Định nghĩa các variants để tối ưu hóa hiệu suất animation
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 150,
      damping: 15
    }
  }),
  hover: {
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.5)",
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const contentBoxVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1 + 0.2, 
      duration: 0.4,
      ease: "easeOut"
    }
  }),
  hover: {
    opacity: 1,
    y: 0,
    scale: 1.02,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transition: {
      duration: 0.2
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1 + 0.3, 
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

const buttonVariants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 10 }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: i * 0.1 + 0.5, 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }),
  hover: {
    scale: 1.2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.9
  }
};

// Memo hóa component để tránh render lại không cần thiết
const ArtCard = memo(({ title, quote, imageUrl, onPrev, onNext, index = 0 }: ArtCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hiệu ứng xuất hiện khi component được mount
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div 
      className="relative w-[280px] md:w-[350px] h-[180px] md:h-[220px] rounded-lg overflow-hidden shadow-xl flex items-center justify-center mx-auto border border-white/30 ring-2 ring-white/10"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      variants={cardVariants}
      custom={index}
    >
      <motion.img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        loading="eager"
      />
      
      {/* Overlay - Lighter gradient overlay with animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" 
        initial={{ opacity: 0.6 }}
        animate={{ 
          opacity: [0.6, 0.8, 0.6] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          repeatType: "mirror",
          ease: "easeInOut" 
        }}
      />
      
      {/* Glass Content Box */}
      <motion.div 
        className="absolute bottom-4 left-3 right-3 z-20 p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 shadow-lg"
        variants={contentBoxVariants}
        custom={index}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        whileHover="hover"
      >
        <motion.h2 
          className="text-xl font-bold text-white mb-1 drop-shadow-lg"
          variants={textVariants}
          custom={index}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-sm text-white/90 drop-shadow-sm line-clamp-2"
          variants={textVariants}
          custom={index + 0.1}
        >
          {quote}
        </motion.p>
      </motion.div>
      
      {/* Navigation Controls Container - ensures buttons are always on top */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* Left Arrow */}
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          whileHover="hover"
          whileTap="tap"
          custom={[-1, index]}
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/40 backdrop-blur-sm text-white shadow-lg focus:outline-none pointer-events-auto border border-white/20"
          onClick={(e) => {
            e.stopPropagation();
            if (onPrev) onPrev();
          }}
          aria-label="Previous"
          type="button"
        >
          <motion.svg 
            width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            whileHover={{ x: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </motion.svg>
        </motion.button>
        
        {/* Right Arrow */}
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          whileHover="hover"
          whileTap="tap"
          custom={[1, index]}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500/40 backdrop-blur-sm text-white shadow-lg focus:outline-none pointer-events-auto border border-white/20"
          onClick={(e) => {
            e.stopPropagation();
            if (onNext) onNext();
          }}
          aria-label="Next"
          type="button"
        >
          <motion.svg 
            width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            whileHover={{ x: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  );
});

export default ArtCard;
