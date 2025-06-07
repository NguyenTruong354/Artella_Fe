import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Palette } from 'lucide-react';

const BannerSection: React.FC = () => {
  const bannerArtworkImage = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

  return (
    <motion.section
      className="relative p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden backdrop-blur-lg transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/30 dark:bg-gradient-to-br dark:from-[#141414] dark:via-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/30"
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full blur-3xl animate-pulse bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 dark:bg-gradient-to-br dark:from-amber-400 dark:via-orange-500 dark:to-amber-600"></div>
        <div
          className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full blur-2xl animate-pulse bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 dark:bg-gradient-to-br dark:from-purple-400 dark:via-pink-500 dark:to-purple-600"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-24 h-24 rounded-full blur-xl animate-pulse bg-gradient-to-br from-green-400 to-emerald-500 dark:bg-gradient-to-br dark:from-blue-400 dark:to-cyan-500"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="md:w-3/5 text-center md:text-left mb-8 md:mb-0 relative z-10">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-white dark:via-gray-100 dark:to-gray-200 dark:bg-clip-text dark:text-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Sell & Buy{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              NFT
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-lg opacity-50 -z-10 rounded-lg"></div>
          </span>
          <br />
          Digital Artworks
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed font-light max-w-lg mx-auto md:mx-0 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Discover, create, and trade unique digital collectibles. Join
          the future of art and become part of the NFT revolution.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.button
            className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base shadow-2xl hover:shadow-amber-500/25 group border border-amber-400/20"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center">
              Explore Now
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:rotate-45" />
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
          </motion.button>

          <motion.button
            className="relative bg-transparent font-semibold px-10 py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base backdrop-blur-sm group border-2 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 text-blue-600 border-blue-500/70 hover:border-blue-400 dark:hover:bg-gradient-to-r dark:hover:from-amber-500/20 dark:hover:to-orange-500/20 dark:text-amber-400 dark:border-amber-500/70 dark:hover:border-amber-400"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              Create NFT
              <Palette className="w-4 h-4 ml-2 transition-transform group-hover:rotate-12" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="md:w-2/5 flex justify-center md:justify-end items-center relative z-10"
        initial={{ opacity: 0, x: 60, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          delay: 0.4,
          duration: 1,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="relative group">
          <img
            src={bannerArtworkImage}
            alt="NFT Artwork"
            className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-105 hover:rotate-1 border border-gray-700/30"
            loading="lazy"
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 -z-10"></div>
          
          <motion.div
            className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💎 Featured
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🔥 Trending
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default BannerSection; 