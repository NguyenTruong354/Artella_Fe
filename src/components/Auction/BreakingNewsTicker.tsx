import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';

interface BreakingNewsTickerProps {
  itemVariants: Variants;
  controls: AnimationControls;
}

const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  itemVariants,
  controls
}) => {
  const newsItems = [
    '🔥 "Cosmic Dreams" reaches 12.5 ETH - New record!',
    '⚡ 5 new auctions starting in 30 minutes',
    '🏆 "Digital Renaissance" collection sold for 45 ETH',
    '📈 NFT market up 127% this week'
  ];

  return (
    <motion.div
      className="relative z-10 bg-red-500 dark:bg-amber-500 text-white overflow-hidden"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center py-2 px-4">
        <span className="bg-white text-red-500 dark:text-amber-500 px-3 py-1 rounded text-xs font-bold mr-4 whitespace-nowrap">
          BREAKING
        </span>
        <motion.div
          className="flex items-center space-x-8 whitespace-nowrap"
          animate={{ x: [-1000, 1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {newsItems.map((item, index) => (
            <span key={index} className="text-sm font-medium">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BreakingNewsTicker;
