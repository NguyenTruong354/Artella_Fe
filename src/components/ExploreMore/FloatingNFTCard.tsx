import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Eye } from 'lucide-react';

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

interface FloatingNFTCardProps {
  nft: NFTData;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  performanceMode?: boolean;
}

const FloatingNFTCard: React.FC<FloatingNFTCardProps> = ({
  nft,
  isHovered,
  onHover,
  onLeave,
  performanceMode = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const getRarityGlow = (rarity: string) => {
    if (performanceMode) return '';
    switch (rarity) {
      case 'legendary':
        return 'drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]';
      case 'epic':
        return 'drop-shadow-[0_0_10px_rgba(138,43,226,0.6)]';
      case 'rare':
        return 'drop-shadow-[0_0_8px_rgba(0,123,255,0.6)]';
      default:
        return 'drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'border-yellow-400/60';
      case 'epic':
        return 'border-purple-500/60';
      case 'rare':
        return 'border-blue-400/60';
      default:
        return 'border-white/20';
    }
  };
  return (
    <motion.div
      className="transform-gpu will-change-transform"
      style={{
        transformStyle: 'preserve-3d',      }}
      animate={!prefersReducedMotion && !performanceMode ? {
        rotateY: [nft.rotation.y, nft.rotation.y + 360],
        y: [0, -10, 0],
      } : {}}
      transition={{
        rotateY: {
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Simplified Aura Effect */}
      {!performanceMode && (
        <motion.div
          className="absolute inset-0 rounded-2xl blur-lg opacity-40"
          style={{
            background: `radial-gradient(circle, ${nft.auraColor}30 0%, transparent 60%)`,
            transform: 'scale(1.3)',
          }}
          animate={{
            opacity: isHovered ? 0.7 : 0.4,
            scale: isHovered ? 1.6 : 1.3,
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* NFT Card */}
      <motion.div
        className={`relative w-48 h-64 bg-black/40 backdrop-blur-sm border ${getRarityBorder(nft.rarity)} rounded-xl overflow-hidden ${getRarityGlow(nft.rarity)} cursor-pointer`}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Simple overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Rarity badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
            nft.rarity === 'legendary' ? 'bg-yellow-400/80 text-black' :
            nft.rarity === 'epic' ? 'bg-purple-500/80 text-white' :
            'bg-blue-400/80 text-white'
          }`}>
            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 text-white">
          <h3 className="text-sm font-bold mb-1 truncate">{nft.title}</h3>
          <p className="text-xs text-gray-300 mb-2">{nft.artist}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-white/10 px-2 py-1 rounded">
              {nft.category}
            </span>
            <span className="text-sm font-bold text-cyan-400">{nft.price}</span>
          </div>
        </div>

        {/* Simplified Hover Info Panel */}
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-sm p-4 flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <div className="text-center text-white">
            <h3 className="text-lg font-bold mb-2">{nft.title}</h3>
            <p className="text-gray-300 mb-3">by {nft.artist}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price</span>
                <span className="font-bold text-cyan-400">{nft.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span>{nft.category}</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors">
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-cyan-500/20 rounded-lg text-xs hover:bg-cyan-500/30 transition-colors">
                <Star className="w-3 h-3" />
                <span>Bid</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Minimal sparkle effect */}
        {!performanceMode && isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FloatingNFTCard;
