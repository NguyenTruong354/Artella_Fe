import React, { useEffect, useRef, useMemo, useCallback, Suspense, lazy, memo, useReducer } from 'react'; // Added useReducer
import { motion, useAnimation, useInView } from 'framer-motion';
import { Search, Grid3X3, List, Eye, Heart, Share2, ArrowUpRight, Zap } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

// Lazy load components for better code splitting
const WaveTransition = lazy(() => import('../components/WaveTransition').then(module => ({ default: module.WaveTransition })));
const DarkModeToggle = lazy(() => import('../components/DarkModeToggle').then(module => ({ default: module.DarkModeToggle })));

// Interfaces
interface ArtworkItem {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
  likes: number;
  views: number;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  tags: string[];
}

// State Management with useReducer
interface GalleryPageState {
  selectedCategory: string;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  likedItems: Set<number>;
  isLoading: boolean;
  // artworksData: ArtworkItem[]; // If artworks were fetched and managed by reducer
}

type GalleryPageAction =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_LIKE'; payload: number }
  | { type: 'FINISH_INITIAL_LOADING' };

const galleryPageReducer = (state: GalleryPageState, action: GalleryPageAction): GalleryPageState => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_LIKE': {
      const newLikedItems = new Set(state.likedItems);
      if (newLikedItems.has(action.payload)) {
        newLikedItems.delete(action.payload);
      } else {
        newLikedItems.add(action.payload);
      }
      // Persist liked items to localStorage
      localStorage.setItem('likedArtworks', JSON.stringify(Array.from(newLikedItems)));
      return { ...state, likedItems: newLikedItems };
    }
    case 'FINISH_INITIAL_LOADING':
      return { ...state, isLoading: false };
    // case 'SET_ARTWORKS': // Example if artworks were fetched
    //   return { ...state, artworksData: action.payload, isLoading: false };
    default:
      return state;
  }
};

// Function to get initial liked items from localStorage
const getInitialLikedItems = (): Set<number> => {
  const storedLikes = localStorage.getItem('likedArtworks');
  if (storedLikes) {
    try {
      const parsedLikes = JSON.parse(storedLikes);
      if (Array.isArray(parsedLikes)) {
        return new Set(parsedLikes.filter(item => typeof item === 'number')) as Set<number>;
      }
    } catch (error) {
      console.error("Error parsing liked items from localStorage:", error);
      return new Set();
    }
  }
  return new Set();
};

// Initial state for the reducer
const initialGalleryPageState: GalleryPageState = {
  selectedCategory: 'All',
  viewMode: 'grid',
  searchQuery: '',
  likedItems: getInitialLikedItems(), // Load from localStorage
  isLoading: true,
};

// Skeleton loading component
const SkeletonCard = memo(() => (
  <div className="animate-pulse backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70">
    <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
      </div>
      <div className="flex gap-1">
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
));

// Fallback component for loading states
const ComponentFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-8"></div>
));

// ArtworkCard component - simplified without lazy loading issues
const ArtworkCard = memo(({ artwork, viewMode, likedItems, toggleLike }: {
  artwork: ArtworkItem;
  viewMode: 'grid' | 'list';
  likedItems: Set<number>;
  toggleLike: (id: number) => void;
}) => {
  const isLiked = useMemo(() => likedItems.has(artwork.id), [likedItems, artwork.id]);
    
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.4,
          },
        },
      }}
      className={`group relative ${
        viewMode === 'grid'
          ? 'backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70'
          : 'flex gap-6 p-6 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70'
      }`}
      whileHover={{ 
        scale: viewMode === 'grid' ? 1.02 : 1.01, 
        y: viewMode === 'grid' ? -5 : -2 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* Featured Badge */}
      {artwork.isFeatured && (
        <motion.div
          className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-lg font-bold text-xs shadow-lg"
          animate={{ y: [0, -2, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ⭐ Featured
        </motion.div>
      )}

      {/* New Badge */}
      {artwork.isNew && (
        <motion.div
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨ New
        </motion.div>
      )}

      {/* Image with optimized lazy loading */}
      <div className={`relative overflow-hidden ${
        viewMode === 'grid' ? 'aspect-[4/5]' : 'w-48 h-32 rounded-xl'
      }`}>
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex gap-2">
            <motion.button
              className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleLike(artwork.id)}
              aria-label={`${isLiked ? 'Unlike' : 'Like'} ${artwork.title}`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
            <motion.button
              className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Share ${artwork.title}`}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="p-2 bg-blue-500 dark:bg-amber-500 rounded-full text-white hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`View details of ${artwork.title}`}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
              {artwork.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              by {artwork.artist}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {artwork.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {artwork.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{artwork.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{artwork.likes.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-amber-400">
              {artwork.price}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-amber-500 dark:to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Place bid on ${artwork.title}`}
        >
          <Zap className="w-4 h-4" />
          Place Bid
        </motion.button>
      </div>
    </motion.div>
  );
});

