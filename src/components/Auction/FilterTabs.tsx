import React from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { Filter } from './index';

interface FilterTabsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  itemVariants: Variants;
  controls: AnimationControls;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  itemVariants,
  controls
}) => {
  return (
    <motion.nav
      className="relative z-10"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeFilter === filter.id
                ? "border-red-500 dark:border-amber-400 text-red-600 dark:text-amber-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
            onClick={() => onFilterChange(filter.id)}
            whileHover={{ y: -2 }}
          >
            {filter.label}
            <span className="ml-2 text-xs">({filter.count})</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default FilterTabs;
