import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import GridGalleryRotator from "./GridGalleryRotator";

const ExploreSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);  // Single image URL for the entire grid
  const mainImageUrl = "/src/assets/background_9.JPG";
  
  // Gallery items configured for the 6x6 grid with specific grid areas
  const galleryItems = [
    {
      id: "item-1",
      area: "area-2-4-1-3", // Large 3x3 grid at left top
    },
    {
      id: "item-2",
      area: "area-1-4-2-5", // 2x2 grid at right top
    },
    {
      id: "item-3",
      area: "area-3-4-5-6", // 3x3 grid at right center
    },
    {
      id: "item-4",
      area: "area-5-2-6-3", // 2x2 grid at bottom left
    },
    {
      id: "item-5",
      area: "area-1-3", // Individual cell at top
    },
    {
      id: "item-6",
      area: "area-2-6", // Individual cell at right
    },
    {
      id: "item-7",
      area: "area-5-1", // Individual cell at bottom left
    }
  ];
  // Framer Motion variants - we'll use these for the text animation only

  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const brushStrokeVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        delay: 0.4,
        duration: 1,
        ease: "easeOut",
      },
    },
  };  return (
    <section className="bg-[#F8F1E9] py-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-orange-100 opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        {/* Title at the top center */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <motion.div
              className="absolute -top-2 -left-4 w-48 h-8 bg-[#D18C7C] opacity-60 transform -rotate-1"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={brushStrokeVariants}
            ></motion.div>
            
            <motion.h2
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={textVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-900 relative z-10 tracking-wide"
            >
              Explore our top nft art works.
            </motion.h2>
          </div>
        </div>
        
        {/* Content with text on left, gallery on right */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Left side: Text content */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={textVariants}
            className="text-base md:text-lg font-light text-gray-800 space-y-4 max-w-md md:w-1/2 order-2 md:order-1"
          >
            <p>
              Step into a curated gallery of the finest NFT artworks — where digital creativity meets timeless <span className="font-bold italic">emotion</span>.
            </p>
            
            <p>
              From abstract expressions to contemporary masterpieces, each piece is a unique token of ownership secured by blockchain technology.
            </p>
            
            <p>
              Whether you're a passionate collector or a first-time explorer, discover art that transcends pixels — and <span className="font-bold">belongs to you</span>.
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-8 py-3 
                       text-sm md:text-base rounded-full font-medium shadow-md 
                       hover:shadow-[#e8d0b3]/40 uppercase tracking-wide"
            >
              View Collection
            </motion.button>
          </motion.div>          {/* Right side: Grid Gallery with rotation */}
          <div className="md:w-1/2 order-1 md:order-2">
            <GridGalleryRotator 
              imageUrl={mainImageUrl} 
              rotationInterval={10000} 
              autoRotate={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
