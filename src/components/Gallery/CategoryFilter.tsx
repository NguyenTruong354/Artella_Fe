import { memo } from "react";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = memo(
  ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((category) => (
          <motion.button
            key={category}
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
            <span className="relative z-10">{category}</span>
          </motion.button>
        ))}
      </div>
    );
  }
);
