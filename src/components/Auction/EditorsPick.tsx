import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';
import { Award } from 'lucide-react';
import { AuctionData } from './index'; // Import AuctionData

interface EditorsPickProps {
  auctions: AuctionData[];
  itemVariants: Variants; // Updated type
  controls: AnimationControls; // Updated type
}

const EditorsPick: React.FC<EditorsPickProps> = ({
  auctions,
  itemVariants,
  controls
}) => {
  return (
    <motion.aside
      className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl rounded-xl p-6 border border-purple-200/50 dark:border-indigo-200/20"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          Editor's Pick
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Curated selections from our art experts
        </p>
        <div className="grid grid-cols-3 gap-2">
          {auctions.slice(0, 3).map((auction, index) => (
            <motion.div
              key={`editor-mini-${auction.id}`}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full aspect-square rounded-lg object-cover"
              />
              <div className="absolute -top-1 -right-1 bg-purple-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default EditorsPick;
