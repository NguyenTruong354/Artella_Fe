import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';
import { Eye, Clock, BookOpen, Users, TrendingUp } from 'lucide-react';
import { AuctionData } from './index';

interface AuctionGridProps {
  auctions: AuctionData[];
  watchedItems: Set<number>;
  onToggleWatch: (auctionId: number) => void;
  getStoryTypeColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  itemVariants: Variants;
  containerVariants: Variants;
  controls: AnimationControls;
}

const AuctionGrid: React.FC<AuctionGridProps> = ({
  auctions,
  watchedItems,
  onToggleWatch,
  getStoryTypeColor,
  getStatusColor,
  itemVariants,
  containerVariants,
  controls
}) => {
  return (
    <motion.main
      className="relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auctions.slice(1).map((auction) => (
          <motion.article
            key={auction.id}
            className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            layout
          >
            {/* Article Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Story Labels */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                  {auction.category}
                </span>
                <span
                  className={`${getStoryTypeColor(auction.storyType)} text-white px-2 py-1 rounded text-xs font-bold`}
                >
                  {auction.storyType}
                </span>
                {auction.isHot && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    HOT
                  </span>
                )}
              </div>

              {/* Watch Button */}
              <motion.button
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  watchedItems.has(auction.id)
                    ? "bg-red-500/90 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                onClick={() => onToggleWatch(auction.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-4 h-4" />
              </motion.button>

              {/* Status & Time Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span
                  className={`${getStatusColor(auction.status)} text-white px-2 py-1 rounded text-xs font-bold`}
                >
                  {auction.status}
                </span>
                <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                  {auction.timeLeft} left
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-5">
              {/* Headline with Typography Hierarchy */}
              <div className="mb-3">
                <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                  {auction.title}:{" "}
                  {auction.storyType === "Bidding Wars"
                    ? "Intense Battle Erupts"
                    : auction.storyType === "Market Analysis"
                    ? "Market Disruption Ahead"
                    : auction.storyType === "Artist Spotlight"
                    ? "Rising Star Emerges"
                    : "Trend Analysis"}
                </h3>
              </div>

              {/* Byline with Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div>
                  By{" "}
                  <span className="font-semibold">
                    {auction.artist}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {auction.readingTime}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {auction.location}
                  </span>
                </div>
              </div>

              {/* Story Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {auction.storyPreview}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {auction.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {auction.bidders} bidders
                </span>
                <span className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {auction.totalBids} bids
                </span>
                <span>
                  {Math.floor(Math.random() * 500) + 100} views
                </span>
                <span className="text-gray-400">
                  {auction.lastUpdate}
                </span>
              </div>

              {/* Current Bid & Action */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current Bid
                  </p>
                  <p className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {auction.currentBid}
                  </p>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read & Bid
                </motion.button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Load More Stories */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Load More Stories
        </motion.button>
      </motion.div>
    </motion.main>
  );
};

export default AuctionGrid;
