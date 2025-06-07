import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, ArrowUpRight } from 'lucide-react';

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

interface TrendingNFTProps {
  featuredArtworks: ArtworkData[];
  watchedItems: Set<number>;
  toggleWatch: (id: number) => void;
  topSellers: FeaturedArtist[];
}

const TrendingNFT: React.FC<TrendingNFTProps> = ({
  featuredArtworks,
  watchedItems,
  toggleWatch,
  topSellers,
}) => {
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
    <motion.section variants={itemVariants}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            🔥 Trending NFT
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Most popular digital artworks this week
          </p>
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
        {featuredArtworks.map((artwork, index) => (
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
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <motion.button
                onClick={() => toggleWatch(artwork.id)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  watchedItems.has(artwork.id)
                    ? "bg-amber-500 text-black shadow-lg"
                    : "bg-black/40 text-white hover:bg-amber-500/80 hover:text-black"
                }`}
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
              <h3 className="text-lg font-bold truncate transition-colors text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-amber-400">
                {artwork.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      topSellers.find((s) => s.name === artwork.artist)
                        ?.avatar || "https://via.placeholder.com/24"
                    }
                    alt={artwork.artist}
                    className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                    loading="lazy"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {artwork.artist}
                  </span>
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
  );
};

export default TrendingNFT; 