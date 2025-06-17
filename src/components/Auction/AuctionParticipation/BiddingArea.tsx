import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, CheckCircle } from "lucide-react";

interface BiddingAreaProps {
  bidAmount: string;
  setBidAmount: React.Dispatch<React.SetStateAction<string>>;
  handlePlaceBid: () => void;
  isPlacingBid: boolean;
  bidSuccess: boolean;
  minimumBid: number;
  handleQuickBid: (amount: number) => void;
  timeLeft: number;
}

const BiddingArea: React.FC<BiddingAreaProps> = ({
  bidAmount,
  setBidAmount,
  handlePlaceBid,
  isPlacingBid,
  bidSuccess,
  minimumBid,
  handleQuickBid,
  timeLeft,
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
      <motion.div className="space-y-6" variants={itemVariants}>
        {/* Auctioneer Podium Style */}
        <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-2xl border border-gold-400/50">
          {" "}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-black mb-2">
              PLACE YOUR BID
            </h3>
            <p className="text-xs text-black/70">
              Minimum: {(minimumBid / 1000).toFixed(2)} ETH
            </p>
          </div>{" "}
          {/* Quick Bid Buttons */}{" "}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[0.5, 1.0, 3.0].map((increment) => (
              <motion.button
                key={increment}
                onClick={() => handleQuickBid(increment * 1000)}
                className="p-3 bg-black/20 hover:bg-black/40 text-black rounded-xl transition-all text-sm font-bold border border-black/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                +{increment} ETH
              </motion.button>
            ))}
          </div>
          {/* Custom Bid Input */}
          <div className="space-y-3">
            {" "}
            <input
              type="text"
              value={bidAmount}
              onChange={(e) => {
                // Format input to ensure proper ETH display
                const inputValue = e.target.value.replace(/[^\d.]/g, "");
                const numericValue = parseFloat(inputValue);

                if (isNaN(numericValue)) {
                  setBidAmount("");
                } else if (inputValue.endsWith(".")) {
                  // If user is typing a decimal, keep it as is
                  setBidAmount(inputValue);
                } else {
                  // Format with ETH suffix
                  setBidAmount(`${numericValue.toString()} ETH`);
                }
              }}
              placeholder={`${(minimumBid / 1000).toFixed(2)} ETH`}
              className="w-full px-4 py-3 bg-black/20 border border-black/30 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-black/50 font-bold text-center text-lg"
            />
            <motion.button
              onClick={handlePlaceBid}
              disabled={!bidAmount || isPlacingBid || timeLeft <= 0}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: isPlacingBid ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPlacingBid ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>BIDDING...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-5 h-5" />
                  <span>BID NOW</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {bidSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-green-400/50"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Bid Placed Successfully!</p>
              <p className="text-sm text-green-100">
                You are now the highest bidder
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BiddingArea;
