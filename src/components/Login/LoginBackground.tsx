import { useEffect, useState, useRef, useCallback } from "react";

const LoginBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isVisible, setIsVisible] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Heavily throttled mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return; // Skip if already scheduled

    rafRef.current = requestAnimationFrame(() => {
      const newX = e.clientX / window.innerWidth;
      const newY = e.clientY / window.innerHeight;

      // Large threshold to minimize updates
      setMousePosition((prev) => {
        if (Math.abs(prev.x - newX) < 0.05 && Math.abs(prev.y - newY) < 0.05) {
          return prev;
        }
        return { x: newX, y: newY };
      });
      
      rafRef.current = 0;
    });
  }, []);

  // Simplified visibility check
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Throttled event listener
    let timeout: number = 0;
    const throttledHandler = (e: MouseEvent) => {
      if (timeout) return;
      timeout = setTimeout(() => {
        handleMouseMove(e);
        timeout = 0;
      }, 16); // ~60fps max
    };

    window.addEventListener("mousemove", throttledHandler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", throttledHandler);
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible, handleMouseMove]);

  return (
    <div
      ref={backgroundRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        contain: "layout style paint",
        willChange: "auto", // Let browser decide
      }}
    >
      {/* Static gradient background - No animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0]" />

      {/* CSS-only texture pattern - No external image */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(194, 167, 146, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(194, 167, 146, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Single mouse follower - Minimal animation */}
      {isVisible && (
        <div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-[#c2a792]/5 to-[#d8bca6]/3 blur-2xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translateX(${mousePosition.x * (typeof window !== "undefined" ? window.innerWidth - 160 : 840)}px) translateY(${mousePosition.y * (typeof window !== "undefined" ? window.innerHeight - 160 : 640)}px)`,
            willChange: "transform",
          }}
        />
      )}

      {/* Minimal floating elements - CSS animation only */}
      <div
        className="absolute -left-10 top-20 w-32 h-32 rounded-full bg-gradient-to-r from-[#e8d0b3]/6 to-[#f2e4c7]/4 blur-2xl"
        style={{
          animation: "float 30s ease-in-out infinite",
        }}
      />

      <div
        className="absolute right-10 bottom-20 w-40 h-40 rounded-full bg-gradient-to-l from-[#d4e1f7]/5 to-[#e8f2ff]/3 blur-2xl"
        style={{
          animation: "pulse 25s ease-in-out infinite",
        }}
      />

      {/* Static geometric shapes - No animation */}
      <div className="absolute top-32 left-16 w-8 h-8 border border-[#c2a792]/8 rotate-45" />
      <div className="absolute bottom-40 right-20 w-6 h-6 bg-[#d8bca6]/6 rounded-full" />

      {/* Minimal particles - CSS animation */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#c2a792]/8 rounded-full"
          style={{
            left: `${25 + i * 20}%`,
            top: `${35 + i * 10}%`,
            animation: `float ${20 + i * 5}s ease-in-out infinite ${i * 2}s`,
          }}
        />
      ))}

      {/* CSS Keyframes were removed as <style jsx> is not standard in Vite/React. 
          Consider moving keyframes to a global CSS file or using a CSS-in-JS solution. */}
    </div>
  );
};

export default LoginBackground;