const Gallery: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });

  // Use reducer for state management
  const [state, dispatch] = useReducer(galleryPageReducer, initialGalleryPageState);
  const { selectedCategory, viewMode, searchQuery, likedItems, isLoading } = state;

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
      dispatch({ type: 'FINISH_INITIAL_LOADING' });
    }, 1500); // Simulate a 1.5 second loading time
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Memoized gallery data for performance - remains outside reducer for now as it's static
  const artworks: ArtworkItem[] = useMemo(() => [
    {
      id: 1,
      title: "Cosmic Dreams",
      artist: "Elena Rodriguez",
      price: "3.2 ETH",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
      category: "Digital",
      likes: 124,
      views: 1520,
      isNew: true,
      isFeatured: true,
      description: "A mesmerizing journey through space and time",
      tags: ["space", "cosmic", "digital art"]
    },
    {
      id: 2,
      title: "Abstract Harmony",
      artist: "Marcus Chen",
      price: "2.8 ETH",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
      category: "Abstract",
      likes: 89,
      views: 980,
      isNew: false,
      isFeatured: true,
      description: "Colors dancing in perfect harmony",
      tags: ["abstract", "colorful", "harmony"]
    },
    {
      id: 3,
      title: "Neon Cityscapes",
      artist: "Sarah Kim",
      price: "4.1 ETH",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=600&fit=crop",
      category: "Cyberpunk",
      likes: 156,
      views: 2340,
      isNew: true,
      isFeatured: false,
      description: "Urban dreams in electric colors",
      tags: ["cyberpunk", "neon", "city"]
    },
    {
      id: 4,
      title: "Ethereal Portrait",
      artist: "David Wilson",
      price: "1.9 ETH",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
      category: "Portrait",
      likes: 67,
      views: 756,
      isNew: false,
      isFeatured: false,
      description: "Capturing the essence of human emotion",
      tags: ["portrait", "emotion", "human"]
    },
    {
      id: 5,
      title: "Digital Flora",
      artist: "Anna Petrov",
      price: "2.5 ETH",
      image: "https://images.unsplash.com/photo-1551913902-c92207136625?w=500&h=600&fit=crop",
      category: "Nature",
      likes: 203,
      views: 1890,
      isNew: true,
      isFeatured: true,
      description: "Nature reimagined through digital lens",
      tags: ["nature", "flora", "digital"]
    },
    {
      id: 6,
      title: "Geometric Visions",
      artist: "James Park",
      price: "3.7 ETH",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
      category: "Geometric",
      likes: 91,
      views: 1234,
      isNew: false,
      isFeatured: false,
      description: "Perfect mathematics in artistic form",
      tags: ["geometric", "mathematics", "precision"]
    }
  ], []);

  const categories = useMemo(() => ['All', 'Digital', 'Abstract', 'Cyberpunk', 'Portrait', 'Nature', 'Geometric'], []);

  // Update handlers to dispatch actions
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  }, []);

  // Memoized filter function for better performance
  const filteredArtworks = useMemo(() => {
    // If artworks were part of state: state.artworksData.filter(...)
    return artworks.filter(artwork => {
      const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
      const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [artworks, selectedCategory, searchQuery]);

  // Update toggleLike to dispatch action
  const toggleLike = useCallback((artworkId: number) => {
    dispatch({ type: 'TOGGLE_LIKE', payload: artworkId });
  }, []);

  // Update category handler to dispatch action
  const handleCategoryChange = useCallback((category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  // Update view mode handlers to dispatch actions
  const setGridView = useCallback(() => dispatch({ type: 'SET_VIEW_MODE', payload: 'grid' }), []);
  const setListView = useCallback(() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' }), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
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
                  Discover amazing digital artworks
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              {/* Dark Mode Toggle */}
              <Suspense fallback={<div className="w-10 h-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />}>
                <DarkModeToggle />
              </Suspense>

              {/* View Mode Switcher */}
              <div className="flex gap-2">
                <motion.button
                  className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={setGridView}
                  aria-label="Grid view"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Grid3X3 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={setListView}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <motion.div
                className="relative group" // Added group class
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-amber-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search artworks or artists..."
                  className="w-full p-4 pl-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:outline-none backdrop-blur-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search artworks or artists" // Added aria-label
                  role="searchbox" // Added role
                />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-blue-400/10 to-cyan-500/10 dark:bg-gradient-to-r dark:from-amber-400/10 dark:to-orange-500/10" aria-hidden="true"></div>
              </motion.div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-500 dark:bg-amber-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                  aria-label={`Filter by ${category}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' // Use state.viewMode
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? ( // Use state.isLoading
            // Display SkeletonCards when loading
            Array.from({ length: viewMode === 'grid' ? 3 : 2 }).map((_, index) => ( // Use state.viewMode
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          ) : filteredArtworks.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No artworks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </motion.div>
          ) : (
            filteredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                viewMode={viewMode} // Pass state.viewMode
                likedItems={likedItems} // Pass state.likedItems
                toggleLike={toggleLike} // Pass updated toggleLike
              />
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Gallery;
