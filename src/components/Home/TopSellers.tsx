import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

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

interface TopSellersProps {
  topSellers: FeaturedArtist[];
}

const TopSellers: React.FC<TopSellersProps> = ({ topSellers }) => {
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
    <motion.section
      className="p-6 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-sm border bg-gradient-to-br from-white to-gray-50 border-gray-200/50 hover:border-purple-500/30 dark:bg-gradient-to-br dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border-gray-800/50 dark:hover:border-purple-500/30"
      variants={itemVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            👑 Top Sellers
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Best performing creators
          </p>
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
            className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 hover:border-purple-500/20 dark:hover:bg-gradient-to-r dark:hover:from-purple-500/10 dark:hover:to-pink-500/10 dark:hover:border-purple-500/20"
            variants={itemVariants}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500/50"
                  loading="lazy"
                />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {seller.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {seller.averagePrice}
                  </p>
                  <span className="text-green-400 flex items-center text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5.3%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {seller.specialty}
                </p>
              </div>
            </div>
            <motion.button
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 flex-shrink-0 ml-4"
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 1 }}
            >
              Follow
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TopSellers; 