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
  }, []);

  // Single image URL for the entire grid
  const mainImageUrl = "/src/assets/background_9.JPG";

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
  return (
    <section className="bg-[#F8F1E9] relative overflow-hidden h-screen flex items-center">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-orange-100 opacity-30 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      <div className="container mx-auto px-4 py-1 md:py-2 flex flex-col justify-center min-h-0">
        {/* Content with text on left, gallery on right */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
          {/* Left side: Text content */}{" "}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={textVariants}
            className="text-sm md:text-base lg:text-lg font-light text-gray-800 space-y-3 w-full md:w-2/5 order-2 md:order-1 md:pr-4 relative pl-4 md:pl-8 text-center"
          >
            {" "}
            {/* Texture background image */}{" "}
            <motion.img
              src="/src/assets/textxure_3.png"
              alt="Texture"
              className="absolute -left-27 md:-left-56 -top-[13%] h-32 md:h-48 object-contain opacity-70"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <motion.h2
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={textVariants}
              className="text-xl md:text-2xl lg:text-3xl font-bold font-['Segoe_Print'] text-gray-900 relative z-10 tracking-wide max-w-xs md:max-w-sm mb-1 md:mb-3 mx-auto"
            >
              <span className="text-4xl md:text-5xl lg:text-6xl inline-block mr-1">
                E
              </span>
              xplore our top nft art works.
            </motion.h2>
            <p>
              Step into a curated gallery of the finest NFT artworks — where
              digital creativity meets timeless{" "}
              <span className="font-bold italic">emotion</span>.
            </p>
            <p className="hidden md:block">
              From abstract expressions to contemporary masterpieces, each piece
              is a unique token of ownership secured by blockchain technology.
            </p>
            <p>
              Whether you're a passionate collector or a first-time explorer,
              discover art that transcends pixels — and{" "}
              <span className="font-bold">belongs to you</span>.
            </p>{" "}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 md:mt-4 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-6 py-2 md:px-8 md:py-3 
                       text-sm md:text-base rounded-full font-medium shadow-md 
                       hover:shadow-[#e8d0b3]/40 uppercase tracking-wide mx-auto block"
            >
              View Collection{" "}
            </motion.button>
          </motion.div>{" "}
          {/* Right side: Grid Gallery with rotation */}
          <div className="md:w-3/5 order-1 md:order-2 h-auto md:h-[60vh] max-h-[500px] relative -mt-2 md:mt-0">
            {/* Texture background - moved outside visible area */}
            <motion.img
              src="/src/assets/textxure_1.png"
              alt="Texture"
              className="absolute right-0 bottom-0 w-1/4 h-1/4 object-contain opacity-20 z-0 -rotate-12 translate-x-8 translate-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
            <div className="relative z-10 h-full overflow-visible">
              <GridGalleryRotator
                imageUrl={mainImageUrl}
                rotationInterval={10000}
                autoRotate={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
