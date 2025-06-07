import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Bell,
  Search,
} from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";
import { WaveTransition } from "../WaveTransition";
import { DarkModeToggle } from "../DarkModeToggle";

// Direct imports instead of lazy loading
import BannerSection from './BannerSection';
import TrendingNFT from './TrendingNFT';
import TopSellers from './TopSellers';
import LiveAuctions from './LiveAuctions';

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
  status: "live" | "upcoming" | "sold";
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

  // Featured Artworks Data
  const featuredArtworks: ArtworkData[] = [
    {
      id: 1,
      title: "Full Abstract",
      artist: "Esther Howard",
      year: "2023",
      medium: "Digital Art",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop",
      currentBid: "3.40 ETH",
      estimatedValue: "€50,000 - €70,000",
      timeLeft: "02:28:25",
      bidCount: 23,
      category: "Digital",
      status: "live",
      auctionHouse: "Artella Digital",
    },
    {
      id: 2,
      title: "The Fantasy Flower",
      artist: "Esther Howard",
      year: "2022",
      medium: "3D Render",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=500&fit=crop",
      currentBid: "2.50 ETH",
      estimatedValue: "€40,000 - €55,000",
      timeLeft: "01:15:10",
      bidCount: 18,
      category: "Digital",
      status: "live",
      auctionHouse: "Artella Digital",
    },
    {
      id: 3,
      title: "Colorful Abstract",
      artist: "@johndoe",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
      currentBid: "3.40 ETH",
      timeLeft: "02:28:25",
      year: "2024",
      medium: "Digital Painting",
      dimensions: "1920x1080",
      estimatedValue: "3-4 ETH",
      bidCount: 12,
      category: "Digital",
      status: "live",
      auctionHouse: "NFT Marketplace",
    },
    {
      id: 4,
      title: "Modern Art Collection",
      artist: "@janedoe",
      image: "https://images.unsplash.com/photo-1579965342575-15475c126358?w=400&h=500&fit=crop",
      currentBid: "2.43 ETH",
      timeLeft: "02:28:25",
      year: "2024",
      medium: "Generative Art",
      dimensions: "2000x2000",
      estimatedValue: "2-3 ETH",
      bidCount: 8,
      category: "Digital",
      status: "live",
      auctionHouse: "NFT Marketplace",
    },
  ];

  // Featured Artists Data
  const topSellers: FeaturedArtist[] = [
    {
      id: 1,
      name: "Esther Howard",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      averagePrice: "0.0000321 BTC",
      nationality: "USA",
      birthYear: "1990",
      totalWorks: 127,
      topSale: "1 ETH",
      specialty: "Abstract Digital",
    },
    {
      id: 2,
      name: "Guy Hawkins",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      averagePrice: "0.0000520 BTC",
      nationality: "Canada",
      birthYear: "1985",
      totalWorks: 89,
      topSale: "0.8 ETH",
      specialty: "Fantasy Art",
    },
    {
      id: 3,
      name: "Robert Fox",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      averagePrice: "0.0000319 BTC",
      nationality: "UK",
      birthYear: "1992",
      totalWorks: 156,
      topSale: "1.2 ETH",
      specialty: "Pixel Art",
    },
  ];

  const toggleWatch = (artworkId: number) => {
    setWatchedItems((prev) => {
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
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
      },
    },
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
      >
        {/* Background decoration */}
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
          <div className="relative flex items-center backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl w-full sm:w-auto lg:w-[380px] mb-4 sm:mb-0 group transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50 sm:ml-auto sm:mr-4">
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
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                3
              </span>
            </motion.div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            <div className="flex items-center space-x-3 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-gradient-to-r from-amber-400 to-orange-500 shadow-lg"
                loading="lazy"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Zack Foster
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Premium Member
                </p>
              </div>
            </div>
          </div>
        </motion.header>
        {/* Main Content Area */}
        <motion.main
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {" "}
          {/* Left Column (Banner & Trending) */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={itemVariants}
          >
            <div className="rounded-xl p-4">
              <BannerSection />
            </div>
            
            <div className="rounded-xl p-4">
              <TrendingNFT 
                featuredArtworks={featuredArtworks.slice(0, 2)}
                watchedItems={watchedItems}
                toggleWatch={toggleWatch}
                topSellers={topSellers}
              />
            </div>
          </motion.div>
          {/* Right Column (Top Sellers & Live Auctions) */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            variants={itemVariants}
          >
            <div className="rounded-xl p-4">
              <TopSellers topSellers={topSellers} />
            </div>

            <div className="rounded-xl p-4">
              <LiveAuctions 
                auctions={featuredArtworks.slice(2, 4)}
                watchedItems={watchedItems}
                toggleWatch={toggleWatch}
              />
            </div>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default HomeSection;