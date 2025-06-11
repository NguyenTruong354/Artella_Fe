import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import useDarkMode from '../../hooks/useDarkMode';
import { WaveTransition } from '../WaveTransition';
import CosmicPortal from './CosmicPortal';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { detectPerformanceMode } from './performanceConfig';

// Lazy load heavy components
const CosmicSpace = lazy(() => import('./CosmicSpace'));

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

// Performance-optimized loading component
const CosmicSpaceLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black">
    <div className="cosmic-loader" />    <style>{`
      .cosmic-loader {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const ExploreMore: React.FC = () => {
  const [portalComplete, setPortalComplete] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const darkMode = useDarkMode();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
    // Auto-detect performance mode based on device capability
  useEffect(() => {
    const autoDetected = detectPerformanceMode();
    setPerformanceMode(autoDetected);
  }, [prefersReducedMotion]);  // Memoized NFT data - 2 hàng x 4 cards = 8 NFTs với positioning đều nhau
  const cosmicNFTs: NFTData[] = useMemo(() => [
    // Hàng trên (y: -120) - 4 cards với khoảng cách đều 300px
    {
      id: 1,
      title: "Stellar Dreams",
      artist: "CosmicArt",
      price: "2.5 ETH",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=250&h=250&fit=crop",
      category: "Abstract",
      rarity: "legendary",
      position: { x: -450, y: -120, z: -200 },
      rotation: { x: 0, y: 15, z: 0 },
      auraColor: "rgb(255, 215, 0)"
    },
    {
      id: 2,
      title: "Nebula Genesis",
      artist: "StarForge",
      price: "1.8 ETH",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=250&h=250&fit=crop",
      category: "Digital",
      rarity: "epic",
      position: { x: -150, y: -120, z: -200 },
      rotation: { x: 0, y: 5, z: 0 },
      auraColor: "rgb(138, 43, 226)"
    },
    {
      id: 3,
      title: "Quantum Essence",
      artist: "VoidWalker", 
      price: "3.2 ETH",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=250&h=250&fit=crop",
      category: "3D Art",
      rarity: "legendary",
      position: { x: 150, y: -120, z: -200 },
      rotation: { x: 0, y: -5, z: 0 },
      auraColor: "rgb(0, 255, 255)"
    },
    {
      id: 4,
      title: "Galaxy Explorer",
      artist: "SpaceArt",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=250&h=250&fit=crop",
      category: "Space",
      rarity: "rare",
      position: { x: 450, y: -120, z: -200 },
      rotation: { x: 0, y: -15, z: 0 },
      auraColor: "rgb(0, 191, 255)"
    },
    // Hàng dưới (y: 120) - 4 cards với khoảng cách đều 300px
    {
      id: 5,
      title: "Cosmic Energy",
      artist: "NeonMaster",
      price: "2.1 ETH",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=250&h=250&fit=crop",
      category: "Energy",
      rarity: "epic",
      position: { x: -450, y: 120, z: -200 },
      rotation: { x: 0, y: 15, z: 0 },
      auraColor: "rgb(255, 0, 255)"
    },
    {
      id: 6,
      title: "Void Portal",
      artist: "DarkMatter",
      price: "2.8 ETH",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=250&h=250&fit=crop",
      category: "Portal",
      rarity: "legendary",
      position: { x: -150, y: 120, z: -200 },
      rotation: { x: 0, y: 5, z: 0 },
      auraColor: "rgb(255, 165, 0)"
    },
    {
      id: 7,
      title: "Star Forge",
      artist: "StellarCraft",
      price: "1.9 ETH",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=250&h=250&fit=crop",
      category: "Stellar",
      rarity: "rare",
      position: { x: 150, y: 120, z: -200 },
      rotation: { x: 0, y: -5, z: 0 },
      auraColor: "rgb(255, 20, 147)"
    },
    {
      id: 8,
      title: "Dimension Shift",
      artist: "RealmBender",
      price: "3.5 ETH",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=250&h=250&fit=crop",
      category: "Dimension",
      rarity: "legendary",
      position: { x: 450, y: 120, z: -200 },
      rotation: { x: 0, y: -15, z: 0 },
      auraColor: "rgb(50, 205, 50)"
    }
  ], []);

  const handlePortalComplete = () => {
    setPortalComplete(true);
  };

  const handleBackToHome = () => {
    navigate('/Home');
  };

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Performance Mode Toggle (for debugging) */}
        {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
          <button
            onClick={() => setPerformanceMode(!performanceMode)}
            className="fixed top-20 left-6 z-50 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded"
          >
            {performanceMode ? 'High Quality' : 'Performance'}
          </button>
        )}

        {/* Back Button */}
        <AnimatePresence>
          {portalComplete && (
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              onClick={handleBackToHome}
              className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cosmic Portal Animation */}
        <AnimatePresence>
          {!portalComplete && (
            <CosmicPortal onComplete={handlePortalComplete} />
          )}
        </AnimatePresence>

        {/* Cosmic Space with NFTs */}
        <AnimatePresence>
          {portalComplete && (
            <Suspense fallback={<CosmicSpaceLoader />}>
              <CosmicSpace 
                nfts={cosmicNFTs} 
                performanceMode={performanceMode}
              />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Background Audio - disabled in performance mode */}        {!performanceMode && (
          <audio
            ref={(el) => {
              audioRef.current = el;
              if (el) el.volume = 0.2;
            }}
            loop
            autoPlay
            className="hidden"
          >
            <source src="/sounds/space-ambient.mp3" type="audio/mpeg" />
          </audio>
        )}
      </div>
    </>
  );
};

export default ExploreMore;
