import React from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { Eye, Users } from 'lucide-react';
import { AuctionData } from './index';

interface MostWatchedProps {
  auctions: AuctionData[];
  itemVariants: Variants;
  controls: AnimationControls;
}

const MostWatched: React.FC<MostWatchedProps> = ({
  auctions,
  itemVariants,
  controls
}) => {
  return (
    <motion.aside
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
          <Eye className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Most Watched
        </h3>
      </div>
      <div className="space-y-3">
        {auctions.slice(0, 3).map((auction) => (
          <motion.div
            key={`watched-${auction.id}`}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={auction.image}
              alt={auction.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                {auction.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {auction.currentBid}
              </p>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Users className="w-3 h-3 mr-1" />
              {auction.bidders}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default MostWatched;
