import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowLeft, Search, Grid, List } from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";
import { WaveTransition } from "../WaveTransition";
import { DarkModeToggle } from "../DarkModeToggle";
import { useNavigate } from 'react-router-dom';
import NFTCard from './NFTCard';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ExploreMore: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const darkMode = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // NFT Data
  const nftData: NFTData[] = [
    {
      id: 1,
      title: "Stellar Dreams",
      artist: "CosmicArt",
      price: "2.5 ETH",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop",
      category: "Abstract",
      rarity: "legendary",
      auraColor: "rgb(255, 215, 0)",
      likes: 234,
      views: 1520
    },
    {
      id: 2,
      title: "Nebula Genesis",
      artist: "StarForge",
      price: "1.8 ETH",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=400&fit=crop",
      category: "Digital",
      rarity: "epic",
      auraColor: "rgb(138, 43, 226)",
      likes: 189,
      views: 980
    },
    {
      id: 3,
      title: "Quantum Essence",
      artist: "VoidWalker",
      price: "3.2 ETH",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
      category: "3D Art",
      rarity: "legendary",
      auraColor: "rgb(0, 255, 255)",
      likes: 412,
      views: 2340
    },
    {
      id: 4,
      title: "Galaxy Explorer",
      artist: "SpaceArt",
      price: "1.5 ETH",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=400&fit=crop",
      category: "Space",
      rarity: "rare",
      auraColor: "rgb(0, 191, 255)",
      likes: 156,
      views: 743
    },
    {
      id: 5,
      title: "Cosmic Energy",
      artist: "NeonMaster",
      price: "2.1 ETH",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
      category: "Energy",
      rarity: "epic",
      auraColor: "rgb(255, 0, 255)",
      likes: 289,
      views: 1340
    },
    {
      id: 6,
      title: "Void Portal",
      artist: "DarkMatter",
      price: "2.8 ETH",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop",
      category: "Portal",
      rarity: "legendary",
      auraColor: "rgb(255, 165, 0)",
      likes: 367,
      views: 1890
    },
    {
      id: 7,
      title: "Star Forge",
      artist: "StellarCraft",
      price: "1.9 ETH",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
      category: "Stellar",
      rarity: "rare",
      auraColor: "rgb(255, 20, 147)",
      likes: 201,
      views: 892
    },
    {
      id: 8,
      title: "Dimension Shift",
      artist: "RealmBender",
      price: "3.5 ETH",
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=400&fit=crop",
      category: "Dimension",
      rarity: "legendary",
      auraColor: "rgb(50, 205, 50)",
      likes: 445,
      views: 2567
    },
    {
      id: 9,
      title: "Digital Waves",
      artist: "CyberArt",
      price: "1.2 ETH",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
      category: "Digital",
      rarity: "common",
      auraColor: "rgb(0, 123, 255)",
      likes: 87,
      views: 456
    },
    {
      id: 10,
      title: "Neon Dreams",
      artist: "ElectricVibe",
      price: "4.1 ETH",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      category: "Neon",
      rarity: "legendary",
      auraColor: "rgb(255, 69, 0)",
      likes: 523,
      views: 3210
    },
    {
      id: 11,
      title: "Ocean Depths",
      artist: "AquaVision",
      price: "2.7 ETH",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
      category: "Nature",
      rarity: "epic",
      auraColor: "rgb(0, 206, 209)",
      likes: 312,
      views: 1675
    },
    {
      id: 12,
      title: "Crystal Formation",
      artist: "MineralMaster",
      price: "1.6 ETH",
      image: "https://images.unsplash.com/photo-1582143020011-e8d5fa0cb0a2?w=400&h=400&fit=crop",
      category: "Crystal",
      rarity: "rare",
      auraColor: "rgb(147, 112, 219)",
      likes: 178,
      views: 734
    }
  ];

  const categories = ['all', ...Array.from(new Set(nftData.map(nft => nft.category)))];

  const filteredNFTs = nftData.filter(nft => {
    const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
    const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBackToHome = () => {
    navigate('/Home');
  };

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-visible gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
        role="main"
        aria-label="Explore More NFTs"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-500"></div>
        </div>

        {/* Header */}
        <motion.header
          className="flex flex-col sm:flex-row justify-between items-center mb-8 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
          role="banner"
          aria-label="Explore More Header"
        >
          {/* Back Button and Title */}
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <motion.button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Explore More NFTs
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discover amazing digital artworks
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Search and Filter Bar */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-gray-700'
                } backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* NFT Grid */}
        <motion.main
          className="relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                viewMode={viewMode}
              />
            ))}
          </div>

          {filteredNFTs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No NFTs found matching your criteria
              </p>
            </div>
          )}
        </motion.main>
      </div>
    </>
  );
};

export default ExploreMore;
