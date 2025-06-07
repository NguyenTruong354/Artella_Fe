import React, { memo, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Grid3X3,
  List,
  LayoutGrid,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

interface GalleryHeaderProps {
  viewMode: "masonry" | "grid" | "list";
  searchQuery: string;
  isFilteringTransition: boolean;
  showAdvancedSearch: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMasonryView: () => void;
  onGridView: () => void;
  onListView: () => void;
  onToggleAdvancedSearch: () => void;
}

// Lazy load components
const DarkModeToggle = React.lazy(() =>
  import("../DarkModeToggle").then((module) => ({
    default: module.DarkModeToggle,
  }))
);

export const GalleryHeader = memo(
  ({
    viewMode,
    searchQuery,
    isFilteringTransition,
    showAdvancedSearch,
    onSearchChange,
    onMasonryView,
    onGridView,
    onListView,
    onToggleAdvancedSearch,
  }: GalleryHeaderProps) => {
    return (
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-amber-500 dark:to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                Art Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Discover, collect & share amazing digital artworks
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Dark Mode Toggle */}
            <Suspense
              fallback={
                <div className="w-10 h-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
              }
            >
              <DarkModeToggle />
            </Suspense>

            {/* View Mode Switcher */}
            <div className="flex gap-2">
              <motion.button
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
                  viewMode === "masonry"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
                onClick={onMasonryView}
                aria-label="Masonry view"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LayoutGrid className="w-5 h-5" />
              </motion.button>
              <motion.button
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
                onClick={onGridView}
                aria-label="Grid view"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid3X3 className="w-5 h-5" />
              </motion.button>
              <motion.button
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
                onClick={onListView}
                aria-label="List view"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          {/* Search Bar with Advanced Search Toggle */}
          <div className="flex gap-3">
            <div className="flex-1">
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isFilteringTransition
                        ? "text-blue-500 dark:text-amber-400 animate-pulse"
                        : "text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-amber-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search artworks or artists..."
                  className={`w-full p-4 pl-12 rounded-2xl shadow-lg border transition-all duration-300 ${
                    isFilteringTransition
                      ? "border-blue-300 dark:border-amber-300 bg-blue-50/50 dark:bg-amber-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80"
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none backdrop-blur-sm`}
                  value={searchQuery}
                  onChange={onSearchChange}
                  aria-label="Search artworks or artists"
                  role="searchbox"
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-blue-400/10 to-cyan-500/10 dark:bg-gradient-to-r dark:from-amber-400/10 dark:to-orange-500/10"
                  aria-hidden="true"
                ></div>

                {/* Loading indicator in search */}
                {isFilteringTransition && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-4 h-4 border-2 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Advanced Search Toggle Button */}
            <motion.button
              onClick={onToggleAdvancedSearch}
              className={`px-4 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl ${
                showAdvancedSearch
                  ? "bg-blue-500 dark:bg-amber-500 text-white border-blue-500 dark:border-amber-500"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-amber-500"
              } backdrop-blur-sm`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={
                showAdvancedSearch
                  ? "Hide advanced search"
                  : "Show advanced search"
              }
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              <motion.div
                animate={{ rotate: showAdvancedSearch ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </header>
    );
  }
);
