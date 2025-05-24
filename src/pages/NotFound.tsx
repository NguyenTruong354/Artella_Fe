import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations when component mounts
    setIsVisible(true);
    controls.start("visible");

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [controls]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const paintBrushVariants = {
    animate: {
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 0.9, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0] 
                 relative overflow-hidden flex items-center justify-center p-6"
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Floating Art Elements */}
      <motion.div
        className="absolute -left-20 top-20 w-96 h-96 rounded-full bg-gradient-to-r 
                   from-[#e8d0b3] to-[#f2e4c7] opacity-20 blur-3xl"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 20,
          scale: [1, 1.2, 1],
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
      />

      <motion.div
        className="absolute right-16 top-32 w-80 h-80 rounded-full bg-gradient-to-l 
                   from-[#d4e1f7] to-[#e8f2ff] opacity-25 blur-3xl"
        animate={{
          x: -mousePosition.x * 25,
          y: mousePosition.y * 15,
          scale: [1, 1.15, 1],
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 20,
        }}
      />

      {/* Artistic Paint Splatters */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-[#c2a792] 
                   to-[#d8bca6] rounded-full opacity-30 blur-2xl"
        variants={floatingVariants}
        animate="animate"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-tl from-[#8a9690] 
                   to-[#a8b5ab] rounded-full opacity-25 blur-xl"
        variants={floatingVariants}
        animate="animate"
        style={{
          animationDelay: "2s",
        }}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 text-center max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Artistic 404 Number */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] 
                       relative z-10 font-serif tracking-wider"
            style={{
              fontFamily: "'Playfair Display', serif",
              textShadow: "4px 4px 8px rgba(0,0,0,0.1)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            404
          </motion.h1>

          {/* Paint Brush Stroke Behind 404 */}
          <motion.div
            className="absolute inset-0 -z-10"
            variants={paintBrushVariants}
            animate="animate"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 200"
              className="absolute inset-0 text-[#c2a792] opacity-20"
            >
              <motion.path
                d="M50,100 Q200,50 350,100 Q200,150 50,100"
                stroke="currentColor"
                strokeWidth="20"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Artistic Title */}
        <motion.div
          className="mb-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-serif text-[#46594f] mb-4 tracking-wide">
            🎨 Oops! This Masterpiece Doesn't Exist
          </h2>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] 
                       rounded-full mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isVisible ? 1 : 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />
        </motion.div>

        {/* Creative Message */}
        <motion.div
          className="mb-8 space-y-4"
          variants={itemVariants}
        >
          <p className="text-lg text-[#6d7f75] font-light leading-relaxed">
            It seems like the page you're looking for has been moved to another gallery, 
            or perhaps it was just a beautiful sketch that never made it to the final canvas.
          </p>
          
          <motion.div
            className="flex items-center justify-center space-x-4 text-2xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span>🎨</span>
            <span>✨</span>
            <span>🖼️</span>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          variants={itemVariants}
        >
          {/* Go Home Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r 
                         from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                         rounded-full font-medium shadow-lg transition-all duration-300 
                         border border-white/20 flex items-center space-x-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center space-x-2">
                <span>🏠</span>
                <span>Return to Gallery</span>
              </span>
            </Link>
          </motion.div>

          {/* Go Back Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="group relative overflow-hidden px-8 py-4 bg-white/60 backdrop-blur-sm 
                         border-2 border-[#e2d6c3] text-[#46594f] rounded-full font-medium 
                         shadow-lg hover:bg-white/80 hover:border-[#c2a792] transition-all 
                         duration-300 flex items-center space-x-2"
            >
              <span className="flex items-center space-x-2">
                <span>↩️</span>
                <span>Go Back</span>
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="mt-12 flex items-center justify-center space-x-8"
          variants={itemVariants}
        >
          {/* Floating Art Tools */}
          <motion.div
            className="text-4xl"
            animate={{
              rotate: [0, 10, -10, 0],
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🖌️
          </motion.div>

          <motion.div
            className="text-3xl"
            animate={{
              rotate: [0, -15, 15, 0],
              y: [5, -5, 5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            🎭
          </motion.div>

          <motion.div
            className="text-4xl"
            animate={{
              rotate: [0, 20, -20, 0],
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            🖼️
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Additional Floating Elements */}
      <motion.div
        className="absolute bottom-20 left-16 text-6xl opacity-30"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        🎨
      </motion.div>

      <motion.div
        className="absolute top-16 right-24 text-5xl opacity-25"
        animate={{
          rotate: [360, 0],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✨
      </motion.div>

      {/* Bottom Decorative Wave */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 opacity-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 120"
          className="text-[#c2a792]"
        >
          <motion.path
            d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default NotFound;
