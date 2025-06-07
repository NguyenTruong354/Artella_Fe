import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
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
  AuctionData,
  Filter
} from "../components/Auction";

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

  const liveAuctions: AuctionData[] = [
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
  const filters: Filter[] = [
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

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Featured Auction */}
              <FeaturedAuctionHero 
                featuredAuction={filteredAuctions[0]} 
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
              />

              {/* News Grid Stories */}
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
              />

              {/* Most Watched */}
              <MostWatched 
                auctions={filteredAuctions.slice(0, 3)}
                itemVariants={itemVariants}
                controls={controls}
              />

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
              <EditorsPick 
                auctions={filteredAuctions.slice(0, 3)}
                itemVariants={itemVariants}
                controls={controls}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auctions;
