import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import { AuctionData } from './index'; // Import AuctionData

interface FeaturedAuctionHeroProps {
  featuredAuction: AuctionData;
  getStoryTypeColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  itemVariants: Variants; // Updated type
  controls: AnimationControls; // Updated type
}

const FeaturedAuctionHero: React.FC<FeaturedAuctionHeroProps> = ({
  featuredAuction: auction,
  getStoryTypeColor,
  getStatusColor,
  itemVariants,
  controls
}) => {
  return (
    <motion.section
      className="relative z-10"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Featured Image */}
          <div className="relative h-96 lg:h-full overflow-hidden">
            <img
              src={auction.image}
              alt={auction.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                FEATURED AUCTION
              </span>
              <span
                className={`${getStoryTypeColor(auction.storyType)} text-white px-3 py-1 rounded-full text-xs font-medium`}
              >
                {auction.storyType}
              </span>
            </div>
            
            {/* Reading Progress */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-white text-xs mt-2 font-medium">
                75% of auction time remaining
              </p>
            </div>
          </div>

          {/* Featured Content */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-500 dark:text-amber-400 text-sm font-bold tracking-wide">
                  EDITOR'S CHOICE
                </span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {auction.readingTime}
                </div>
              </div>
              <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-gray-100">
                {auction.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {auction.storyPreview}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {auction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Current Bid
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {auction.currentBid}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Time Remaining
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {auction.timeLeft}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span
                className={`${getStatusColor(auction.status)} text-white px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center`}
              >
                <Target className="w-4 h-4 mr-2" />
                {auction.status}
              </span>
            </div>

            <motion.button
              className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              READ FULL STORY & BID
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedAuctionHero;
