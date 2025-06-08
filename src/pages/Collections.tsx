import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Star,
  TrendingUp,
  Users,
  Eye,
  Filter,
  Search,
  Grid,
  List,
  Info,
  ExternalLink,
  Heart,
  Grid3X3,
  Activity,
  Crown,
  Share2,
  HelpCircle,
  RotateCw,
  X,
} from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import SEOHead from "../components/SEO/SEOHead";
import {
  generateCollectionsStructuredData,
  generateSEOTitle,
  generateSEODescription,
  generateKeywords,
  getCanonicalUrl,
} from "../utils/seo";
import "../styles/cardFlip.css";

const Collections: React.FC = () => {
  const controls = useAnimationControls();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showFlipHint, setShowFlipHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const collections = [
    {
      id: 1,
      name: "Digital Dreams",
      description:
        "A collection of surreal digital artworks exploring the boundaries of imagination and reality through digital mediums",
      items: 125,
      floorPrice: "0.5 ETH",
      volume: "234 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
      verified: true,
      trending: true,
      category: "Digital Art",
      creator: "Alex Storm",
      createdDate: "2024-01-15",
      background: "from-purple-500/20 to-pink-500/20",
      likes: 1245,
      views: 15680,
      tags: ["Digital", "Abstract", "Surreal"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
      totalOwners: 89,
      salesVolume: "234.5 ETH",
      topBid: "2.1 ETH",
    },
    {
      id: 2,
      name: "Abstract Realities",
      description:
        "Modern abstract art pieces that challenge perception and reality through innovative visual storytelling",
      items: 89,
      floorPrice: "0.8 ETH",
      volume: "189 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
      verified: true,
      trending: false,
      category: "Abstract",
      creator: "Maya Chen",
      createdDate: "2024-02-10",
      background: "from-blue-500/20 to-cyan-500/20",
      likes: 892,
      views: 12340,
      tags: ["Abstract", "Modern", "Artistic"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
      totalOwners: 67,
      salesVolume: "189.3 ETH",
      topBid: "1.8 ETH",
    },
    {
      id: 3,
      name: "Crypto Landscapes",
      description:
        "Beautiful landscapes reimagined through blockchain technology and digital transformation processes",
      items: 67,
      floorPrice: "1.2 ETH",
      volume: "312 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
      verified: false,
      trending: true,
      category: "Landscape",
      creator: "David Park",
      createdDate: "2024-03-05",
      background: "from-green-500/20 to-emerald-500/20",
      likes: 567,
      views: 8920,
      tags: ["Landscape", "Nature", "Blockchain"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
      totalOwners: 45,
      salesVolume: "312.7 ETH",
      topBid: "2.8 ETH",
    },
    {
      id: 4,
      name: "Mystic Portraits",
      description:
        "Ethereal portrait collection capturing the essence of human emotion through mystical artistic interpretation",
      items: 156,
      floorPrice: "2.1 ETH",
      volume: "456 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
      verified: true,
      trending: false,
      category: "Portrait",
      creator: "Elena Voss",
      createdDate: "2024-01-20",
      background: "from-orange-500/20 to-red-500/20",
      likes: 2134,
      views: 23450,
      tags: ["Portrait", "Mystical", "Emotional"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
      totalOwners: 123,
      salesVolume: "456.9 ETH",
      topBid: "4.2 ETH",
    },
    {
      id: 5,
      name: "Future Cities",
      description:
        "Visionary cityscapes depicting the future of urban living through architectural imagination and digital artistry",
      items: 203,
      floorPrice: "1.8 ETH",
      volume: "567 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
      verified: true,
      trending: true,
      category: "Architecture",
      creator: "Kai Zhang",
      createdDate: "2024-02-28",
      background: "from-indigo-500/20 to-purple-500/20",
      likes: 1876,
      views: 19780,
      tags: ["Architecture", "Future", "Urban"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
      totalOwners: 156,
      salesVolume: "567.2 ETH",
      topBid: "3.5 ETH",
    },
    {
      id: 6,
      name: "Ocean Depths",
      description:
        "Underwater worlds brought to life through artistic vision, exploring the mysteries of the deep sea",
      items: 91,
      floorPrice: "0.9 ETH",
      volume: "178 ETH",
      image:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
      verified: false,
      trending: false,
      category: "Nature",
      creator: "Marina Blue",
      createdDate: "2024-03-15",
      background: "from-teal-500/20 to-blue-500/20",
      likes: 743,
      views: 9240,
      tags: ["Ocean", "Nature", "Mysterious"],
      nftThumbnails: [
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527229/background_2_dhvm4o.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527228/background_1_rinkqa.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527227/background_4_ik77ls.jpg",
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_5_jth6qh.webp",
      ],
      creatorAvatar:
        "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527233/background_9_kpnd1e.jpg",
      totalOwners: 62,
      salesVolume: "178.4 ETH",
      topBid: "1.7 ETH",
    },
  ];

  const categories = [
    "all",
    "Digital Art",
    "Abstract",
    "Landscape",
    "Portrait",
    "Architecture",
    "Nature",
  ];

  const filteredCollections = collections.filter((collection) => {
    const matchesFilter =
      activeFilter === "all" || collection.category === activeFilter;
    const matchesSearch =
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.creator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // SEO-related computed values
  const seoTitle = generateSEOTitle(searchTerm, activeFilter);
  const seoDescription = generateSEODescription(
    searchTerm,
    activeFilter,
    filteredCollections.length
  );
  const seoKeywords = generateKeywords(
    activeFilter,
    searchTerm,
    filteredCollections.slice(0, 5)
  );
  const canonicalUrl = getCanonicalUrl(searchTerm, activeFilter);

  // Get featured collection image for Open Graph
  const featuredImage =
    filteredCollections.length > 0
      ? filteredCollections[0].image
      : "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg";

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Manage hint visibility based on user interaction history
  useEffect(() => {
    const hasSeenHint = localStorage.getItem("collections-flip-hint-seen");
    if (hasSeenHint) {
      setShowFlipHint(false);
      setHasInteracted(true);
    }
  }, []);

  // Save interaction state to localStorage
  useEffect(() => {
    if (hasInteracted) {
      localStorage.setItem("collections-flip-hint-seen", "true");
    }
  }, [hasInteracted]); // Handle keyboard navigation for card flip
  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    collectionId: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (viewMode === "grid") {
        const isOpening = activeCard !== collectionId;
        setActiveCard(activeCard === collectionId ? null : collectionId);
        setHasInteracted(true);
        setShowFlipHint(false);

        // Announce the action to screen readers
        const collection = collections.find((c) => c.id === collectionId);
        if (collection) {
          const announcement = isOpening
            ? `Opened detailed view for ${collection.name} collection. Showing NFT thumbnails, statistics, and creator information.`
            : `Closed detailed view for ${collection.name} collection. Returned to collection overview.`;

          // Create a temporary announcement element
          const announcer = document.createElement("div");
          announcer.setAttribute("aria-live", "assertive");
          announcer.setAttribute("aria-atomic", "true");
          announcer.className = "sr-only";
          announcer.textContent = announcement;
          document.body.appendChild(announcer);

          // Remove after announcement
          setTimeout(() => {
            document.body.removeChild(announcer);
          }, 1000);
        }
      }
    }
  };

  // Animation variants with reduced motion support
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
    },
  };

  const itemVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.2 }
        : {
            type: "spring",
            stiffness: 300,
            damping: 24,
          },
    },
  };

  const heroVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.3 }
        : {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8,
          },
    },
  };

  // Generate structured data
  const structuredData = generateCollectionsStructuredData(
    filteredCollections,
    searchTerm,
    activeFilter
  );

  return (
    <>
      {/* SEO Head */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={featuredImage}
        canonical={canonicalUrl}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] text-gray-800 dark:text-gray-200 transition-all duration-300">
        {" "}
        {/* Floating background elements - Epilepsy-safe with reduced motion support */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl bg-gradient-to-r from-blue-400/10 to-purple-500/10 dark:from-amber-400/10 dark:to-orange-500/10"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
            style={{
              opacity: prefersReducedMotion ? 0.5 : 1,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-64 h-64 rounded-full blur-3xl bg-gradient-to-r from-pink-400/10 to-red-500/10 dark:from-blue-400/10 dark:to-purple-500/10"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 0.8, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
            style={{
              opacity: prefersReducedMotion ? 0.5 : 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full blur-2xl bg-gradient-to-r from-green-400/10 to-cyan-500/10 dark:from-purple-400/10 dark:to-pink-500/10"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
            style={{
              opacity: prefersReducedMotion ? 0.5 : 1,
            }}
          />
        </div>
        {/* Skip Links for Accessibility */}
        <div className="sr-only focus-within:not-sr-only">
          <a
            href="#main-content"
            className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to main content
          </a>
          <a
            href="#search-section"
            className="fixed top-4 left-40 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to search
          </a>
          <a
            href="#collections-grid"
            className="fixed top-4 left-72 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to collections
          </a>
        </div>
        <motion.main
          id="main-content"
          ref={sectionRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          role="main"
          aria-label="NFT Collections"
        >
          {/* Hero Section */}
          <motion.div variants={heroVariants} className="text-center mb-16">
            <motion.div
              className="relative inline-block mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-amber-400 dark:via-orange-500 dark:to-red-500 bg-clip-text text-transparent tracking-tight leading-tight">
                NFT Collections
              </h1>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-amber-500 dark:to-orange-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p
              className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8"
              variants={itemVariants}
            >
              Discover extraordinary digital art collections from the world's
              most innovative creators
            </motion.p>{" "}
            {/* Search and Filter Section */}
            <motion.section
              id="search-section"
              variants={itemVariants}
              className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              aria-label="Search and filter NFT collections"
            >
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search collections or creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all duration-200"
                  aria-label="Search NFT collections by name or creator"
                  role="searchbox"
                />
              </div>

              {/* Category Filter */}
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter collections by category"
              >
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === category
                        ? "bg-blue-500 dark:bg-amber-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                    aria-pressed={activeFilter === category}
                    aria-label={`Filter by ${
                      category === "all" ? "all categories" : category
                    } category`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </motion.button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1"
                role="group"
                aria-label="Choose view mode"
              >
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : ""
                  }`}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                  aria-pressed={viewMode === "grid"}
                  aria-label="Grid view mode"
                >
                  <Grid className="w-4 h-4" aria-hidden="true" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 shadow-sm"
                      : ""
                  }`}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                  aria-pressed={viewMode === "list"}
                  aria-label="List view mode"
                >
                  <List className="w-4 h-4" aria-hidden="true" />
                </motion.button>{" "}
              </div>
            </motion.section>
          </motion.div>{" "}
          {/* Interactive Hint Banner */}
          <AnimatePresence>
            {showFlipHint && viewMode === "grid" && (
              <motion.section
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-8 mx-auto max-w-4xl"
                role="region"
                aria-label="Card interaction instructions"
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-amber-500/10 dark:to-orange-500/10 backdrop-blur-sm border border-blue-500/20 dark:border-amber-500/20 rounded-2xl p-4 relative overflow-hidden">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-amber-500/5 dark:to-orange-500/5"
                    animate={{
                      background: [
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                        "linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
                        "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 bg-blue-500/20 dark:bg-amber-500/20 rounded-full"
                        animate={{
                          rotate: prefersReducedMotion ? 0 : [0, 180, 360],
                        }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : 2,
                          repeat: prefersReducedMotion ? 0 : Infinity,
                          ease: "linear",
                        }}
                        aria-hidden="true"
                      >
                        <RotateCw className="w-6 h-6 text-blue-600 dark:text-amber-600" />
                      </motion.div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-blue-700 dark:text-amber-400">
                            💡 Pro Tip: Interactive Cards
                          </h3>
                          <motion.div
                            animate={{
                              scale: prefersReducedMotion ? 1 : [1, 1.2, 1],
                            }}
                            transition={{
                              duration: prefersReducedMotion ? 0 : 1.5,
                              repeat: prefersReducedMotion ? 0 : Infinity,
                            }}
                            aria-hidden="true"
                          >
                            <HelpCircle className="w-4 h-4 text-blue-500 dark:text-amber-500" />
                          </motion.div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          <span className="hidden sm:inline">
                            <strong>Desktop:</strong> Hover over cards to reveal
                            detailed info •
                            <strong className="ml-2">Keyboard:</strong> Use Tab
                            to navigate and Enter/Space to flip cards •
                            <strong className="ml-2">Mobile:</strong> Tap cards
                            to flip them
                          </span>
                          <span className="sm:hidden">
                            <strong>Tap cards</strong> to see detailed NFT info
                            and statistics.
                            <strong>Use keyboard</strong> navigation with Tab
                            and Enter keys.
                          </span>
                        </p>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => {
                        setShowFlipHint(false);
                        setHasInteracted(true);
                      }}
                      className="ml-4 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500"
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                      aria-label="Close interaction instructions"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}{" "}
          </AnimatePresence>
          {/* Search Results Announcement */}
          <div
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            {searchTerm &&
              `Found ${filteredCollections.length} collection${
                filteredCollections.length !== 1 ? "s" : ""
              } matching "${searchTerm}"`}
            {activeFilter !== "all" &&
              !searchTerm &&
              `Showing ${filteredCollections.length} collection${
                filteredCollections.length !== 1 ? "s" : ""
              } in ${activeFilter} category`}
            {activeFilter !== "all" &&
              searchTerm &&
              ` in ${activeFilter} category`}
          </div>
          {/* Collections Grid/List */}{" "}
          <motion.div
            id="collections-grid"
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-12"
                : "space-y-6"
            } transition-all duration-300`}
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              {" "}
              {filteredCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  layout
                  className={`group relative ${
                    viewMode === "grid"
                      ? `aspect-[4/5] card-flip-container ${
                          activeCard === collection.id ? "active" : ""
                        }`
                      : "h-32 flex items-center"
                  } ${
                    viewMode === "grid"
                      ? "cursor-pointer focus:outline-none rounded-2xl" // Removed focus:ring classes
                      : ""
                  }`}
                  variants={itemVariants}
                  whileHover={{
                    scale:
                      viewMode === "grid"
                        ? prefersReducedMotion
                          ? 1
                          : 1.02
                        : prefersReducedMotion
                        ? 1
                        : 1.01,
                    y:
                      viewMode === "grid"
                        ? prefersReducedMotion
                          ? 0
                          : -8
                        : prefersReducedMotion
                        ? 0
                        : -2,
                  }}
                  onClick={() => {
                    if (viewMode === "grid") {
                      setActiveCard(
                        activeCard === collection.id ? null : collection.id
                      );
                      setHasInteracted(true);
                      setShowFlipHint(false);
                    }
                  }}
                  onKeyDown={(e) => handleCardKeyDown(e, collection.id)}
                  tabIndex={viewMode === "grid" ? 0 : -1}
                  role={viewMode === "grid" ? "button" : "article"}
                  aria-label={
                    viewMode === "grid"
                      ? `${
                          activeCard === collection.id ? "Hide" : "Show"
                        } details for ${collection.name} collection by ${
                          collection.creator
                        }. Press Enter or Space to ${
                          activeCard === collection.id ? "close" : "flip"
                        } card.`
                      : `${collection.name} collection by ${collection.creator}`
                  }
                  aria-expanded={
                    viewMode === "grid"
                      ? activeCard === collection.id
                      : undefined
                  }
                  aria-describedby={`collection-${collection.id}-description`}
                >
                  {/* Hidden description for screen readers */}
                  <div
                    id={`collection-${collection.id}-description`}
                    className="sr-only"
                  >
                    {collection.description}. Contains {collection.items} items
                    with floor price {collection.floorPrice}.
                    {collection.verified ? "Verified collection. " : ""}
                    {collection.trending ? "Currently trending. " : ""}
                    Created by {collection.creator}. Total volume:{" "}
                    {collection.volume}.
                  </div>

                  {/* Live region for screen reader announcements */}
                  <div
                    className="sr-only"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {viewMode === "grid" &&
                      activeCard === collection.id &&
                      `Detailed view opened for ${collection.name} collection. Showing NFT thumbnails, statistics, and additional information.`}
                  </div>

                  {/* Interactive Hint Overlay for Grid Cards */}
                  {viewMode === "grid" && !hasInteracted && index < 2 && (
                    <motion.div
                      className="absolute top-4 right-4 z-20 pointer-events-none"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.3 + 1.5 }}
                    >
                      <motion.div
                        className="bg-blue-500 dark:bg-amber-500 text-white p-2 rounded-full shadow-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            "0 4px 6px rgba(0, 0, 0, 0.1)",
                            "0 8px 25px rgba(59, 130, 246, 0.4)",
                            "0 4px 6px rgba(0, 0, 0, 0.1)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <RotateCw className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* 3D Card Container for Grid View */}
                  {viewMode === "grid" ? (
                    <div className="card-flip-inner">
                      {/* Front Side of Card */}
                      <div className="card-front">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${collection.background} opacity-60`}
                          />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                          {collection.verified && (
                            <motion.div
                              className="bg-blue-500 dark:bg-amber-500 text-white p-2 rounded-full shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </motion.div>
                          )}
                          {collection.trending && (
                            <motion.div
                              className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <TrendingUp className="w-3 h-3" />
                              TRENDING
                            </motion.div>
                          )}
                        </div>

                        {/* Front Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                          <motion.div
                            className="space-y-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 dark:group-hover:text-amber-300 transition-colors duration-300">
                                {collection.name}
                              </h3>
                              <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">
                                {collection.description.substring(0, 80)}...
                              </p>
                            </div>

                            <div className="flex items-center text-gray-300 text-sm gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{collection.items} items</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>by {collection.creator}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 py-4 bg-black/20 backdrop-blur-sm rounded-xl">
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Items</p>
                                <p className="font-bold text-white">
                                  {collection.items}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Floor </p>
                                <p className="font-bold text-blue-300 dark:text-amber-300">
                                  {collection.floorPrice}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-300 text-xs">Volume</p>
                                <p className="font-bold text-green-300">
                                  {" "}
                                  {collection.volume}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>{" "}
                      {/* Back Side of Card */}
                      <div className="card-back bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                        <div
                          className="absolute inset-0 p-4 flex flex-col h-full overflow-y-auto z-10"
                          role="complementary"
                          aria-label={`Detailed information for ${collection.name} collection`}
                        >
                          {/* Header with Creator Info */}
                          <header className="flex items-center justify-between mb-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <img
                                src={collection.creatorAvatar}
                                alt={`${collection.creator} profile picture`}
                                className="w-8 h-8 rounded-full border-2 border-blue-400 dark:border-amber-400"
                              />
                              <div>
                                <h3 className="text-base font-bold text-white leading-tight">
                                  {collection.name}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  by {collection.creator}
                                </p>
                              </div>
                            </div>
                            <Info
                              className="w-4 h-4 text-blue-400 dark:text-amber-400 flex-shrink-0"
                              aria-hidden="true"
                            />
                          </header>
                          {/* NFT Thumbnails Grid (3x2 layout) */}
                          <section
                            className="mb-3 flex-shrink-0"
                            aria-labelledby={`collection-${collection.id}-featured-heading`}
                          >
                            <h4
                              id={`collection-${collection.id}-featured-heading`}
                              className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1"
                            >
                              <Grid3X3 className="w-3 h-3" aria-hidden="true" />
                              Featured NFTs
                            </h4>
                            <div
                              className="grid grid-cols-3 gap-1.5"
                              role="group"
                              aria-label="Collection NFT previews"
                            >
                              {collection.nftThumbnails
                                .slice(0, 6)
                                .map((thumbnail, idx) => (
                                  <motion.div
                                    key={idx}
                                    className="relative aspect-square rounded-md overflow-hidden group cursor-pointer"
                                    whileHover={{
                                      scale: prefersReducedMotion ? 1 : 1.05,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    role="img"
                                    aria-label={`NFT ${idx + 1} from ${
                                      collection.name
                                    } collection`}
                                  >
                                    <img
                                      src={thumbnail}
                                      alt={`NFT ${idx + 1} from ${
                                        collection.name
                                      }`}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                                    <div className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-xs px-1 py-0.5 rounded">
                                      #{idx + 1}
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </section>{" "}
                          {/* Enhanced Statistics */}
                          <section
                            className="mb-3 flex-grow"
                            aria-labelledby={`collection-${collection.id}-stats-heading`}
                          >
                            <h4
                              id={`collection-${collection.id}-stats-heading`}
                              className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1"
                            >
                              <TrendingUp
                                className="w-3 h-3"
                                aria-hidden="true"
                              />
                              Statistics
                            </h4>
                            <div
                              className="grid grid-cols-2 gap-2"
                              role="group"
                              aria-labelledby={`collection-${collection.id}-stats-heading`}
                            >
                              <div
                                className="bg-blue-500/10 dark:bg-amber-500/10 rounded-lg p-2 border border-blue-500/20 dark:border-amber-500/20"
                                role="region"
                                aria-label="Owner count"
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Users
                                    className="w-3 h-3 text-blue-400 dark:text-amber-400"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs text-gray-400">
                                    Owners
                                  </span>
                                </div>
                                <p className="text-white font-bold text-sm">
                                  {collection.totalOwners}
                                </p>
                              </div>
                              <div
                                className="bg-green-500/10 rounded-lg p-2 border border-green-500/20"
                                role="region"
                                aria-label="Sales volume"
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Activity
                                    className="w-3 h-3 text-green-400"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs text-gray-400">
                                    Volume
                                  </span>
                                </div>
                                <p className="text-white font-bold text-sm">
                                  {collection.salesVolume}
                                </p>
                              </div>
                              <div
                                className="bg-purple-500/10 rounded-lg p-2 border border-purple-500/20"
                                role="region"
                                aria-label="Top bid amount"
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Crown
                                    className="w-3 h-3 text-purple-400"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs text-gray-400">
                                    Top Bid
                                  </span>
                                </div>
                                <p className="text-white font-bold text-sm">
                                  {collection.topBid}
                                </p>
                              </div>
                              <div
                                className="bg-pink-500/10 rounded-lg p-2 border border-pink-500/20"
                                role="region"
                                aria-label="Like count"
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <Heart
                                    className="w-3 h-3 text-pink-400"
                                    aria-hidden="true"
                                  />
                                  <span className="text-xs text-gray-400">
                                    Likes
                                  </span>
                                </div>
                                <p className="text-white font-bold text-sm">
                                  {collection.likes.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </section>{" "}
                          {/* Tags */}
                          <section
                            className="flex-shrink-0"
                            aria-labelledby={`collection-${collection.id}-tags-heading`}
                          >
                            <h5
                              id={`collection-${collection.id}-tags-heading`}
                              className="sr-only"
                            >
                              Collection Tags
                            </h5>
                            <div
                              className="flex flex-wrap gap-1"
                              role="list"
                              aria-label="Collection tags"
                            >
                              {collection.tags
                                .slice(0, 4)
                                .map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-amber-500/20 dark:to-orange-500/20 text-blue-300 dark:text-amber-300 rounded-full text-xs border border-blue-500/30 dark:border-amber-500/30"
                                    role="listitem"
                                    aria-label={`Tag: ${tag}`}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>
                          </section>
                          {/* Action Buttons */}
                          <nav
                            className="flex gap-2 mt-2 flex-shrink-0"
                            aria-label="Collection actions"
                          >
                            <motion.button
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-amber-500 dark:to-orange-500 text-white font-bold py-2 px-3 rounded-lg hover:shadow-xl transition-all duration-300 text-xs flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                              whileHover={{
                                scale: prefersReducedMotion ? 1 : 1.02,
                              }}
                              whileTap={{
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              aria-label={`View ${collection.name} collection details`}
                            >
                              <ExternalLink
                                className="w-3 h-3"
                                aria-hidden="true"
                              />
                              View
                            </motion.button>
                            <motion.button
                              className="px-2 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                              whileHover={{
                                scale: prefersReducedMotion ? 1 : 1.02,
                              }}
                              whileTap={{
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              aria-label={`Like ${collection.name} collection`}
                            >
                              <Heart className="w-3 h-3" aria-hidden="true" />
                            </motion.button>
                            <motion.button
                              className="px-2 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                              whileHover={{
                                scale: prefersReducedMotion ? 1 : 1.02,
                              }}
                              whileTap={{
                                scale: prefersReducedMotion ? 1 : 0.98,
                              }}
                              aria-label={`Share ${collection.name} collection`}
                            >
                              <Share2 className="w-3 h-3" aria-hidden="true" />
                            </motion.button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="bg-gradient-to-r from-white/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg focus:outline-none"> {/* Removed focus:ring styles */}
                      <div className="flex items-center w-full gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                              {collection.name}
                            </h3>
                            {collection.verified && (
                              <Star className="w-4 h-4 text-blue-400 dark:text-amber-400 fill-current" />
                            )}
                            {collection.trending && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                HOT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            by {collection.creator}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>{collection.items} items</span>
                            <span>Floor: {collection.floorPrice}</span>
                            <span>Volume: {collection.volume}</span>
                          </div>
                        </div>

                        <motion.button
                          className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-amber-500 dark:to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {/* Load More Section */}
          {filteredCollections.length > 0 && (
            <motion.div className="mt-16 text-center" variants={itemVariants}>
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-amber-500 dark:to-orange-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform-gpu"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More Collections
              </motion.button>
            </motion.div>
          )}
          {/* Empty State */}
          {filteredCollections.length === 0 && (
            <motion.div className="text-center py-20" variants={itemVariants}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <Filter className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                No Collections Found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to discover amazing
                collections.
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
                className="bg-blue-500 dark:bg-amber-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
          {/* Stats Section */}
          <motion.div
            className="mt-20 bg-gradient-to-r from-white/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-500 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                  {collections.length}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Total Collections
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-green-500 to-cyan-500 dark:from-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
                  {collections.reduce((sum, c) => sum + c.items, 0)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Total Items
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 dark:from-blue-500 dark:to-cyan-500 bg-clip-text text-transparent">
                  {collections.filter((c) => c.verified).length}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Verified
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 dark:from-green-500 dark:to-emerald-500 bg-clip-text text-transparent">
                  {collections.filter((c) => c.trending).length}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Trending
                </p>{" "}
              </div>{" "}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default Collections;
