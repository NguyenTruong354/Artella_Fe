import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimationControls, useInView } from "framer-motion";
import {
  Search,
  Grid,
  List,
  RotateCw,
  X,
  Plus,
  ShoppingBag,
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
import { authService } from "../api/services/authService";
import { productService } from "../api/services/productService";
import { nftService } from "../api/services/nftService";
import SmartImage from "../components/SmartImage";

const Collections: React.FC = () => {
  const controls = useAnimationControls();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for the collections data
  const [collections, setCollections] = useState<Collection[]>([]);

  // Define interfaces for our data

  interface Collection {
    id: number;
    name: string;
    description: string;
    items: number;
    floorPrice: string;
    volume: string;
    image: string;
    verified: boolean;
    trending: boolean;
    category: string;
    creator: string;
    createdDate: string;
    background: string;
    likes: number;
    views: number;
    tags: string[];
    nftThumbnails: string[];
    creatorAvatar: string;
    totalOwners: number;
    salesVolume: string;
    topBid: string;
  }
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
  const canonicalUrl = getCanonicalUrl(searchTerm, activeFilter); // Get featured collection image for Open Graph
  const featuredImage =
    filteredCollections.length > 0
      ? filteredCollections[0].image
      : "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg";

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  // Manage history of user interaction
  useEffect(() => {
    const hasSeenHint = localStorage.getItem("collections-flip-hint-seen");
    if (hasSeenHint) {
      setHasInteracted(true);
    }
  }, []);

  // Save interaction state to localStorage
  useEffect(() => {
    if (hasInteracted) {
      localStorage.setItem("collections-flip-hint-seen", "true");
    }
  }, [hasInteracted]);

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
  // Generate structured data handled inline in SEOHead

  // We'll need effects to fetch data
  useEffect(() => {
    // Function to fetch user's collections data
    const fetchCollectionsData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, get the user profile to get wallet address
        const userProfileResponse = await authService.getUserProfile();

        if (!userProfileResponse.success || !userProfileResponse.data) {
          throw new Error("Failed to get user profile");
        }

        const userWalletAddress = userProfileResponse.data.walletAddress;

        if (!userWalletAddress) {
          throw new Error("User doesn't have a wallet address");
        }

        // Fetch products and NFTs owned by the user
        const [productsResponse, nftsData] = await Promise.all([
          productService.getProductsBySeller(userWalletAddress),
          nftService.getDigitalArtNFTsByOwner(userWalletAddress),
        ]);

        if (!productsResponse.success) {
          throw new Error("Failed to fetch products");
        }

        // Map product data to our collection format
        const productsCollections = productsResponse.data.content.map(
          (product, index) => ({
            id: index + 1,
            name: product.name,
            description: product.description,
            items: product.imageIds?.length || 1,
            floorPrice: product.price + " ETH",            volume: "0 ETH", // This would need real sales data
            image:
              product.imageIds?.length > 0
                ? product.imageIds[0] // Use the raw image ID for SmartImage
                : "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
            verified: true,
            trending: false,
            category: product.category || "Other",
            creator: userProfileResponse.data.fullName || "Anonymous",
            createdDate:
              product.createdAt || new Date().toISOString().split("T")[0],
            background:
              index % 2 === 0
                ? "from-purple-500/20 to-pink-500/20"
                : "from-blue-500/20 to-cyan-500/20",
            likes: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 10000),
            tags: [product.category || "Other"],            nftThumbnails:
              product.imageIds || [],
            creatorAvatar:
              "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
            totalOwners: 1,
            salesVolume: "0 ETH", // This would need real sales data
            topBid: product.price + " ETH",
          })
        ); // Map NFT data to our collection format
        const nftCollections = nftsData.map((nft, index) => ({
          id: productsCollections.length + index + 1,
          name: nft.name || "Untitled NFT",
          description: nft.description || "No description available",
          items: 1,
          floorPrice: nft.price ? nft.price + " ETH" : "0 ETH",
          volume: "0 ETH",          image:
            nft.imageUrl ||
            "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
          verified: nft.reported ? false : true,
          trending: nft.likeCount > 50 ? true : false,
          category: nft.category || "Digital Art",
          creator:
            nft.creator || userProfileResponse.data.fullName || "Anonymous",
          createdDate:
            nft.createdAt?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          background:
            index % 2 === 0
              ? "from-green-500/20 to-emerald-500/20"
              : "from-orange-500/20 to-red-500/20",
          likes: nft.likeCount || Math.floor(Math.random() * 1000),
          views: nft.viewCount || Math.floor(Math.random() * 10000),
          tags: nft.tags || [nft.category || "Digital Art"],          nftThumbnails: [
            nft.imageUrl ||
            "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
          ],
          creatorAvatar:
            "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527214/background_3_wif3cl.jpg",
          totalOwners: 1,
          salesVolume: "0 ETH",
          topBid: nft.price ? nft.price + " ETH" : "0 ETH",
        }));

        // Combine both collections
        const combinedCollections = [...productsCollections, ...nftCollections];
        setCollections(combinedCollections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch collections"
        );
        // Set empty collections to avoid errors in the UI
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchCollectionsData();
  }, []);
  // Generate structured data for SEO
  // SEO data is handled inline in the SEOHead component
  return (
    <>
      {/* CSS để giải quyết vấn đề z-index và background che phủ */}
      <style>{`
        /* Đảm bảo các phần tử hiển thị */
        .collections-page {
          position: relative;
          isolation: isolate;
          z-index: 0;
        }
        
        /* Đảm bảo các card hiển thị đúng */
        .collection-card {
          position: relative;
          z-index: 10;
        }

        /* Đảm bảo phần tử grid không bị che */
        .collection-grid {
          position: relative;
          z-index: 5;
        }

        /* Đảm bảo form hiển thị ổn định */
        .bg-white, .dark\\:bg-gray-800, .dark\\:bg-gray-900 {
          background-color: var(--bg-color, white) !important;
          position: relative;
          z-index: 5;
        }

        .dark .bg-white {
          --bg-color: rgb(31 41 55) !important;
        }
        
        /* Đảm bảo tất cả nội dung hiển thị */
        .collection-content * {
          position: relative !important;
          z-index: inherit !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
      {/* SEO Head */}{" "}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={featuredImage}
        canonical={canonicalUrl}
        structuredData={generateCollectionsStructuredData(filteredCollections)}
      />{" "}
      <div className="collections-page min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-[#0A0A1F] dark:via-[#121230] dark:to-[#1A1A35] pt-20 pb-32 px-4 md:px-8">
        <motion.main
          ref={sectionRef}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="container mx-auto collection-content"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent dark:border-amber-500 dark:border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-300">
                Loading your collections...
              </h2>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">
                Something went wrong
              </h2>
              <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center mx-auto"
              >
                <RotateCw size={18} className="mr-2" /> Try Again
              </button>
            </div>
          ) : collections.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                No collections found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You don't have any NFT collections or products yet. Start
                creating NFTs or listing products to build your collection.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/create-nft"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-full flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Create NFT
                </Link>
                <Link
                  to="/sell-art"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 px-6 rounded-full flex items-center"
                >
                  <ShoppingBag size={18} className="mr-2" /> List Product
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Collection Hero */}
              <motion.header
                variants={heroVariants}
                className="mb-12 text-center"
              >
                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-amber-500 dark:to-orange-500">
                  Your Collections
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                  Browse through your NFTs and products. Create, collect, and
                  trade unique digital assets and physical products.
                </p>
              </motion.header>
              {/* Search and Filter */}
              <motion.div variants={itemVariants} className="mb-10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search collections by name or creator"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-2 rounded-l-xl border flex items-center gap-2 transition-all ${
                        viewMode === "grid"
                          ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-500"
                          : "bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid size={20} />
                      <span className="hidden sm:inline">Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-2 rounded-r-xl border-t border-b border-r flex items-center gap-2 transition-all ${
                        viewMode === "list"
                          ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-500"
                          : "bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                      }`}
                      aria-label="List view"
                    >
                      <List size={20} />
                      <span className="hidden sm:inline">List</span>
                    </button>
                  </div>
                </div>
              </motion.div>
              {/* Category Filter Pills */}
              <motion.div
                variants={itemVariants}
                className="mb-8 overflow-x-auto pb-2"
              >
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all ${
                        activeFilter === category
                          ? "bg-blue-600 dark:bg-amber-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {category === "all" ? "All Collections" : category}
                    </button>
                  ))}
                </div>
              </motion.div>{" "}
              {/* Collections Grid */}
              {filteredCollections.length > 0 ? (
                <motion.div
                  variants={itemVariants}
                  className={`collection-grid grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {/* Collection cards would be here */}
                  {filteredCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className="collection-card bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col"
                    >
                      <div className="relative">
                        {collection.image && collection.image.startsWith('http') ? (
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <SmartImage
                            imageId={collection.image || "default"}
                            alt={collection.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                            fallbackCategory={collection.category.toLowerCase()}
                            lazyLoad={true}
                            priority={false}
                          />
                        )}
                        
                        {/* Thumbnail previews if collection has multiple images */}
                        {collection.nftThumbnails && collection.nftThumbnails.length > 1 && (
                          <div className="absolute bottom-6 right-2 flex -space-x-2">
                            {collection.nftThumbnails.slice(1, 4).map((thumbnail, idx) => (
                              <div key={`${collection.id}-thumb-${idx}`} className="w-8 h-8 rounded-md border-2 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                                {thumbnail && thumbnail.startsWith('http') ? (
                                  <img 
                                    src={thumbnail} 
                                    alt={`${collection.name} thumbnail ${idx+1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <SmartImage
                                    imageId={thumbnail || "default"}
                                    alt={`${collection.name} thumbnail ${idx+1}`}
                                    className="w-full h-full object-cover"
                                    fallbackCategory={collection.category.toLowerCase()}
                                    lazyLoad={true}
                                  />
                                )}
                              </div>
                            ))}
                            {collection.nftThumbnails.length > 4 && (
                              <div className="w-8 h-8 rounded-md bg-gray-800 dark:bg-gray-700 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800 shadow-lg">
                                +{collection.nftThumbnails.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {collection.name}
                        </h3>
                        {collection.verified && (
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {collection.description}
                      </p>
                      
                      {/* Creator info with avatar */}
                      <div className="flex items-center mb-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          {collection.creatorAvatar && collection.creatorAvatar.startsWith('http') ? (
                            <img 
                              src={collection.creatorAvatar} 
                              alt={collection.creator}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <SmartImage
                              imageId={collection.creatorAvatar || collection.creator}
                              alt={collection.creator}
                              className="w-full h-full object-cover"
                              fallbackCategory="avatar"
                              lazyLoad={true}
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Created by <span className="font-medium">{collection.creator}</span></span>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-auto">
                        <span>{collection.items} items</span>
                        <span>Floor: {collection.floorPrice}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    No matching collections
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We couldn't find any collections matching your current
                    filters.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchTerm("");
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-amber-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-amber-700 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Clear Filters
                  </button>
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
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.main>{" "}
      </div>
    </>
  );
};

export default Collections;
