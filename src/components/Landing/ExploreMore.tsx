import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, Filter,  Heart, Eye, Star, TrendingUp } from 'lucide-react';

// Mock data cho artworks
const artworks = [
  {
    id: 1,
    title: "Ethereal Dreams",
    artist: "Alexandra Chen",
    price: "3.45 ETH",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop",
    category: "Abstract",
    views: 1250,
    likes: 89,
    rating: 4.8,
    trending: true,
    featured: true
  },
  {
    id: 2,
    title: "Digital Harmony",
    artist: "Marcus Johnson",
    price: "2.75 ETH",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=500&fit=crop",
    category: "Digital",
    views: 892,
    likes: 67,
    rating: 4.6,
    trending: false,
    featured: true
  },
  {
    id: 3,
    title: "Neon Genesis",
    artist: "Sarah Kim",
    price: "4.20 ETH",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
    category: "Cyberpunk",
    views: 2100,
    likes: 156,
    rating: 4.9,
    trending: true,
    featured: false
  },
  {
    id: 4,
    title: "Ocean Depths",
    artist: "David Rodriguez",
    price: "1.85 ETH",
    image: "https://images.unsplash.com/photo-1579965342575-15475c126358?w=400&h=500&fit=crop",
    category: "Nature",
    views: 743,
    likes: 43,
    rating: 4.4,
    trending: false,
    featured: false
  },
  {
    id: 5,
    title: "Cosmic Wanderer",
    artist: "Elena Petrova",
    price: "5.10 ETH",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop",
    category: "Sci-Fi",
    views: 3200,
    likes: 234,
    rating: 5.0,
    trending: true,
    featured: true
  },
  {
    id: 6,
    title: "Urban Pulse",
    artist: "Jamie Thompson",
    price: "2.95 ETH",
    image: "https://images.unsplash.com/photo-1551913902-c92207136625?w=400&h=500&fit=crop",
    category: "Street Art",
    views: 1456,
    likes: 98,
    rating: 4.7,
    trending: false,
    featured: false
  }
];

const categories = ["All", "Abstract", "Digital", "Cyberpunk", "Nature", "Sci-Fi", "Street Art"];

const ExploreMore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);
  const [isLoading, setIsLoading] = useState(true);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = artworks.filter(artwork => {
      const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
      const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.artist.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case "trending":
        filtered = filtered.sort((a, b) => Number(b.trending) - Number(a.trending));
        break;
      case "price":
        filtered = filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "views":
        filtered = filtered.sort((a, b) => b.views - a.views);
        break;
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredArtworks(filtered);
  }, [selectedCategory, searchTerm, sortBy]);

  const toggleLike = (id: number) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mb-4 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-white text-xl font-semibold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Gallery...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <motion.div
          className="text-center z-10 px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
            variants={itemVariants}
            style={{
              fontFamily: "'Segoe Print', cursive",
              textShadow: "0 0 30px rgba(147, 51, 234, 0.5)"
            }}
          >
            Digital Gallery
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Explore extraordinary digital artworks from visionary artists worldwide
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-purple-500/25"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Exploring
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        className="py-20 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Controls */}
        <motion.div
          className="mb-12 space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Search Bar */}
          <motion.div
            className="relative max-w-md mx-auto"
            variants={itemVariants}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={itemVariants}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Sort Options */}
          <motion.div
            className="flex justify-center items-center gap-4"
            variants={itemVariants}
          >
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="trending">Trending</option>
              <option value="price">Price</option>
              <option value="views">Views</option>
              <option value="rating">Rating</option>
            </select>
          </motion.div>
        </motion.div>

        {/* Artwork Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={selectedCategory + searchTerm + sortBy}
          >
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -10, scale: 1.02 }}
                layout
              >
                {/* Featured Badge */}
                {artwork.featured && (
                  <motion.div
                    className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    Featured
                  </motion.div>
                )}

                {/* Trending Badge */}
                {artwork.trending && (
                  <motion.div
                    className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-full"
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </motion.div>
                )}

                {/* Image */}
                <motion.div
                  className="relative w-full h-64 rounded-xl overflow-hidden mb-4 group-hover:shadow-2xl transition-shadow duration-500"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Actions */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  >
                    <button
                      onClick={() => toggleLike(artwork.id)}
                      className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                        likedItems.has(artwork.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-red-500"
                      }`}
                    >
                      <Heart className="w-5 h-5" fill={likedItems.has(artwork.id) ? "currentColor" : "none"} />
                    </button>
                    <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-purple-500 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-400">by {artwork.artist}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 text-sm">{artwork.rating}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {artwork.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {artwork.likes}
                      </span>
                    </div>
                    <span className="text-purple-400 font-bold text-lg">{artwork.price}</span>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredArtworks.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No artworks found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default ExploreMore;
