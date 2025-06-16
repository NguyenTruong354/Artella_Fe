import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import { useAuctionData } from "../hooks/useAuctionData";
import { convertAuctionToDisplay, convertScheduledAuctionToDisplay } from "../utils/auctionHelpers";
import { WaveTransition } from "../components/WaveTransition";
import {
  AuctionHeader,
  BreakingNewsTicker,
  FeaturedAuctionHero,
  FilterTabs,
  AuctionGrid,
  TrendingTopics,
  MostWatched,
  NewsletterSignup,
  SocialProof,
  EditorsPick,
  ExpertsCorner,
  Filter
} from "../components/Auction";

const Auctions: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });

  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewsletter, setShowNewsletter] = useState(false);
  // Dark mode hook
  const darkMode = useDarkMode();
  // API data
  const { 
    liveAuctions, 
    scheduledAuctions, 
    isLoading  } = useAuctionData();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }  }, [controls, inView]);

  // Convert API data to display format
  const apiAuctionData = React.useMemo(() => {
    const live = liveAuctions.map(convertAuctionToDisplay);
    const scheduled = scheduledAuctions.map(convertScheduledAuctionToDisplay);
    return [...live, ...scheduled];
  }, [liveAuctions, scheduledAuctions]);

  // Use API data if available, otherwise empty array
  const allAuctionData = apiAuctionData.length > 0 ? apiAuctionData : [];

  // Select featured auction - prioritize scheduled auctions, then live auctions
  const featuredAuction = React.useMemo(() => {
    // Prefer upcoming scheduled auctions for featured section
    if (scheduledAuctions.length > 0) {
      const scheduledData = scheduledAuctions.map(convertScheduledAuctionToDisplay);
      return scheduledData[0]; // Take the first scheduled auction
    }
    
    // Fallback to live auctions if no scheduled ones
    if (liveAuctions.length > 0) {
      const liveData = liveAuctions.map(convertAuctionToDisplay);
      return liveData[0]; // Take the first live auction
    }
    
    return undefined; // No auctions available
  }, [liveAuctions, scheduledAuctions]);

  // Debug logging for API data
  React.useEffect(() => {
    if (liveAuctions.length > 0 || scheduledAuctions.length > 0) {
      console.log(`📊 API Data: ${liveAuctions.length} live auctions, ${scheduledAuctions.length} scheduled`);
      console.log('🎯 Featured auction selected:', featuredAuction);
      console.log('🔍 Live auctions data:', liveAuctions);
      console.log('🔍 Scheduled auctions data:', scheduledAuctions);
    }
  }, [liveAuctions, scheduledAuctions, featuredAuction]);

  const toggleWatch = (auctionId: string) => {
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
  const filters: Filter[] = [
    { id: "all", label: "All Auctions", count: allAuctionData.length },
    {
      id: "hot",
      label: "🔥 Hot Bids",
      count: allAuctionData.filter((a) => a.isHot).length,
    },
    { id: "ending", label: "⏰ Ending Soon", count: allAuctionData.filter(a => a.status.includes('Ending') || a.status.includes('ending')).length },
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
      ? allAuctionData
      : activeFilter === "hot"
      ? allAuctionData.filter((a) => a.isHot)
      : activeFilter === "ending"
      ? allAuctionData.filter(a => a.status.includes('Ending') || a.status.includes('ending'))
      : allAuctionData.filter((a) => watchedItems.has(a.id));

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

        {/* Header Components */}
        <AuctionHeader 
          showFilters={showFilters} 
          onToggleFilters={() => setShowFilters(!showFilters)} 
          itemVariants={itemVariants} 
          controls={controls} 
        />

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
        <BreakingNewsTicker 
          itemVariants={itemVariants} 
          controls={controls} 
        />

        {/* API Status Banner */}
        {(liveAuctions.length > 0 || scheduledAuctions.length > 0) && (
          <motion.div
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-l-4 border-green-500 mx-4 sm:mx-6 lg:mx-8 p-4 rounded-r-lg"
            variants={itemVariants}
            animate={controls}
          >
            <div className="flex items-center space-x-3">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Live Data Connected:</span> 
                <span className="ml-2">{liveAuctions.length} live auctions, {scheduledAuctions.length} scheduled</span>
                <span className="ml-2 text-xs text-gray-500">• Real-time blockchain data</span>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-l-4 border-yellow-500 mx-4 sm:mx-6 lg:mx-8 p-4 rounded-r-lg"
            variants={itemVariants}
            animate={controls}
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Loading auction data...</span>
                <span className="ml-2 text-xs text-gray-500">• Fetching from blockchain</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">              {/* Hero Featured Auction */}
              <FeaturedAuctionHero 
                featuredAuction={featuredAuction} 
                getStoryTypeColor={getStoryTypeColor}
                getStatusColor={getStatusColor}
                itemVariants={itemVariants}
                controls={controls}
              />

              {/* Navigation Tabs */}              <FilterTabs 
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                itemVariants={itemVariants}
                controls={controls}
              />              {/* News Grid Stories */}
              {filteredAuctions.length > 0 ? (
                <AuctionGrid 
                  auctions={filteredAuctions}
                  watchedItems={watchedItems}
                  onToggleWatch={toggleWatch}
                  getStoryTypeColor={getStoryTypeColor}
                  getStatusColor={getStatusColor}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                  controls={controls}
                />
              ) : null}
            </div>

            {/* Magazine Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Expert's Corner */}
              <ExpertsCorner 
                itemVariants={itemVariants}
                controls={controls}
              />

              {/* Trending Topics */}
              <TrendingTopics 
                itemVariants={itemVariants}
                controls={controls}
              />              {/* Most Watched */}
              {filteredAuctions.length > 0 && (
                <MostWatched 
                  auctions={filteredAuctions.slice(0, 3)}
                  itemVariants={itemVariants}
                  controls={controls}
                />
              )}

              {/* Newsletter Signup */}              <NewsletterSignup 
                onToggleNewsletter={() => setShowNewsletter(!showNewsletter)}
                itemVariants={itemVariants}
                controls={controls}
              />

              {/* Social Proof */}
              <SocialProof 
                itemVariants={itemVariants}
                controls={controls}
              />

              {/* Editor's Pick Mini */}
              {filteredAuctions.length > 0 && (
                <EditorsPick 
                  auctions={filteredAuctions.slice(0, 3)}
                  itemVariants={itemVariants}
                  controls={controls}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auctions;
