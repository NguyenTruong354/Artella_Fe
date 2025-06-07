import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Heart, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  Clock,
  Palette,
} from 'lucide-react';
import useDarkMode from '../../hooks/useDarkMode';
import { WaveTransition } from '../WaveTransition';
import { DarkModeToggle } from '../DarkModeToggle';

interface ArtworkData {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  currentBid: string;
  estimatedValue: string;
  timeLeft: string;
  bidCount: number;
  category: string;
  status: 'live' | 'upcoming' | 'sold';
  auctionHouse: string;
}

interface FeaturedArtist {
  id: number;
  name: string;
  nationality: string;
  birthYear: string;
  avatar: string;
  totalWorks: number;
  averagePrice: string;
  topSale: string;
  specialty: string;
}

const HomeSection: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());
  
  // Dark mode hook
  const darkMode = useDarkMode();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Featured Artworks Data (can be used for Trending NFT & Live Auctions)
  const featuredArtworks: ArtworkData[] = [
    {
      id: 1,
      title: "Full Abstract", // Adapted from image
      artist: "Esther Howard", // Adapted from image
      year: "2023",
      medium: "Digital Art",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop", // Placeholder, use relevant images
      currentBid: "3.40 ETH", // Adapted from image
      estimatedValue: "€50,000 - €70,000",
      timeLeft: "02:28:25", // Simulated countdown
      bidCount: 23,
      category: "Digital",
      status: 'live',
      auctionHouse: "Artella Digital"
    },
    {
      id: 2,
      title: "The Fantasy Flower", // Adapted from image
      artist: "Esther Howard", // Adapted from image
      year: "2022",
      medium: "3D Render",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=500&fit=crop", // Placeholder
      currentBid: "2.50 ETH",
      estimatedValue: "€40,000 - €55,000",
      timeLeft: "01:15:10",
      bidCount: 18,
      category: "Digital",
      status: 'live',
      auctionHouse: "Artella Digital"
    },
    {
      id: 3,
      title: "Colorful Abstract", // From image
      artist: "@johndoe", // From image
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop", // Placeholder
      currentBid: "3.40 ETH",
      timeLeft: "02:28:25", // From image
      // ... other necessary fields from ArtworkData
      year: "2024",
      medium: "Digital Painting",
      dimensions: "1920x1080",
      estimatedValue: "3-4 ETH",
      bidCount: 12,
      category: "Digital",
      status: 'live',
      auctionHouse: "NFT Marketplace"
    },
    {
      id: 4,
      title: "Modern Art Collection", // From image
      artist: "@janedoe", // From image
      image: "https://images.unsplash.com/photo-1579965342575-15475c126358?w=400&h=500&fit=crop", // Placeholder
      currentBid: "2.43 ETH",
      timeLeft: "02:28:25", // From image (assuming same timer for example)
      // ... other necessary fields from ArtworkData
      year: "2024",
      medium: "Generative Art",
      dimensions: "2000x2000",
      estimatedValue: "2-3 ETH",
      bidCount: 8,
      category: "Digital",
      status: 'live',
      auctionHouse: "NFT Marketplace"
    }
  ];

  // Featured Artists Data (can be used for Top Sellers)
  const topSellers: FeaturedArtist[] = [ // Renamed and adapted
    {
      id: 1,
      name: "Esther Howard", // From image
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      // Assuming 'averagePrice' can represent BTC amount or similar metric
      averagePrice: "0.0000321 BTC", // From image
      // Other fields might not be directly applicable or need re-purposing
      nationality: "USA",
      birthYear: "1990",
      totalWorks: 127,
      topSale: "1 ETH",
      specialty: "Abstract Digital"
    },
    {
      id: 2,
      name: "Guy Hawkins", // From image
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      averagePrice: "0.0000520 BTC", // From image
      nationality: "Canada",
      birthYear: "1985",
      totalWorks: 89,
      topSale: "0.8 ETH",
      specialty: "Fantasy Art"
    },
    {
      id: 3,
      name: "Robert Fox", // From image
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      averagePrice: "0.0000319 BTC", // From image
      nationality: "UK",
      birthYear: "1992",
      totalWorks: 156,
      topSale: "1.2 ETH",
      specialty: "Pixel Art"
    },
  ];

  // Upcoming Auctions Data - can be adapted for "Live Auctions" if needed, or use featuredArtworks
  // const upcomingAuctions: AuctionEvent[] = [ ... ]; // Keep if there's a separate "Upcoming" section not shown in this image

  // Categories - may not be needed for the new layout, or could be used for filtering within sections
  // const categories = ['Live Auctions', 'Upcoming', 'Private Sales', 'Contemporary', 'Modern', 'Photography'];

  const toggleWatch = (artworkId: number) => {
    setWatchedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artworkId)) {
        newSet.delete(artworkId);
      } else {
        newSet.add(artworkId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.4 }
    }
  };
  
  // Placeholder for banner image - replace with actual image path or URL
  const bannerArtworkImage = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  return (
    <>
      {/* Wave Transition Effect */}
      <WaveTransition isTransitioning={darkMode.isTransitioning} isDark={darkMode.isDark} />
        <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-hidden gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
      >        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"></div>
        </div>

        {/* Top Bar: Search and User Info */}
        <motion.header
          className="flex flex-col sm:flex-row justify-between items-center mb-10 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="relative flex items-center backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl w-full sm:w-auto lg:w-[380px] mb-4 sm:mb-0 group transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50">
            <Search className="w-5 h-5 mr-3 transition-colors text-gray-500 group-focus-within:text-blue-500 dark:text-gray-400 dark:group-focus-within:text-amber-400" />
            <input
              type="text"
              placeholder="Search Artwork..."
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400 dark:text-gray-200 dark:placeholder-gray-500"
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-blue-400/10 to-cyan-500/10 dark:bg-gradient-to-r dark:from-amber-400/10 dark:to-orange-500/10"></div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <motion.div
              className="relative cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-white hover:border-gray-300/50 dark:hover:bg-gradient-to-r dark:hover:from-[#1A1A1A] dark:hover:to-[#1F1F1F] dark:hover:border-gray-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-6 h-6 transition-colors text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-amber-400" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">3</span>
            </motion.div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gradient-to-r from-amber-400 to-orange-500 shadow-lg"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Zack Foster</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Column (Banner & Trending) */}
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            {/* Sell & Buy NFT Banner */}            <motion.section 
              className="relative p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden backdrop-blur-lg transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/30 dark:bg-gradient-to-br dark:from-[#141414] dark:via-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/30"
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Enhanced decorative background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full blur-3xl animate-pulse bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 dark:bg-gradient-to-br dark:from-amber-400 dark:via-orange-500 dark:to-amber-600"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full blur-2xl animate-pulse bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 dark:bg-gradient-to-br dark:from-purple-400 dark:via-pink-500 dark:to-purple-600" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-0 w-24 h-24 rounded-full blur-xl animate-pulse bg-gradient-to-br from-green-400 to-emerald-500 dark:bg-gradient-to-br dark:from-blue-400 dark:to-cyan-500" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0 relative z-10">
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-white dark:via-gray-100 dark:to-gray-200 dark:bg-clip-text dark:text-transparent"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                >
                  Sell & Buy{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                      NFT
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-lg opacity-50 -z-10 rounded-lg"></div>
                  </span>
                  <br />
                  Digital Artworks
                </motion.h1>

                <motion.p 
                  className="text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed font-light max-w-lg mx-auto md:mx-0 text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Discover, create, and trade unique digital collectibles. Join the future of art and become part of the NFT revolution.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.button
                    className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-2xl hover:shadow-amber-500/25 group border border-amber-400/20"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Now
                      <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:rotate-45" />
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                  </motion.button>

                  <motion.button
                    className="relative bg-transparent font-semibold px-10 py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base backdrop-blur-sm group border-2 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 text-blue-600 border-blue-500/70 hover:border-blue-400 dark:hover:bg-gradient-to-r dark:hover:from-amber-500/20 dark:hover:to-orange-500/20 dark:text-amber-400 dark:border-amber-500/70 dark:hover:border-amber-400"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      Create NFT
                      <Palette className="w-4 h-4 ml-2 transition-transform group-hover:rotate-12" />
                    </span>
                  </motion.button>
                </motion.div>
              </div>

              <motion.div 
                className="md:w-2/5 flex justify-center md:justify-end items-center relative z-10"
                initial={{ opacity: 0, x: 60, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 100 }}
              >
                <div className="relative group">
                  <img 
                    src={bannerArtworkImage} 
                    alt="NFT Artwork" 
                    className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-1 border border-gray-700/30"
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 -z-10"></div>
                  {/* Floating elements around the image */}
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    💎 Featured
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🔥 Trending
                  </motion.div>
                </div>
              </motion.div>
            </motion.section>

            {/* Trending NFT Section */}
            <motion.section variants={itemVariants}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">🔥 Trending NFT</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Most popular digital artworks this week</p>
                </div>
                <motion.button 
                  className="text-sm font-semibold flex items-center px-4 py-2 rounded-xl transition-all border text-blue-600 hover:text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-500/50 dark:text-amber-500 dark:hover:text-amber-400 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:border-amber-500/30 dark:hover:border-amber-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View More <ArrowUpRight className="w-4 h-4 ml-2" />
                </motion.button>
              </div>

              <div className="flex overflow-x-auto space-x-6 pb-6 -mb-6 scrollbar-thin transition-colors scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-transparent">
                {featuredArtworks.slice(0, 2).map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    className="rounded-2xl p-5 shadow-xl w-72 flex-shrink-0 transition-all duration-300 backdrop-blur-sm group border bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-blue-500/30 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border-gray-800/50 dark:hover:border-amber-500/30"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="relative mb-4 overflow-hidden rounded-xl">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <motion.button
                        onClick={() => toggleWatch(artwork.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${watchedItems.has(artwork.id) ? 'bg-amber-500 text-black shadow-lg' : 'bg-black/40 text-white hover:bg-amber-500/80 hover:text-black'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                        {artwork.currentBid}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-bold truncate transition-colors text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-amber-400">{artwork.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={topSellers.find(s => s.name === artwork.artist)?.avatar || "https://via.placeholder.com/24"} alt={artwork.artist} className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"/>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{artwork.artist}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-600 dark:text-amber-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-medium">+12.5%</span>
                        </div>
                      </div>
                      <motion.button
                        className="w-full font-semibold py-2.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 dark:text-black"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Place Bid
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>

          {/* Right Column (Top Sellers & Live Auctions) */}
          <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
            {/* Top Sellers Section */}
            <motion.section 
              className="p-6 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-sm border bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-purple-500/30 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border-gray-800/50 dark:hover:border-purple-500/30"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">👑 Top Sellers</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Best performing creators</p>
                </div>
                <motion.button 
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center bg-purple-500/10 hover:bg-purple-500/20 px-3 py-2 rounded-xl transition-all border border-purple-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
              <div className="space-y-4">
                {topSellers.map((seller, index) => (
                  <motion.div
                    key={seller.id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-300 border border-transparent hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 hover:border-purple-500/20 dark:hover:bg-gradient-to-r dark:hover:from-purple-500/10 dark:hover:to-pink-500/10 dark:hover:border-purple-500/20"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" />
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{seller.name}</p>
                        <p className="text-xs flex items-center text-gray-600 dark:text-gray-400">
                          {seller.averagePrice} 
                          <span className="ml-2 text-green-400 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +5.3%
                          </span>
                        </p>
                      </div>
                    </div>
                    <motion.button 
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${index % 2 === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg' : 'border border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-purple-500'}`}
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                    >
                      {index % 2 === 0 ? 'Following' : 'Follow'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Live Auctions Section */}
            <motion.section variants={itemVariants}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">⚡ Live Auctions</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Active bidding now</p>
                </div>
                <motion.button 
                  className="text-pink-400 hover:text-pink-300 text-sm font-semibold flex items-center bg-pink-500/10 hover:bg-pink-500/20 px-3 py-2 rounded-xl transition-all border border-pink-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  EXPLORE <ArrowUpRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
              <div className="space-y-5">
                {featuredArtworks.slice(2, 4).map((auction, index) => (
                  <motion.div
                    key={auction.id}
                    className="rounded-2xl p-4 shadow-xl flex items-center space-x-4 transition-all duration-300 group backdrop-blur-sm border bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-pink-500/30 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border-gray-800/50 dark:hover:border-pink-500/30"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                  >
                    <div className="relative">
                      <img src={auction.image} alt={auction.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105 border border-gray-300/50 dark:border-gray-700/50" />
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        🔴
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-bold truncate mb-2 transition-colors text-gray-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">{auction.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Highest: <span className="text-pink-400 font-semibold">{auction.currentBid}</span>
                        </p>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3" />
                          <span className="text-xs">{auction.bidCount}</span>
                        </div>
                      </div>
                      <motion.button 
                        className="text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-lg w-full transition-all font-semibold shadow-lg hover:shadow-pink-500/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        🔥 Place Bid
                      </motion.button>
                    </div>
                    <div className="flex-shrink-0 text-center">
                      <motion.button
                        onClick={() => toggleWatch(auction.id)}
                        className={`p-2 rounded-full mb-3 transition-all duration-300 ${
                          watchedItems.has(auction.id) 
                            ? 'bg-pink-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-600 hover:bg-pink-500/80 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-pink-500/80 dark:hover:text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <div className="text-xs px-2 py-1.5 rounded-lg border transition-all duration-300 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300/50 dark:text-gray-400 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-gray-600/50">
                        <div className="flex flex-col items-center space-y-1">
                          <Clock className="w-3 h-3 text-pink-400" />
                          <div className="font-mono">
                            {auction.timeLeft.split(':').map((t, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span className="text-gray-400 dark:text-gray-600">:</span>}
                                <span className="font-semibold text-gray-800 dark:text-white">{t}</span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default HomeSection;