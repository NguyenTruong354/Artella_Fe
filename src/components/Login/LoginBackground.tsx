import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

const LoginBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Throttled mouse movement with RAF for performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    });
  }, []);

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible, handleMouseMove]);
  // Optimized animation variants with GPU acceleration
  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        // GPU acceleration hints
        type: "tween",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      },
    },
  };

  const waveVariants = {
    animate: {
      pathLength: [0, 1, 0],
      opacity: [0, 0.8, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      },
    },  };

  return (
    <div 
      ref={backgroundRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        // GPU acceleration
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Main gradient background - Static for performance */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0]"
        style={{ willChange: 'auto' }}
      />
      
      {/* Simplified animated gradient overlay */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(240, 230, 216, 0.6) 0%, rgba(232, 221, 208, 0.4) 100%)",
              "linear-gradient(135deg, rgba(248, 237, 227, 0.4) 0%, rgba(240, 230, 216, 0.6) 100%)",
            ],
          }}
          transition={{
            duration: 15, // Slower transition
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween",
          }}
          style={{
            willChange: 'background',
            transform: 'translateZ(0)',
          }}
        />
      )}

      {/* Texture overlay - Static */}
      <div 
        className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-5"
        style={{ willChange: 'auto' }}
      />

      {/* Interactive mouse follower - Only when visible */}
      {isVisible && (
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-[#c2a792]/15 to-[#d8bca6]/15 blur-3xl"
          animate={{
            x: mousePosition.x * (typeof window !== 'undefined' ? window.innerWidth : 1000) - 160,
            y: mousePosition.y * (typeof window !== 'undefined' ? window.innerHeight : 800) - 160,
          }}
          transition={{
            type: "spring",
            stiffness: 30, // Reduced stiffness
            damping: 40,   // Increased damping
          }}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />
      )}      {/* Optimized floating artistic elements */}
      {isVisible && (
        <>
          <motion.div
            className="absolute -left-32 top-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#e8d0b3]/20 to-[#f2e4c7]/15 blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          
          <motion.div
            className="absolute right-10 bottom-20 w-72 h-72 rounded-full bg-gradient-to-l from-[#d4e1f7]/15 to-[#e8f2ff]/10 blur-3xl"
            variants={pulseVariants}
            animate="animate"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
          
          <motion.div
            className="absolute left-1/4 top-10 w-48 h-48 rounded-full bg-gradient-to-br from-[#f7e8d4]/15 to-[#fff5e6]/8 blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
              animationDelay: "2s",
            }}
          />
        </>
      )}

      {/* Simplified brush strokes - Reduced complexity */}
      {isVisible && (
        <>
          <svg 
            className="absolute top-16 right-20 w-32 h-32 opacity-10" 
            viewBox="0 0 200 200"
            style={{ willChange: 'auto' }}
          >
            <motion.path
              d="M30,150 Q70,30 170,50 Q190,70 150,170"
              stroke="#c2a792"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              variants={waveVariants}
              animate="animate"
            />
          </svg>
          
          <svg 
            className="absolute bottom-20 left-12 w-28 h-28 opacity-8" 
            viewBox="0 0 200 200"
            style={{ willChange: 'auto' }}
          >
            <motion.path
              d="M50,50 Q110,150 170,70"
              stroke="#8e5a5a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              variants={waveVariants}
              animate="animate"
              style={{ animationDelay: "3s" }}
            />
          </svg>
        </>
      )}

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-32 left-16 w-16 h-16 border-2 border-[#c2a792]/20 rotate-45"
        animate={{
          rotate: [45, 405, 45],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-40 right-20 w-12 h-12 bg-[#d8bca6]/15 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-8 h-20 bg-[#c2a792]/10 rounded-full"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particle-like dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#c2a792]/20 rounded-full"
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + (i * 5)}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + (i * 0.5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Atmospheric lighting effects */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-bl from-[#f0e6d8]/20 via-[#f8ede3]/15 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-[#d8bca6]/15 via-[#c2a792]/10 to-transparent blur-3xl"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(194, 167, 146, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(194, 167, 146, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};

export default LoginBackground;
