import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info } from "lucide-react";

// Define category information including what type of filtering they use
const categoryInfo: Record<string, { label: string; description: string; type: string }> = {
  "All": { 
    label: "All", 
    description: "Show all items from both product and NFT collections",
    type: "both" 
  },
  "Digital Art": { 
    label: "Digital Art", 
    description: "NFTs in the Digital Art category",
    type: "nft-category" 
  },
  "Painting": { 
    label: "Painting", 
    description: "Physical paintings from product collection",
    type: "product-category" 
  },
  "Abstract": { 
    label: "Abstract", 
    description: "NFTs tagged with 'abstract' and products in Abstract category",
    type: "both-tag" 
  },
  "Portrait": { 
    label: "Portrait", 
    description: "NFTs with the Portrait tag",
    type: "nft-tag" 
  },
  "Nature": { 
    label: "Nature", 
    description: "NFTs with the Nature tag",
    type: "nft-tag" 
  },
  "Cyberpunk": { 
    label: "Cyberpunk", 
    description: "NFTs with the Cyberpunk tag",
    type: "nft-tag" 
  },
  "Art": { 
    label: "Art", 
    description: "NFTs tagged with Art",
    type: "nft-tag" 
  },
  "Futuristic": { 
    label: "Futuristic", 
    description: "NFTs with futuristic theme",
    type: "nft-tag" 
  },
  "Neon": { 
    label: "Neon", 
    description: "NFTs with neon elements",
    type: "nft-tag" 
  },
  "Color": { 
    label: "Color", 
    description: "Colorful NFTs",
    type: "nft-tag" 
  },
  "Festive": { 
    label: "Festive", 
    description: "Festive themed NFTs",
    type: "nft-tag" 
  },
};

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = memo(
  ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Filter By Category</h2>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {categories.map((category) => {
            const info = categoryInfo[category];
            
            return (
              <motion.div
                key={category}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <motion.button
                  className={`px-4 py-2 rounded-full transition-all duration-300 font-medium relative overflow-hidden ${
                    selectedCategory === category
                      ? "bg-blue-500 dark:bg-amber-500 text-white shadow-lg"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm"
                  }`}
                  onClick={() => onCategoryChange(category)}
                  aria-label={`Filter by ${category}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {/* Active background animation */}
                  {selectedCategory === category && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-amber-500 dark:to-orange-500 rounded-full"
                      layoutId="categoryBackground"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {selectedCategory === category && <Check size={16} />}
                    <span>{category}</span>
                    {info && (
                      <Info 
                        size={14} 
                        className="text-gray-400 dark:text-gray-500 ml-1" 
                      />
                    )}
                  </span>
                </motion.button>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredCategory === category && info && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-60"
                    >
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-sm text-left">
                        <p className="font-medium mb-1 text-gray-900 dark:text-white">{info.label}</p>
                        <p className="text-gray-600 dark:text-gray-300">{info.description}</p>
                        <div className="mt-1">
                          <span 
                            className={`text-xs px-2 py-1 rounded-full ${
                              info.type.includes('nft') 
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' 
                                : info.type === 'both' 
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            }`}
                          >
                            {info.type.includes('tag') ? 'Uses Tags' : 'Uses Category'}
                          </span>
                        </div>
                      </div>
                      <div 
                        className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-gray-800 absolute left-1/2 transform -translate-x-1/2"
                      ></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }
);
