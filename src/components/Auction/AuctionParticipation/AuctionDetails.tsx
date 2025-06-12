import React from "react";
import { motion } from "framer-motion";
import { Users, Eye, TrendingUp } from "lucide-react";
import { BidHistory } from "../../../types/auction";

interface AuctionDetailsProps {
  currentBid: string;
  currentBidValue: number;
  bidCount: number;
  watchers: number;
  bidHistory: BidHistory[];
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({
  currentBid,
  bidCount,
  watchers,
  bidHistory
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
      },
    },
  };

  return (
    <>
      {/* Current Bid Display */}
      <motion.div
        className="absolute right-8 top-1/4 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-gold-500/50 rounded-xl p-6 min-w-[280px] shadow-2xl"
        variants={itemVariants}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <p className="text-gold-400 text-sm mb-1 uppercase tracking-wider">
            Current Bid
          </p>
          <motion.p
            className="text-4xl font-bold text-white mb-2 font-mono"
            key={currentBid}
            initial={{ scale: 1.2, color: "#ffd700" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.5 }}
          >
            {currentBid}
          </motion.p>
          <div className="flex items-center justify-center space-x-4 text-gray-300 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{bidCount} bids</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{watchers} watching</span>
            </div>
          </div>

          {/* Bid Progress Indicator */}
          <div className="mt-4 pt-4 border-t border-gold-500/30">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Reserve</span>
              <span>Estimate</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full transition-all duration-500"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bidding Record - Chat-like display */}
      <motion.div
        className="absolute right-8 top-2/3 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-gold-500/50 rounded-xl p-4 min-w-[280px] max-w-[320px] shadow-2xl"
        variants={itemVariants}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="font-semibold text-gold-400 mb-3 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          BIDDING RECORD
        </h3>

        {/* Chat-like scrollable area */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {bidHistory.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start space-x-2 p-2 rounded-lg text-xs ${
                bid.isWinning
                  ? "bg-gradient-to-r from-gold-500/20 to-yellow-500/20 border border-gold-500/30"
                  : bid.bidder === "You"
                  ? "bg-pink-500/20 border border-pink-500/30"
                  : "bg-gray-800/50"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  bid.bidder === "You"
                    ? "bg-pink-500 text-white"
                    : bid.isWinning
                    ? "bg-gold-500 text-black"
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {bid.bidder === "You" ? "Y" : bid.bidder.charAt(0)}
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-semibold text-xs truncate ${
                      bid.bidder === "You"
                        ? "text-pink-400"
                        : bid.isWinning
                        ? "text-gold-400"
                        : "text-white"
                    }`}
                  >
                    {bid.bidder}
                    {bid.isWinning && (
                      <span className="ml-1 text-gold-400">👑</span>
                    )}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {bid.timestamp}
                  </span>
                </div>
                <p className="font-bold text-white text-sm">{bid.amount}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <div className="mt-3 pt-2 border-t border-gray-700/50 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Bidding</span>
          </div>
        </div>
      </motion.div>

      {/* Live Badge */}
      <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        <span>LIVE AUCTION</span>
      </div>
    </>
  );
};

export default AuctionDetails;
