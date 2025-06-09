import React from "react";
import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuctionEndOverlayProps {
  show: boolean;
}

const AuctionEndOverlay: React.FC<AuctionEndOverlayProps> = ({ show }) => {
  const navigate = useNavigate();

  return (
    show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-800 to-black rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border border-gold-500/50"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gavel className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-gold-400 mb-2">
            AUCTION CONCLUDED
          </h2>
          <p className="text-gray-300 mb-6">
            The bidding has ended. Results will be announced shortly.
          </p>
          <motion.button
            onClick={() => navigate("/Home/auctions")}
            className="w-full bg-gradient-to-r from-gold-500 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-gold-600 hover:to-yellow-600 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Return to Auction House
          </motion.button>
        </motion.div>
      </motion.div>
    )
  );
};

export default AuctionEndOverlay;
