import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Tag, Folder, Filter } from 'lucide-react';

interface FilterHelpProps {
  className?: string;
}

export const FilterHelp: React.FC<FilterHelpProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Help Button */}
      <motion.button
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-amber-500 transition-colors rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Filtering Help"
        title="Learn how filtering works"
      >
        <Info size={18} />
      </motion.button>

      {/* Help Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter size={16} />
                How Filtering Works
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 text-sm text-gray-600 dark:text-gray-300 space-y-4 max-h-80 overflow-y-auto">
              <p>
                The Gallery filters content from two sources:
              </p>
              
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-md mt-0.5">
                  <Folder size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Products</p>
                  <p className="text-xs mt-1">Physical items filtered by category. Most products are in the "Painting" category.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-md mt-0.5">
                  <Tag size={14} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Digital NFTs</p>
                  <p className="text-xs mt-1">Digital art filtered primarily by tags. Common tags include: art, digital, abstract, nature, neon, color.</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md mt-2">
                <p className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">Filter Categories:</p>
                <ul className="space-y-2 text-xs">
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-700 dark:text-blue-300 text-[10px]">CATEGORY</span>
                    <span>Filters by product category</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-700 dark:text-amber-300 text-[10px]">TAG</span>
                    <span>Filters by NFT tags</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-700 dark:text-purple-300 text-[10px]">BOTH</span>
                    <span>Filters both products and NFTs</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-xs italic">Hover over any category filter to see more details about what content it shows.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};