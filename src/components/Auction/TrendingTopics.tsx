import React from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface TrendingTopicsProps {
  itemVariants: Variants;
  controls: AnimationControls;
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  itemVariants,
  controls
}) => {
  const trendingItems = [
    { topic: "AI-Generated Art Surge", change: "+127%" },
    { topic: "Metaverse Galleries", change: "+89%" },
    { topic: "Sustainable NFTs", change: "+156%" },
    { topic: "Celebrity Collections", change: "+67%" },
  ];

  return (
    <motion.aside
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-full flex items-center justify-center mr-3">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Trending Now
        </h3>
      </div>
      <div className="space-y-3">
        {trendingItems.map((item, index) => (
          <motion.div
            key={item.topic}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center">
              <span className="w-6 h-6 bg-red-100 dark:bg-amber-100 text-red-600 dark:text-amber-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.topic}
              </span>
            </div>
            <span className="text-xs text-green-500 font-bold">
              {item.change}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default TrendingTopics;
