import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import FloatingNFTCard from './FloatingNFTCard';
import BackgroundNebula from './BackgroundNebula';
import ParticleEffects from './ParticleEffects';

interface NFTData {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  auraColor: string;
}

interface CosmicSpaceProps {
  nfts: NFTData[];
  performanceMode?: boolean;
}

const CosmicSpace: React.FC<CosmicSpaceProps> = ({ nfts, performanceMode = false }) => {
  const [hoveredNFT, setHoveredNFT] = useState<number | null>(null);
  const [particlesReady, setParticlesReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Camera position - chỉ cho phép di chuyển vertical và zoom
  const cameraY = useMotionValue(0);
  const cameraZ = useMotionValue(0);
  const smoothCameraY = useSpring(cameraY, { stiffness: 30, damping: 30 });
  const smoothCameraZ = useSpring(cameraZ, { stiffness: 30, damping: 30 });
  // Event handlers
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (performanceMode) return;
      e.preventDefault();
      
      // Shift key + wheel = zoom, normal wheel = vertical movement
      if (e.shiftKey) {
        cameraZ.set(Math.max(-800, Math.min(400, cameraZ.get() + e.deltaY * 0.5)));
      } else {
        // Vertical camera movement - increased range để có thể xem hết cards
        cameraY.set(Math.max(-300, Math.min(300, cameraY.get() + e.deltaY * 0.8)));
      }
    };

    // Keyboard navigation - chỉ up/down với range lớn hơn
    const handleKeyDown = (e: KeyboardEvent) => {
      if (performanceMode) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          cameraY.set(Math.max(-300, cameraY.get() - 50));
          break;
        case 'ArrowDown':
          e.preventDefault();
          cameraY.set(Math.min(300, cameraY.get() + 50));
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      // Add keyboard listener to document for global access
      document.addEventListener('keydown', handleKeyDown);
    }

    // Delay particles to reduce initial lag
    const particleTimeoutId = setTimeout(() => setParticlesReady(true), 2000);

    return () => {
      clearTimeout(particleTimeoutId);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [cameraZ, cameraY, performanceMode]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Background Nebula - only if not performance mode */}
      {!performanceMode && <BackgroundNebula />}

      {/* Particle Effects - delayed and reduced */}
      {!performanceMode && particlesReady && <ParticleEffects />}

      {/* 3D Space Container */}
      <motion.div
        className="absolute inset-0 transform-gpu will-change-transform"
        style={{
          translateY: prefersReducedMotion ? 0 : smoothCameraY,
          translateZ: prefersReducedMotion ? 0 : smoothCameraZ,
          transformStyle: 'preserve-3d',
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >        {/* NFT Cards with staggered loading */}
        {nfts.map((nft, index) => (
          <motion.div
            key={nft.id}
            className="absolute"
            style={{
              left: `calc(50% + ${nft.position.x}px)`,
              top: `calc(50% + ${nft.position.y}px)`,
              transform: `translate(-50%, -50%) translateZ(${nft.position.z}px) rotateX(${nft.rotation.x}deg) rotateY(${nft.rotation.y}deg) rotateZ(${nft.rotation.z}deg)`,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.3,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <FloatingNFTCard
              nft={nft}
              isHovered={hoveredNFT === nft.id}
              onHover={() => setHoveredNFT(nft.id)}
              onLeave={() => setHoveredNFT(null)}
              performanceMode={performanceMode}
            />
          </motion.div>
        ))}

        {/* Minimal distant stars for performance mode */}
        {!performanceMode && [...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 200 - 50}%`,
              top: `${Math.random() * 200 - 50}%`,
              transform: `translateZ(${-500 - Math.random() * 300}px)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Simple cosmic rings - reduced complexity */}
        {!performanceMode && [...Array(2)].map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute border border-white/10 rounded-full ring-animation"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
              left: '50%',
              top: '50%',
              marginLeft: `${-(150 + i * 75)}px`,
              marginTop: `${-(150 + i * 75)}px`,
              transform: `translateZ(${-400 - i * 100}px) rotateX(${30 + i * 10}deg)`,
              animation: `cosmic-ring ${15 + i * 5}s linear infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/60"
      >
        <p className="text-sm mb-2">
          {performanceMode ? 'Performance Mode • Limited Effects' : 'Scroll up/down • Arrow keys • Shift+Scroll to zoom'}
        </p>
        {!performanceMode && (
          <div className="flex items-center justify-center space-x-4 text-xs">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              Legendary
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Epic
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
              Rare
            </span>
          </div>
        )}
      </motion.div>

      {/* CSS Animations for better performance */}
      <style>{`
        @keyframes cosmic-ring {
          from { transform: translateZ(var(--z)) rotateX(var(--rx)) rotateZ(0deg); }
          to { transform: translateZ(var(--z)) rotateX(var(--rx)) rotateZ(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default CosmicSpace;