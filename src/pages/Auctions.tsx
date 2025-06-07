import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Users,
  TrendingUp,
  Eye,
  Bell,
  Search,
  Clock,
  Filter,
  Star,
  BookOpen,
  Mail,
  MessageCircle,
  ChevronRight,
  Target,
  Award,
} from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";
import { WaveTransition } from "../components/WaveTransition";
import { DarkModeToggle } from "../components/DarkModeToggle";

const Auctions: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });

  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Dark mode hook
  const darkMode = useDarkMode();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const liveAuctions = [
    {
      id: 1,
      title: "Digital Dreams Collection",
      artist: "CryptoArtist",
      currentBid: "5.2 ETH",
      timeLeft: "2h 45m",
      image:
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500&h=600&fit=crop",
      bidders: 23,
      category: "Digital Art",
      isHot: true,
      estimatedValue: "€50,000 - €70,000",
      totalBids: 45,
      highestBidder: "@cryptowhale",
      storyType: "Market Analysis",
      readingTime: "3 min read",
      tags: ["trending", "investment", "digital"],
      status: "Reserve met",
      lastUpdate: "Updated 5 min ago",
      storyPreview:
        "Market experts predict this piece could revolutionize the digital art space, with institutional investors showing unprecedented interest in the collection.",
      location: "Global",
    },
    {
      id: 2,
      title: "Abstract Reality",
      artist: "DigitalPicasso",
      currentBid: "3.8 ETH",
      timeLeft: "1h 12m",
      image:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500&h=600&fit=crop",
      bidders: 18,
      category: "Abstract",
      isHot: false,
      estimatedValue: "€40,000 - €55,000",
      totalBids: 32,
      highestBidder: "@artlover99",
      storyType: "Artist Spotlight",
      readingTime: "4 min read",
      tags: ["emerging", "abstract", "collectors"],
      status: "Ending in 1 hour",
      lastUpdate: "Updated 12 min ago",
      storyPreview:
        "Rising star DigitalPicasso's abstract works are capturing the attention of major galleries worldwide, with this piece representing their breakthrough moment.",
      location: "Europe",
    },
    {
      id: 3,
      title: "Blockchain Starry Night",
      artist: "NFTMaster",
      currentBid: "7.1 ETH",
      timeLeft: "4h 33m",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=600&fit=crop",
      bidders: 41,
      category: "Classic",
      isHot: true,
      estimatedValue: "€80,000 - €120,000",
      totalBids: 78,
      highestBidder: "@moonwalker",
      storyType: "Bidding Wars",
      readingTime: "2 min read",
      tags: ["classic", "bidding-war", "record"],
      status: "New high bid",
      lastUpdate: "Updated 2 min ago",
      storyPreview:
        "An intense bidding war erupted overnight as collectors battle for this modern interpretation of the classic masterpiece, pushing prices to new heights.",
      location: "Americas",
    },
    {
      id: 4,
      title: "Neon Dreams",
      artist: "PixelMaestro",
      currentBid: "2.9 ETH",
      timeLeft: "6h 15m",
      image:
        "https://images.unsplash.com/photo-1579965342575-15475c126358?w=500&h=600&fit=crop",
      bidders: 15,
      category: "Digital Art",
      isHot: false,
      estimatedValue: "€30,000 - €45,000",
      totalBids: 28,
      highestBidder: "@neonlover",
      storyType: "Trend Reports",
      readingTime: "5 min read",
      tags: ["neon", "cyberpunk", "future"],
      status: "Active bidding",
      lastUpdate: "Updated 8 min ago",
      storyPreview:
        "The cyberpunk aesthetic is making a strong comeback in digital art, with neon-themed pieces seeing 200% increase in collector interest this quarter.",
      location: "Asia",
    },
    {
      id: 5,
      title: "Cosmic Waves",
      artist: "GalaxyCreator",
      currentBid: "4.5 ETH",
      timeLeft: "3h 28m",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
      bidders: 29,
      category: "Space Art",
      isHot: true,
      estimatedValue: "€55,000 - €75,000",
      totalBids: 56,
      highestBidder: "@spacedreamer",
      storyType: "Market Analysis",
      readingTime: "3 min read",
      tags: ["space", "premium", "limited"],
      status: "Hot auction",
      lastUpdate: "Updated 1 min ago",
      storyPreview:
        "Space-themed digital art emerges as the next big trend, with this piece leading a new wave of cosmic consciousness in the NFT market.",
      location: "Global",
    },
    {
      id: 6,
      title: "Urban Rhapsody",
      artist: "CityVibes",
      currentBid: "1.8 ETH",
      timeLeft: "5h 42m",
      image:
        "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=500&h=600&fit=crop",
      bidders: 12,
      category: "Urban",
      isHot: false,
      estimatedValue: "€25,000 - €35,000",
      totalBids: 21,
      highestBidder: "@urbanist",
      storyType: "Artist Spotlight",
      readingTime: "4 min read",
      tags: ["urban", "street-art", "contemporary"],
      status: "Steady growth",
      lastUpdate: "Updated 15 min ago",
      storyPreview:
        "Street art meets digital innovation as CityVibes captures the pulse of urban life through cutting-edge blockchain technology and artistic vision.",
      location: "Americas",
    },
  ];

  const toggleWatch = (auctionId: number) => {
    setWatchedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(auctionId)) {
        newSet.delete(auctionId);
      } else {
        newSet.add(auctionId);
      }
      return newSet;
    });
  };

  const filters = [
    { id: "all", label: "All Auctions", count: liveAuctions.length },
    {
      id: "hot",
      label: "🔥 Hot Bids",
      count: liveAuctions.filter((a) => a.isHot).length,
    },
    { id: "ending", label: "⏰ Ending Soon", count: 3 },
    { id: "watched", label: "👁️ Watched", count: watchedItems.size },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
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
  };

  const filteredAuctions =
    activeFilter === "all"
      ? liveAuctions
      : activeFilter === "hot"
      ? liveAuctions.filter((a) => a.isHot)
      : activeFilter === "ending"
      ? liveAuctions.slice(0, 3)
      : liveAuctions.filter((a) => watchedItems.has(a.id));

  const categories = [
    "all",
    "Digital Art",
    "Abstract",
    "Classic",
    "Space Art",
    "Urban",
  ];
  const storyTypes = [
    "Market Analysis",
    "Artist Spotlight",
    "Bidding Wars",
    "Trend Reports",
  ];

  const getStoryTypeColor = (type: string) => {
    switch (type) {
      case "Market Analysis":
        return "bg-blue-500";
      case "Artist Spotlight":
        return "bg-purple-500";
      case "Bidding Wars":
        return "bg-red-500";
      case "Trend Reports":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Ending")) return "bg-red-500";
    if (status.includes("New high")) return "bg-orange-500";
    if (status.includes("Reserve met")) return "bg-green-500";
    if (status.includes("Hot")) return "bg-pink-500";
    return "bg-blue-500";
  };

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 relative overflow-hidden gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
        role="main"
        aria-label="Auction News Feed"
      >
        {/* Subtle Background decoration */}
        <div className="absolute inset-0 opacity-3" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-red-400 to-pink-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-violet-500 dark:bg-gradient-to-r dark:from-red-400 dark:to-pink-500"></div>
        </div>

        {/* Magazine Header */}
        <motion.header
          className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Magazine Logo & Title */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    AUCTION TODAY
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                    DIGITAL ART MAGAZINE • LIVE EDITION
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-3">
                <motion.button
                  className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                >
                  <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
                <motion.button
                  className="relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </motion.button>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range (ETH)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Story Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <option value="all">All Stories</option>
                    {storyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <option value="all">All Locations</option>
                    <option value="global">Global</option>
                    <option value="americas">Americas</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Breaking News Ticker */}
        <motion.div
          className="relative z-10 bg-red-500 dark:bg-amber-500 text-white overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="flex items-center py-2 px-4">
            <span className="bg-white text-red-500 dark:text-amber-500 px-3 py-1 rounded text-xs font-bold mr-4 whitespace-nowrap">
              BREAKING
            </span>
            <motion.div
              className="flex items-center space-x-8 whitespace-nowrap"
              animate={{ x: [-1000, 1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-sm font-medium">
                🔥 "Cosmic Dreams" reaches 12.5 ETH - New record!
              </span>
              <span className="text-sm font-medium">
                ⚡ 5 new auctions starting in 30 minutes
              </span>
              <span className="text-sm font-medium">
                🏆 "Digital Renaissance" collection sold for 45 ETH
              </span>
              <span className="text-sm font-medium">
                📈 NFT market up 127% this week
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Featured Auction */}
              <motion.section
                className="relative z-10"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Featured Image */}
                    <div className="relative h-96 lg:h-full overflow-hidden">
                      <img
                        src={filteredAuctions[0]?.image}
                        alt={filteredAuctions[0]?.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          FEATURED AUCTION
                        </span>
                        <span
                          className={`${getStoryTypeColor(
                            filteredAuctions[0]?.storyType || ""
                          )} text-white px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {filteredAuctions[0]?.storyType}
                        </span>
                      </div>
                      {/* Reading Progress */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <p className="text-white text-xs mt-2 font-medium">
                          75% of auction time remaining
                        </p>
                      </div>
                    </div>

                    {/* Featured Content */}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-500 dark:text-amber-400 text-sm font-bold tracking-wide">
                            EDITOR'S CHOICE
                          </span>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            {filteredAuctions[0]?.readingTime}
                          </div>
                        </div>
                        <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-gray-100">
                          {filteredAuctions[0]?.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {filteredAuctions[0]?.storyPreview}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {filteredAuctions[0]?.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Current Bid
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                            {filteredAuctions[0]?.currentBid}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Time Remaining
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {filteredAuctions[0]?.timeLeft}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-6">
                        <span
                          className={`${getStatusColor(
                            filteredAuctions[0]?.status || ""
                          )} text-white px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center`}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          {filteredAuctions[0]?.status}
                        </span>
                      </div>

                      <motion.button
                        className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        READ FULL STORY & BID
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Navigation Tabs */}
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
                      onClick={() => setActiveFilter(filter.id)}
                      whileHover={{ y: -2 }}
                    >
                      {filter.label}
                      <span className="ml-2 text-xs">({filter.count})</span>
                    </motion.button>
                  ))}
                </div>
              </motion.nav>

              {/* News Grid Stories */}
              <motion.main
                className="relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAuctions.slice(1).map((auction) => (
                    <motion.article
                      key={auction.id}
                      className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500"
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      layout
                    >
                      {/* Article Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Story Labels */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                            {auction.category}
                          </span>
                          <span
                            className={`${getStoryTypeColor(
                              auction.storyType
                            )} text-white px-2 py-1 rounded text-xs font-bold`}
                          >
                            {auction.storyType}
                          </span>
                          {auction.isHot && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              HOT
                            </span>
                          )}
                        </div>

                        {/* Watch Button */}
                        <motion.button
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                            watchedItems.has(auction.id)
                              ? "bg-red-500/90 text-white"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                          onClick={() => toggleWatch(auction.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>

                        {/* Status & Time Badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                          <span
                            className={`${getStatusColor(
                              auction.status
                            )} text-white px-2 py-1 rounded text-xs font-bold`}
                          >
                            {auction.status}
                          </span>
                          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium">
                            {auction.timeLeft} left
                          </div>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-5">
                        {/* Headline with Typography Hierarchy */}
                        <div className="mb-3">
                          <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                            {auction.title}:{" "}
                            {auction.storyType === "Bidding Wars"
                              ? "Intense Battle Erupts"
                              : auction.storyType === "Market Analysis"
                              ? "Market Disruption Ahead"
                              : auction.storyType === "Artist Spotlight"
                              ? "Rising Star Emerges"
                              : "Trend Analysis"}
                          </h3>
                        </div>

                        {/* Byline with Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div>
                            By{" "}
                            <span className="font-semibold">
                              {auction.artist}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {auction.readingTime}
                            </span>
                            <span className="flex items-center">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {auction.location}
                            </span>
                          </div>
                        </div>

                        {/* Story Preview */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {auction.storyPreview}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {auction.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats Bar */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {auction.bidders} bidders
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {auction.totalBids} bids
                          </span>
                          <span>
                            {Math.floor(Math.random() * 500) + 100} views
                          </span>
                          <span className="text-gray-400">
                            {auction.lastUpdate}
                          </span>
                        </div>

                        {/* Current Bid & Action */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Current Bid
                            </p>
                            <p className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                              {auction.currentBid}
                            </p>
                          </div>
                          <motion.button
                            className="bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Read & Bid
                          </motion.button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Load More Stories */}
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Load More Stories
                  </motion.button>
                </motion.div>
              </motion.main>
            </div>

            {/* Magazine Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Expert's Corner */}
              <motion.aside
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Expert's Corner
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                      "The digital art market is experiencing unprecedented
                      growth. I predict we'll see 300% increase in institutional
                      investments this quarter."
                    </p>
                    <div className="flex items-center">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                        alt="Expert"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          Dr. Sarah Chen
                        </p>
                        <p className="text-xs text-gray-500">
                          Art Market Analyst
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    className="w-full text-left text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    Read full analysis <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </motion.aside>

              {/* Trending Topics */}
              <motion.aside
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-full flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Trending Now
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { topic: "AI-Generated Art Surge", change: "+127%" },
                    { topic: "Metaverse Galleries", change: "+89%" },
                    { topic: "Sustainable NFTs", change: "+156%" },
                    { topic: "Celebrity Collections", change: "+67%" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.topic}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-red-100 dark:bg-amber-100 text-red-600 dark:text-amber-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.topic}
                        </span>
                      </div>
                      <span className="text-xs text-green-500 font-bold">
                        {item.change}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.aside>

              {/* Most Watched */}
              <motion.aside
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Most Watched
                  </h3>
                </div>
                <div className="space-y-3">
                  {filteredAuctions.slice(0, 3).map((auction) => (
                    <motion.div
                      key={`watched-${auction.id}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {auction.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {auction.currentBid}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="w-3 h-3 mr-1" />
                        {auction.bidders}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.aside>

              {/* Newsletter Signup */}
              <motion.aside
                className="bg-gradient-to-br from-red-500/10 to-pink-500/10 dark:from-amber-500/10 dark:to-orange-500/10 backdrop-blur-xl rounded-xl p-6 border border-red-200/50 dark:border-amber-200/20"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Auction Alerts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get notified about hot auctions, market trends, and
                    exclusive previews.
                  </p>
                  <motion.button
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    onClick={() => setShowNewsletter(!showNewsletter)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe Now
                  </motion.button>
                </div>
              </motion.aside>

              {/* Social Proof */}
              <motion.aside
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                variants={itemVariants}
                initial="hidden"
                animate={controls}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    What Collectors Say
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                      "Best auction platform for discovering emerging artists!"
                    </p>
                    <p className="text-xs text-gray-500">@artcollector2024</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                      "The market insights here are invaluable for my
                      investments."
                    </p>
                    <p className="text-xs text-gray-500">@cryptoinvestor</p>
                  </div>
                </div>
              </motion.aside>

              {/* Editor's Pick Mini */}
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
                    {filteredAuctions.slice(0, 3).map((auction, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auctions;
