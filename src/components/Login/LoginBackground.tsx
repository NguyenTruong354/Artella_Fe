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
      const newX = e.clientX / window.innerWidth;
      const newY = e.clientY / window.innerHeight;

      // Only update if movement is significant enough to avoid unnecessary re-renders
      setMousePosition((prev) => {
        if (Math.abs(prev.x - newX) < 0.01 && Math.abs(prev.y - newY) < 0.01) {
          return prev;
        }
        return { x: newX, y: newY };
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
  }, [isVisible, handleMouseMove]); // Optimized animation variants with GPU acceleration and reduced calculations
  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 12, // Slower for smoother animation
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 8, // Slower for better performance
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      },
    },
  };

  const waveVariants = {
    animate: {
      pathLength: [0, 1, 0],
      opacity: [0, 0.6, 0],
      transition: {
        duration: 15, // Much slower for performance
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      },
    },
  };

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        // GPU acceleration
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Main gradient background - Static for performance */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0]"
        style={{ willChange: "auto" }}
      />
      {/* Simplified animated gradient overlay - Optimized */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(240, 230, 216, 0.5) 0%, rgba(232, 221, 208, 0.3) 100%)",
              "linear-gradient(135deg, rgba(248, 237, 227, 0.3) 0%, rgba(240, 230, 216, 0.5) 100%)",
            ],
          }}
          transition={{
            duration: 20, // Much slower for performance
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween",
          }}
          style={{
            willChange: "background",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        />
      )}
      {/* Texture overlay - Static */}
      <div
        className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-5"
        style={{ willChange: "auto" }}
      />{" "}
      {/* Interactive mouse follower - Only when visible and optimized */}
      {isVisible && (
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-[#c2a792]/12 to-[#d8bca6]/12 blur-3xl"
          animate={{
            x:
              mousePosition.x *
                (typeof window !== "undefined" ? window.innerWidth : 1000) -
              160,
            y:
              mousePosition.y *
                (typeof window !== "undefined" ? window.innerHeight : 800) -
              160,
          }}
          transition={{
            type: "spring",
            stiffness: 25, // Further reduced stiffness
            damping: 50, // Higher damping for smoother motion
            mass: 0.8, // Added mass for more natural movement
          }}
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        />
      )}{" "}
      {/* Optimized floating artistic elements with reduced opacity */}
      {isVisible && (
        <>
          <motion.div
            className="absolute -left-32 top-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#e8d0b3]/15 to-[#f2e4c7]/12 blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />

          <motion.div
            className="absolute right-10 bottom-20 w-72 h-72 rounded-full bg-gradient-to-l from-[#d4e1f7]/12 to-[#e8f2ff]/8 blur-3xl"
            variants={pulseVariants}
            animate="animate"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />

          <motion.div
            className="absolute left-1/4 top-10 w-48 h-48 rounded-full bg-gradient-to-br from-[#f7e8d4]/12 to-[#fff5e6]/6 blur-3xl"
            variants={floatingVariants}
            animate="animate"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
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
            style={{ willChange: "auto" }}
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
            style={{ willChange: "auto" }}
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
      )}{" "}
      {/* Optimized geometric shapes with slower animations */}
      <motion.div
        className="absolute top-32 left-16 w-16 h-16 border-2 border-[#c2a792]/15 rotate-45"
        animate={{
          rotate: [45, 225, 45],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20, // Much slower
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-12 h-12 bg-[#d8bca6]/12 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 12, // Slower
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute top-40 right-32 w-8 h-20 bg-[#c2a792]/8 rounded-full"
        animate={{
          rotate: [0, 180],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 16, // Slower
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />{" "}
      {/* Optimized particle-like dots with fewer elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#c2a792]/15 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${25 + i * 6}%`,
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.15, 0.4, 0.15],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 8 + i * 0.8, // Slower animations
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}{" "}
      {/* Optimized atmospheric lighting effects with slower animations */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-bl from-[#f0e6d8]/15 via-[#f8ede3]/12 to-transparent blur-3xl"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.12, 0.2, 0.12],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 35, // Much slower
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-[#d8bca6]/12 via-[#c2a792]/8 to-transparent blur-3xl"
        animate={{
          scale: [1.05, 0.95, 1.05],
          opacity: [0.08, 0.15, 0.08],
          rotate: [180, 90, 0],
        }}
        transition={{
          duration: 30, // Much slower
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />{" "}
      {/* Optimized subtle grid pattern with reduced opacity */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(194, 167, 146, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(194, 167, 146, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
          willChange: "auto",
        }}
      />
    </div>
  );
};

export default LoginBackground;
