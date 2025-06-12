import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, Heart } from 'lucide-react';

interface NFTData {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  auraColor: string;
  likes: number;
  views: number;
}

interface NFTCardProps {
  nft: NFTData;
  viewMode: 'grid' | 'list';
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'shadow-lg shadow-yellow-400/20';
      case 'epic':
        return 'shadow-lg shadow-purple-500/20';
      case 'rare':
        return 'shadow-lg shadow-blue-400/20';
      default:
        return 'shadow-lg shadow-gray-500/10';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        className={`flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border ${getRarityBorder(nft.rarity)} rounded-xl ${getRarityGlow(nft.rarity)} cursor-pointer`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute top-1 right-1 px-1 py-0.5 rounded text-xs font-bold ${
            nft.rarity === 'legendary' ? 'bg-yellow-400/80 text-black' :
            nft.rarity === 'epic' ? 'bg-purple-500/80 text-white' :
            nft.rarity === 'rare' ? 'bg-blue-400/80 text-white' :
            'bg-gray-400/80 text-white'
          }`}>
            {nft.rarity.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{nft.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">by {nft.artist}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
              {nft.category}
            </span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{nft.price}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{nft.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{nft.views}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border ${getRarityBorder(nft.rarity)} rounded-xl overflow-hidden ${getRarityGlow(nft.rarity)} cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.title}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Rarity badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
          nft.rarity === 'legendary' ? 'bg-yellow-400/80 text-black' :
          nft.rarity === 'epic' ? 'bg-purple-500/80 text-white' :
          nft.rarity === 'rare' ? 'bg-blue-400/80 text-white' :
          'bg-gray-400/80 text-white'
        }`}>
          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
        </div>

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 left-2 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{nft.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">by {nft.artist}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
            {nft.category}
          </span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{nft.price}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{nft.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{nft.views}</span>
          </div>
        </div>
      </div>

      {/* Hover overlay with actions */}
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col justify-center items-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors">
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500/80 rounded-lg text-white hover:bg-purple-500 transition-colors">
          <Star className="w-4 h-4" />
          <span>Place Bid</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default NFTCard;
