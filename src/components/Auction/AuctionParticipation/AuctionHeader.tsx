import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";

interface AuctionHeaderProps {
  id: number;
  auctionHouse: string;
  timeLeft: number;
  isWatched: boolean;
  onNavigateBack: () => void;
  onToggleWatch: () => void;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  id,
  auctionHouse,
  timeLeft,
  isWatched,
  onNavigateBack,
  onToggleWatch,
}) => {
  // Format time function
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gold-500/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onNavigateBack}
              className="p-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gold-400" />
            </motion.button>
            <div>
              <h1 className="text-lg font-bold text-gold-400">AUCTION HOUSE</h1>
              <p className="text-sm text-gray-400">
                Lot #{id} • {auctionHouse}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xl font-bold text-red-400 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-400">Time Remaining</div>
            </div>
            <motion.button
              onClick={onToggleWatch}
              className={`p-3 rounded-xl transition-all border ${
                isWatched
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25 border-pink-500"
                  : "bg-gray-800 text-gray-400 border-gray-600 hover:border-pink-500/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionHeader;
