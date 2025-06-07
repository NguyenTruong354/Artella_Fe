import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';
import { TrendingUp, Search, Filter, Bell } from 'lucide-react';
import { DarkModeToggle } from '../DarkModeToggle';

interface AuctionHeaderProps {
  showFilters: boolean; // Keeping this for API consistency even though not directly used
  onToggleFilters: () => void;
  itemVariants: Variants;
  controls: AnimationControls;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  // showFilters is removed since it's unused
  onToggleFilters,
  itemVariants,
  controls
}) => {
  return (
    <motion.header
      className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Magazine Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                AUCTION TODAY
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                DIGITAL ART MAGAZINE • LIVE EDITION
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <motion.button
              className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onToggleFilters}
              whileHover={{ scale: 1.05 }}
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </motion.button>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AuctionHeader;
