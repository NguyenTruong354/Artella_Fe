import { memo } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { AdvancedFilters } from "./types";

interface AdvancedSearchPanelProps {
  advancedFilters: AdvancedFilters;
  allArtists: string[];
  allTags: string[];
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onTagToggle: (tag: string) => void;
  onArtistChange: (artist: string) => void;
  onSortByChange: (sortBy: AdvancedFilters["sortBy"]) => void;
  onResetFilters: () => void;
}

export const AdvancedSearchPanel = memo(
  ({
    advancedFilters,
    allArtists,
    allTags,
    onPriceRangeChange,
    onTagToggle,
    onArtistChange,
    onSortByChange,
    onResetFilters,
  }: AdvancedSearchPanelProps) => {
    return (
      <motion.div
        className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Search
          </h3>
          <motion.button
            className="text-sm px-3 py-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={onResetFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset All
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Price Range (ETH)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={advancedFilters.priceRange.min}
                  onChange={(e) =>
                    onPriceRangeChange({
                      min: parseFloat(e.target.value) || 0,
                      max: advancedFilters.priceRange.max,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={advancedFilters.priceRange.max}
                  onChange={(e) =>
                    onPriceRangeChange({
                      min: advancedFilters.priceRange.min,
                      max: parseFloat(e.target.value) || 10,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none"
                  placeholder="Max"
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {advancedFilters.priceRange.min} ETH -{" "}
                {advancedFilters.priceRange.max} ETH
              </div>
            </div>
          </div>

          {/* Artist Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Artist
            </label>
            <select
              value={advancedFilters.selectedArtist}
              onChange={(e) => onArtistChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none"
            >
              <option value="">All Artists</option>
              {allArtists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By
            </label>
            <select
              value={advancedFilters.sortBy}
              onChange={(e) =>
                onSortByChange(e.target.value as AdvancedFilters["sortBy"])
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
          </div>

          {/* Tags Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {allTags.slice(0, 10).map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={advancedFilters.selectedTags.includes(tag)}
                    onChange={() => onTagToggle(tag)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-500 dark:text-amber-500 focus:ring-blue-500 dark:focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(advancedFilters.selectedTags.length > 0 ||
          advancedFilters.selectedArtist ||
          advancedFilters.priceRange.min > 0 ||
          advancedFilters.priceRange.max < 10) && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Active Filters:
            </div>
            <div className="flex flex-wrap gap-2">
              {advancedFilters.selectedTags.map((tag) => (
                <motion.span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-amber-900/30 text-blue-700 dark:text-amber-300 text-xs rounded-lg flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  #{tag}
                  <button
                    onClick={() => onTagToggle(tag)}
                    className="hover:bg-blue-200 dark:hover:bg-amber-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              {advancedFilters.selectedArtist && (
                <motion.span
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-lg flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Artist: {advancedFilters.selectedArtist}
                  <button
                    onClick={() => onArtistChange("")}
                    className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {(advancedFilters.priceRange.min > 0 ||
                advancedFilters.priceRange.max < 10) && (
                <motion.span
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {advancedFilters.priceRange.min}-
                  {advancedFilters.priceRange.max} ETH
                </motion.span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);
