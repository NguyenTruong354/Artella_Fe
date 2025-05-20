import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const ServiceSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.1 });
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
        delay: i * 0.2,
        duration: 0.8,
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        duration: 1,
      },
    },
  };

  const textureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 0.8,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 300, damping: 12 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-6 md:py-8 relative overflow-hidden h-screen flex items-center"
    >
      {/* Impressionist background texture */}
      <div className="absolute inset-0 opacity-15 mix-blend-soft-light">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-30"></div>
      </div>

      {/* Optimized light spots - reduced size and quantity */}
      <div className="absolute -left-10 top-40 w-48 h-48 rounded-full bg-[#e8d0b3] opacity-20 blur-3xl"></div>
      <div className="absolute right-20 bottom-40 w-48 h-48 rounded-full bg-[#d4e1f7] opacity-25 blur-3xl animate-pulse"></div>
      <div className="absolute left-1/3 top-1/4 w-40 h-40 rounded-full bg-[#f7e8d4] opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="relative inline-block">
            <motion.h2
              className="text-3xl md:text-4xl font-serif text-[#46594f] relative z-10 tracking-wide"
              initial="hidden"
              animate={controls}
              variants={titleVariants}
              style={{ 
                textShadow: "1px 1px 3px rgba(0,0,0,0.05)",
                fontFamily: "'Playfair Display', serif"
              }}
            >
              Our Services
            </motion.h2>
            
            {/* Texture 2 image instead of SVG brush strokes */}
            <motion.div
              className="absolute -top-5 -left-6 w-[120%] h-16 z-0 overflow-hidden"
              initial="hidden"
              animate={controls}
              variants={textureVariants}
            >
              <img 
                src="/src/assets/textxure_2.png" 
                alt="Brush texture" 
                className="w-full h-full object-cover opacity-70" 
              />
            </motion.div>
          </div>
          
          <motion.p
            className="text-base md:text-lg font-light italic text-[#6d7f75] mt-2 md:mt-3 max-w-xl mx-auto"
            initial="hidden"
            animate={controls}
            variants={titleVariants}
          >
            Where artistic expression merges with blockchain innovation
          </motion.p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-screen-xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Buy art with NFTs */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center 
                      border border-[#e2d6c3] hover:border-[#a9c1d9] transition-all duration-500 
                      group relative overflow-hidden shadow-[0_8px_20px_rgb(0,0,0,0.06)]"
            variants={itemVariants}
            custom={0}
            whileHover={{
              y: -6,
              boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.12)",
            }}
          >
            {/* Canvas texture background */}
            <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-5"></div>
            
            {/* Background color blend */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e2eff7] to-white opacity-0 group-hover:opacity-80 transition-opacity duration-700 ease-in-out"></div>
            
            {/* textxure_2 image instead of SVG brush strokes */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-56 h-56 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 rotate-45 transform"
            >
              <img 
                src="/src/assets/textxure_2.png" 
                alt="Brush texture" 
                className="w-full h-full object-cover" 
                style={{ filter: "hue-rotate(190deg) saturate(0.8)" }}
              />
            </motion.div>
            
            <div className="flex justify-center relative">
              <motion.div
                className="mb-3 md:mb-4 relative z-10"
                whileHover={{
                  filter: "brightness(1.1) contrast(1.05)",
                  transition: { duration: 0.5 },
                }}
              >
                <div className="p-3 rounded-full bg-[#e9f1f8]/50 group-hover:bg-[#e9f1f8]/80 transition-colors duration-500">
                  <img 
                    src="/src/assets/icon_1.png" 
                    alt="Buy art with NFTs" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  />
                </div>
              </motion.div>
            </div>
            
            <h3 className="text-lg md:text-xl font-serif text-[#3a5269] mb-2 relative z-10 group-hover:text-[#2a4159]">
              Acquire Masterpieces
            </h3>
            
            <p className="text-sm md:text-base font-light text-[#62737e] mb-4 relative z-10 max-w-xs mx-auto">
              Purchase authentic artworks with NFT certification — each piece captured in its purest form.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-5 py-2 
                        text-xs md:text-sm rounded-full font-medium shadow-md 
                        hover:shadow-[#e8d0b3]/40 relative z-10 uppercase tracking-wide"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Explore Gallery
            </motion.button>
          </motion.div>
          
          {/* Join live art auctions */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center 
                      border border-[#e2d6c3] hover:border-[#d3c49a] transition-all duration-500 
                      group relative overflow-hidden shadow-[0_8px_20px_rgb(0,0,0,0.06)]"
            variants={itemVariants}
            custom={1}
            whileHover={{
              y: -6,
              boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.12)",
            }}
          >
            {/* Canvas texture background */}
            <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-5"></div>
            
            {/* Background color blend */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7efd9] to-white opacity-0 group-hover:opacity-80 transition-opacity duration-700 ease-in-out"></div>
            
            {/* textxure_2 image instead of SVG brush strokes */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-56 h-56 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 rotate-[30deg] transform"
            >
              <img 
                src="/src/assets/textxure_2.png" 
                alt="Brush texture" 
                className="w-full h-full object-cover" 
                style={{ filter: "hue-rotate(45deg) saturate(0.7)" }}
              />
            </motion.div>
            
            <div className="flex justify-center relative">
              <motion.div
                className="mb-3 md:mb-4 relative z-10"
                whileHover={{
                  filter: "brightness(1.1) contrast(1.05)",
                  transition: { duration: 0.5 },
                }}
              >
                <div className="p-3 rounded-full bg-[#f7efd9]/50 group-hover:bg-[#f7efd9]/80 transition-colors duration-500">
                  <img 
                    src="/src/assets/icon_2.png" 
                    alt="Join live art auctions" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  />
                </div>
              </motion.div>
            </div>
            
            <h3 className="text-lg md:text-xl font-serif text-[#6c6344] mb-2 relative z-10 group-hover:text-[#5c5334]">
              Live Auction Salon
            </h3>
            
            <p className="text-sm md:text-base font-light text-[#75705e] mb-4 relative z-10 max-w-xs mx-auto">
              Experience the ephemeral moments of live bidding — capture the fleeting excitement of acquiring art.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-5 py-2 
                        text-xs md:text-sm rounded-full font-medium shadow-md 
                        hover:shadow-[#e8d0b3]/40 relative z-10 uppercase tracking-wide"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Join Auctions
            </motion.button>
          </motion.div>
          
          {/* Trade & transfer ownership */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center 
                      border border-[#e2d6c3] hover:border-[#d9a9a9] transition-all duration-500 
                      group relative overflow-hidden shadow-[0_8px_20px_rgb(0,0,0,0.06)]"
            variants={itemVariants}
            custom={2}
            whileHover={{
              y: -6,
              boxShadow: "0 15px 30px -12px rgba(0, 0, 0, 0.12)",
            }}
          >
            {/* Canvas texture background */}
            <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-5"></div>
            
            {/* Background color blend */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7e5e5] to-white opacity-0 group-hover:opacity-80 transition-opacity duration-700 ease-in-out"></div>
            
            {/* textxure_2 image instead of SVG brush strokes */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-56 h-56 z-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 rotate-[150deg] transform"
            >
              <img 
                src="/src/assets/textxure_2.png" 
                alt="Brush texture" 
                className="w-full h-full object-cover" 
                style={{ filter: "hue-rotate(320deg) saturate(0.7)" }}
              />
            </motion.div>
            
            <div className="flex justify-center relative">
              <motion.div
                className="mb-3 md:mb-4 relative z-10"
                whileHover={{
                  filter: "brightness(1.1) contrast(1.05)",
                  transition: { duration: 0.5 },
                }}
              >
                <div className="p-3 rounded-full bg-[#f7e5e5]/50 group-hover:bg-[#f7e5e5]/80 transition-colors duration-500">
                  <img 
                    src="/src/assets/icon_3.png" 
                    alt="Trade & transfer ownership" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                  />
                </div>
              </motion.div>
            </div>
            
            <h3 className="text-lg md:text-xl font-serif text-[#8e5a5a] mb-2 relative z-10 group-hover:text-[#7e4a4a]">
              Provenance Passage
            </h3>
            
            <p className="text-sm md:text-base font-light text-[#8a6e6e] mb-4 relative z-10 max-w-xs mx-auto">
              Transfer art with its complete narrative intact — layered with history like brushstrokes, preserved on blockchain.
            </p>
            
            <motion.button
              className="bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-5 py-2 
                        text-xs md:text-sm rounded-full font-medium shadow-md 
                        hover:shadow-[#e8d0b3]/40 relative z-10 uppercase tracking-wide"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Discover Process
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Bottom texture using textxure_2 instead of SVG */}
        <div className="mt-6 md:mt-8 relative h-6">
          <motion.div
            className="absolute bottom-0 left-0 w-full h-12 opacity-30 z-0 overflow-hidden"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.2, transition: { duration: 1.2, delay: 0.8 } }
            }}
          >
            <img 
              src="/src/assets/textxure_2.png" 
              alt="Brush texture" 
              className="w-full h-full object-cover opacity-40" 
              style={{ transform: "scaleY(0.5) scaleX(1.2)", filter: "brightness(1.2) saturate(0.7)" }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Simplified light effects */}
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gradient-to-tl from-[#f0e6d8] to-[#f8ede3] opacity-30 blur-2xl"></div>
    </section>
  );
};

export default ServiceSection;
