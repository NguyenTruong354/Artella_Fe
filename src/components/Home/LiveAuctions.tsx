import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Clock, ArrowUpRight } from 'lucide-react';

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

interface LiveAuctionsProps {
  auctions: ArtworkData[];
  watchedItems: Set<number>;
  toggleWatch: (id: number) => void;
}

const LiveAuctions: React.FC<LiveAuctionsProps> = ({
  auctions,
  watchedItems,
  toggleWatch,
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            ⚡ Live Auctions
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Active bidding now
          </p>
        </div>
        <motion.button
          className="text-pink-400 hover:text-pink-300 text-sm font-semibold flex items-center bg-pink-500/10 hover:bg-pink-500/20 px-3 py-2 rounded-xl transition-all border border-pink-500/30"
          whileHover={{ scale: 1.05 }}
        >
          EXPLORE <ArrowUpRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
      <div className="space-y-5">
        {auctions.map((auction, index) => (
          <motion.div
            key={auction.id}
            className="rounded-2xl p-5 shadow-xl flex items-center space-x-5 transition-all duration-300 group backdrop-blur-sm border bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-pink-500/30 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border-gray-800/50 dark:hover:border-pink-500/30"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-24 h-24 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 border border-gray-300/50 dark:border-gray-700/50"
                loading="lazy"
              />
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                🔴
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold truncate transition-colors text-gray-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400">
                  {auction.title}
                </h3>
                <motion.button
                  onClick={() => toggleWatch(auction.id)}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    watchedItems.has(auction.id)
                      ? "bg-pink-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600 hover:bg-pink-500/80 hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-pink-500/80 dark:hover:text-white"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  By <span className="font-medium">{auction.artist}</span>
                </p>
                <span className="text-gray-400">•</span>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {auction.category}
                </p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Highest Bid
                  </p>
                  <p className="text-sm font-semibold text-pink-500">
                    {auction.currentBid}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {auction.bidCount} bids
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  className="flex-1 text-xs bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2.5 rounded-lg transition-all font-semibold shadow-lg hover:shadow-pink-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔥 Place Bid
                </motion.button>
                <div className="text-xs px-3 py-2.5 rounded-lg border transition-all duration-300 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300/50 dark:text-gray-400 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-gray-600/50">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-pink-400" />
                    <div className="font-mono">
                      {auction.timeLeft.split(":").map((t, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            <span className="text-gray-400 dark:text-gray-600">
                              :
                            </span>
                          )}
                          <span className="font-semibold text-gray-800 dark:text-white">
                            {t}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default LiveAuctions; 