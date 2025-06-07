import React, {
  useEffect,
  useRef,
  useCallback,
  Suspense,
  useReducer,
} from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Search, X } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import {
  ArtworkCard,
  AdvancedSearchPanel,
  CategoryFilter,
  GalleryHeader,
  MasonryGrid,
  SkeletonCard,
  ComponentFallback,
  LoadingMore,
  galleryPageReducer,
  initialGalleryPageState,
  useInfiniteScroll,
  useAllArtists,
  useAllTags,
  useFilteredArtworks,
  mockArtworks,
  categories,
  generateMoreArtworks,
} from "../components/Gallery";

// Lazy load WaveTransition component
const WaveTransition = React.lazy(() =>
  import("../components/WaveTransition").then((module) => ({
    default: module.WaveTransition,
  }))
);

const Gallery: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // Use reducer for state management
  const [state, dispatch] = useReducer(
    galleryPageReducer,
    initialGalleryPageState
  );
  const {
    selectedCategory,
    viewMode,
    searchQuery,
    likedItems,
    isLoading,
    displayedArtworks,
    hasMoreArtworks,
    isLoadingMore,
    isFilteringTransition,
    advancedFilters,
    showAdvancedSearch,
  } = state;

  // Dark mode hook
  const darkMode = useDarkMode();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "FINISH_INITIAL_LOADING" });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Using imported mockArtworks data
  const artworks = mockArtworks;

  // Using imported utility functions
  const allArtists = useAllArtists(artworks);
  const allTags = useAllTags(artworks);
  const filteredArtworks = useFilteredArtworks(
    artworks,
    selectedCategory,
    searchQuery,
    displayedArtworks,
    advancedFilters
  );

  // Load more artworks function
  const loadMoreArtworks = useCallback(() => {
    if (isLoadingMore || !hasMoreArtworks) return;

    dispatch({ type: "SET_LOADING_MORE", payload: true });

    // Simulate API call delay
    setTimeout(() => {
      const newArtworks = generateMoreArtworks(
        displayedArtworks.length + 100,
        8
      );
      const filteredNewArtworks = newArtworks.filter((artwork) => {
        const matchesCategory =
          selectedCategory === "All" || artwork.category === selectedCategory;
        const matchesSearch =
          artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      dispatch({ type: "LOAD_MORE_ARTWORKS", payload: filteredNewArtworks });
    }, 800);
  }, [
    isLoadingMore,
    hasMoreArtworks,
    displayedArtworks.length,
    selectedCategory,
    searchQuery,
  ]);

  // Use infinite scroll hook
  useInfiniteScroll(loadMoreArtworks, hasMoreArtworks, isLoadingMore);

  // Update search handler with smooth transition and debouncing
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      dispatch({ type: "SET_SEARCH_QUERY", payload: value });

      // Start transition for immediate visual feedback
      dispatch({ type: "START_FILTERING_TRANSITION" });

      // Add debounce effect for smoother search
      const timeoutId = setTimeout(() => {
        dispatch({ type: "FINISH_FILTERING_TRANSITION" });
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    []
  );

  // Reset artworks when category, search, or advanced filters change
  useEffect(() => {
    dispatch({ type: "RESET_ARTWORKS", payload: [] });
  }, [selectedCategory, searchQuery, advancedFilters]);

  // Update toggleLike to dispatch action
  const toggleLike = useCallback((artworkId: number) => {
    dispatch({ type: "TOGGLE_LIKE", payload: artworkId });
  }, []);

  // Update category handler to dispatch action with smooth transition
  const handleCategoryChange = useCallback(
    (category: string) => {
      // Only start transition if category actually changes
      if (category !== selectedCategory) {
        dispatch({ type: "START_FILTERING_TRANSITION" });
        dispatch({ type: "SET_CATEGORY", payload: category });

        // Simulate smooth transition delay
        setTimeout(() => {
          dispatch({ type: "FINISH_FILTERING_TRANSITION" });
        }, 400);
      }
    },
    [selectedCategory]
  );

  // Update view mode handlers to dispatch actions
  const setMasonryView = useCallback(
    () => dispatch({ type: "SET_VIEW_MODE", payload: "masonry" }),
    []
  );
  const setGridView = useCallback(
    () => dispatch({ type: "SET_VIEW_MODE", payload: "grid" }),
    []
  );
  const setListView = useCallback(
    () => dispatch({ type: "SET_VIEW_MODE", payload: "list" }),
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  // Animation variants for filtering transitions
  const filterTransitionVariants = {
    hidden: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.95,
      filter: "blur(2px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <Suspense fallback={<ComponentFallback />}>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
      </Suspense>
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-visible gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#121212]"
      >
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 dark:bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 dark:bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 dark:bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Header */}
        <GalleryHeader 
          viewMode={viewMode}
          searchQuery={searchQuery}
          isFilteringTransition={isFilteringTransition}
          showAdvancedSearch={showAdvancedSearch}
          onSearchChange={handleSearchChange}
          onMasonryView={setMasonryView}
          onGridView={setGridView}
          onListView={setListView}
          onToggleAdvancedSearch={() => dispatch({ type: "TOGGLE_ADVANCED_SEARCH" })}
        />

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <AdvancedSearchPanel
            advancedFilters={advancedFilters}
            allArtists={allArtists}
            allTags={allTags}
            onPriceRangeChange={(range) =>
              dispatch({ type: "SET_PRICE_RANGE", payload: range })
            }
            onTagToggle={(tag) =>
              dispatch({ type: "TOGGLE_TAG", payload: tag })
            }
            onArtistChange={(artist) =>
              dispatch({ type: "SET_ARTIST", payload: artist })
            }
            onSortByChange={(sortBy) =>
              dispatch({ type: "SET_SORT_BY", payload: sortBy })
            }
            onResetFilters={() =>
              dispatch({ type: "RESET_ADVANCED_FILTERS" })
            }
          />
        )}

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Results count with animation and active filters display */}
        {!isLoading && filteredArtworks.length > 0 && (
          <motion.div
            className="mb-6 space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={`results-${selectedCategory}-${searchQuery}-${JSON.stringify(
              advancedFilters
            )}`}
          >
            <div className="flex items-center justify-between">
              <motion.p
                className="text-gray-600 dark:text-gray-400 text-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                Showing{" "}
                <span className="font-semibold text-blue-600 dark:text-amber-400">
                  {filteredArtworks.length}
                </span>{" "}
                artworks
                {selectedCategory !== "All" && (
                  <span>
                    {" "}
                    in <span className="font-semibold">{selectedCategory}</span>
                  </span>
                )}
                {searchQuery && (
                  <span>
                    {" "}
                    for "<span className="font-semibold">{searchQuery}</span>"
                  </span>
                )}
              </motion.p>

              {/* Filter reset button */}
              {(selectedCategory !== "All" ||
                searchQuery ||
                advancedFilters.selectedTags.length > 0 ||
                advancedFilters.selectedArtist ||
                advancedFilters.priceRange.min > 0 ||
                advancedFilters.priceRange.max < 10) && (
                <motion.button
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                  onClick={() => {
                    handleCategoryChange("All");
                    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
                    dispatch({ type: "RESET_ADVANCED_FILTERS" });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Gallery Grid */}
        <motion.div
          key={`${selectedCategory}-${searchQuery}`}
          variants={filterTransitionVariants}
          initial="hidden"
          animate={isFilteringTransition ? "hidden" : "visible"}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Filtering transition overlay */}
          {isFilteringTransition && (
            <motion.div
              className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  Filtering artworks...
                </p>
              </div>
            </motion.div>
          )}

          {viewMode === "masonry" ? (
            <>
              <MasonryGrid className="w-full">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="masonry-item mb-6 break-inside-avoid"
                    >
                      <SkeletonCard />
                    </div>
                  ))
                ) : filteredArtworks.length === 0 ? (
                  <motion.div
                    className="col-span-full text-center py-20"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No artworks found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Try adjusting your search or filter criteria to find what
                      you're looking for.
                    </p>
                  </motion.div>
                ) : (
                  filteredArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <ArtworkCard
                        artwork={artwork}
                        viewMode={viewMode}
                        likedItems={likedItems}
                        toggleLike={toggleLike}
                      />
                    </motion.div>
                  ))
                )}
              </MasonryGrid>
              {/* Loading More Indicator */}
              {isLoadingMore && <LoadingMore />}
              {/* End of content indicator */}
              {!hasMoreArtworks && filteredArtworks.length > 8 && (
                <motion.div
                  className="text-center py-12"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    You've seen it all!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    That's all the artworks we have for now. Check back later
                    for more!
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <motion.div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {isLoading ? (
                  Array.from({ length: viewMode === "grid" ? 3 : 2 }).map(
                    (_, index) => <SkeletonCard key={`skeleton-${index}`} />
                  )
                ) : filteredArtworks.length === 0 ? (
                  <motion.div
                    className="col-span-full text-center py-20"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No artworks found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Try adjusting your search or filter criteria to find what
                      you're looking for.
                    </p>
                  </motion.div>
                ) : (
                  filteredArtworks.map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      <ArtworkCard
                        artwork={artwork}
                        viewMode={viewMode}
                        likedItems={likedItems}
                        toggleLike={toggleLike}
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
              {/* Loading More Indicator for Grid/List view */}
              {isLoadingMore && <LoadingMore />}
              {/* End of content indicator for Grid/List view */}
              {!hasMoreArtworks && filteredArtworks.length > 8 && (
                <motion.div
                  className="text-center py-12"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    You've seen it all!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    That's all the artworks we have for now. Check back later
                    for more!
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Gallery;
