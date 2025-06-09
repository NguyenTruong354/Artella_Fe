import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bidder } from "../../../types/auction";

interface BiddersListProps {
  bidders: Bidder[];
  activeBidder: number | null;
}

const BiddersList: React.FC<BiddersListProps> = ({ bidders, activeBidder }) => {
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
    <motion.div className="lg:col-span-2" variants={itemVariants}>
      <h3 className="text-xl font-bold text-gold-400 mb-20 text-center">
        AUCTION THEATER
      </h3>

      {/* Theater Rows */}
      <div className="space-y-4">
        {[1, 2, 3].map((row) => (
          <motion.div
            key={row}
            className="flex justify-center"
            style={{
              transform: `perspective(1000px) rotateX(${3 * row}deg)`,
              marginBottom: row === 1 ? "2rem" : "1rem",
            }}
          >
            {/* Row Label */}
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 w-12">
                {row === 1 ? "VIP" : `Row ${row}`}
              </span>

              {/* Seats in Row */}
              <div className="flex space-x-3">
                {bidders
                  .filter((bidder) => bidder.row === row)
                  .map((bidder) => (
                    <motion.div
                      key={bidder.id}
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      animate={
                        activeBidder === bidder.id
                          ? {
                              scale: [1, 1.3, 1.2],
                              y: [0, -10, -8],
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {/* Seat */}
                      <div
                        className={`w-12 h-8 rounded-t-lg transition-all ${
                          bidder.isVIP
                            ? "bg-gradient-to-t from-red-800 to-red-600 border border-gold-500/50"
                            : "bg-gradient-to-t from-gray-700 to-gray-600 border border-gray-500/50"
                        }`}
                      />

                      {/* Avatar */}
                      <motion.div
                        className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${
                          bidder.isActive || activeBidder === bidder.id
                            ? "border-gold-400 shadow-lg shadow-gold-400/50"
                            : bidder.isVIP
                            ? "border-red-400"
                            : "border-gray-400"
                        }`}
                        animate={
                          activeBidder === bidder.id
                            ? {
                                boxShadow: [
                                  "0 0 0 0 rgba(255, 215, 0, 0.7)",
                                  "0 0 0 10px rgba(255, 215, 0, 0)",
                                  "0 0 0 0 rgba(255, 215, 0, 0)",
                                ],
                              }
                            : {}
                        }
                        transition={{
                          duration: 1,
                          repeat:
                            activeBidder === bidder.id ? Infinity : 0,
                        }}
                      >
                        <img
                          src={bidder.avatar}
                          alt={bidder.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Activity Indicator */}
                        {(bidder.isActive ||
                          activeBidder === bidder.id) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
                        )}
                      </motion.div>

                      {/* Bidding Paddle */}
                      <AnimatePresence>
                        {bidder.isShowingPaddle && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, rotate: -45 }}
                            animate={{
                              opacity: 1,
                              y: -25,
                              rotate: [0, 10, -5, 0],
                              scale: [0.8, 1.1, 1],
                            }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{
                              duration: 0.6,
                              rotate: {
                                duration: 0.8,
                                repeat: 2,
                              },
                            }}
                            className="absolute -right-6 -top-6 z-20"
                          >
                            {/* Paddle Handle */}
                            <div className="w-1 h-8 bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-full border border-yellow-500 shadow-lg" />

                            {/* Paddle Sign */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-gradient-to-br from-white to-gray-100 rounded-lg border-2 border-gray-800 shadow-2xl flex items-center justify-center">
                              <span className="text-black font-bold text-sm">
                                {bidder.paddleNumber}
                              </span>

                              {/* Paddle Border Detail */}
                              <div className="absolute inset-1 border border-gray-300 rounded"></div>
                            </div>

                            {/* Paddle Shadow */}
                            <div className="absolute top-0 left-2 w-12 h-10 bg-black/20 rounded-lg blur-sm transform rotate-3"></div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Crowd Reactions */}
                      <AnimatePresence>
                        {bidder.reactionType !== "none" && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: [0, -5, 0],
                            }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{
                              duration: 0.5,
                              y: {
                                duration: 0.6,
                                repeat:
                                  bidder.reactionType === "clapping"
                                    ? 3
                                    : 1,
                                repeatType: "reverse",
                              },
                            }}
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10"
                          >
                            {/* Reaction Emojis */}
                            {bidder.reactionType === "clapping" && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                  duration: 0.4,
                                  repeat: 3,
                                  repeatType: "reverse",
                                }}
                                className="text-xl"
                              >
                                👏
                              </motion.div>
                            )}

                            {bidder.reactionType === "excited" && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.3, 1],
                                  y: [0, -3, 0],
                                }}
                                transition={{
                                  duration: 0.5,
                                  repeat: 2,
                                  repeatType: "reverse",
                                }}
                                className="text-xl"
                              >
                                🎉
                              </motion.div>
                            )}

                            {bidder.reactionType === "disappointed" && (
                              <motion.div
                                animate={{
                                  scale: [1, 0.9, 1],
                                  opacity: [1, 0.7, 1],
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: 1,
                                }}
                                className="text-xl"
                              >
                                😔
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Bidder Info Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        <p className="font-semibold">{bidder.name}</p>
                        {bidder.currentBid > 0 && (
                          <p className="text-gold-400">
                            ${bidder.currentBid.toLocaleString()}
                          </p>
                        )}
                        <p className="text-gray-400">
                          {bidder.totalBids} bids
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Theater Floor Pattern */}
      <div className="mt-10 text-center">
        <div className="inline-block w-64 h-2 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent rounded" />
        <p className="text-xs text-gray-500 mt-2">AUCTION FLOOR</p>
      </div>
    </motion.div>
  );
};

export default BiddersList;
