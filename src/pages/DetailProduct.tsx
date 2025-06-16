import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Home,
  Volume2,
  Shield,
  Info,
  Sparkles,
  // Camera, // Removed unused import
  Tag,
  BarChart2,
  DollarSign,
  Box,
  FileCheck, // Replaced Certificate with FileCheck
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { WaveTransition } from "../components/WaveTransition";
import { productService } from "../api/services";
import { Product } from "../api/services/productService";
import SmartImage from "../components/SmartImage";

interface AudioGuideInfo {
  title: string;
  content: string;
  duration: string;
}

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [currentBid, setCurrentBid] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAudioGuide, setActiveAudioGuide] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [similarProductsLoading, setSimilarProductsLoading] = useState(false);
  
  // Dark mode hook
  const darkMode = useDarkMode();
  
  // Fetch similar products by category
  const fetchSimilarProducts = useCallback(async (category: string, currentProductId: string) => {
    try {
      setSimilarProductsLoading(true);
      console.log('🔍 Fetching similar products for category:', category);
      
      const similarProductsResponse = await productService.getProductsByCategory(category);
      
      if (similarProductsResponse.success && similarProductsResponse.data) {        // Filter out current product and limit to 3 items
        const filteredSimilarProducts = similarProductsResponse.data
          .filter(product => product.productId !== currentProductId)
          .slice(0, 3);
        
        console.log('✅ Similar products received:', filteredSimilarProducts);
        setSimilarProducts(filteredSimilarProducts);
      } else {
        console.log('❌ No similar products found');
        setSimilarProducts([]);
      }
    } catch (err) {
      console.error('❌ Error fetching similar products:', err);
      // Don't show error for similar products, just keep empty array
      setSimilarProducts([]);    
    } finally {
      setSimilarProductsLoading(false);
    }
  }, []);

  // Fetch product data from API
  const fetchProductData = useCallback(async () => {
    if (!id) {
      setError("No product ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔍 Fetching product data for ID:', id);
        const productResponse = await productService.getProductById(id);
      
      if (productResponse.success && productResponse.data) {
        console.log('✅ Product data received:', productResponse.data);
        setProductData(productResponse.data);
        
        // Fetch similar products after getting main product data
        if (productResponse.data.category) {
          fetchSimilarProducts(productResponse.data.category, productResponse.data.productId);
        }
      } else {
        setError('Product not found or unavailable');
      }
    } catch (err) {
      console.error('❌ Error fetching product data:', err);
      if (err instanceof Error && err.message.includes("not found")) {
        setError('Product not found.');
      } else {
        setError('Failed to load product data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchSimilarProducts]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    if (!isLoading) {
      controls.start("visible");
    }
  }, [controls, isLoading]);  
  
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Generate properties based on product data
  const generateProductProperties = (product: Product) => [
    { trait: "Category", value: product.category, rarity: "Standard" },
    { trait: "Status", value: product.status || "Available", rarity: "Standard" },
    { trait: "Auction", value: product.isAuction ? "Yes" : "No", rarity: "Standard" },
    { trait: "Certification", value: product.certificationId ? "Verified" : "Pending", rarity: "Premium" },
  ];

  const productProperties = productData ? generateProductProperties(productData) : [];
  
  // Audio guide sound simulation
  const playAudioGuideSound = useCallback((type: string) => {
    console.log(`🎧 Audio Guide: Playing ${type} information`);
  }, []);
  
  // Helper function to truncate long addresses (like wallet addresses)
  const truncateAddress = useCallback((address: string, startLength: number = 6, endLength: number = 4) => {
    if (!address || address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }, []);

  // Audio guide information based on product
  const audioGuideInfo: { [key: string]: AudioGuideInfo } = productData ? {
    product: {
      title: "About the Product",
      content: productData.description || "Detailed information about this product is being prepared.",
      duration: "2:34",
    },
    seller: {
      title: "About the Seller",
      content: `This product is offered by ${truncateAddress(productData.sellerAddress)}. More details about their reputation and other items are available in the marketplace.`, 
      duration: "1:48",
    },
    certification: {
      title: "Certification Details",
      content: productData.certificationId 
        ? `This product has been certified with ID: ${productData.certificationId}. The certification ensures authenticity and quality.` 
        : "This product is pending certification. Certification verifies authenticity and quality standards.",
      duration: "3:12",
    },
  } : {};

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBid) {
      console.log("Bid submitted:", currentBid);
      setCurrentBid("");
      // Here you would implement the actual bid submission logic
    }
  };

  const handleAudioGuide = (section: string) => {
    setActiveAudioGuide(activeAudioGuide === section ? null : section);
    if (activeAudioGuide !== section) {
      playAudioGuideSound(section);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-amber-300 text-sm font-medium font-serif">
              Loading product details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error && error.includes("Product not found")) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Box className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Product Not Found
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              The requested product could not be found. It might have been moved or does not exist.
            </p>
            <button
              onClick={() => navigate("/Home")}
              className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center mx-auto shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Marketplace
            </button>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Sparkles className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Product Details Temporarily Unavailable
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              We encountered an issue loading the product details: {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchProductData}
                className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Retry Loading
              </button>
              <button
                onClick={() => navigate("/Home")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (!productData) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Box className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Product Details Unavailable
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              The details for this product could not be loaded at this time.
            </p>
            <button
              onClick={() => navigate("/Home")}
              className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center mx-auto shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Marketplace
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      {/* Product Detail Layout */}
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-gray-100"
      >
        {/* Lighting Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 transition-all duration-500 bg-gradient-radial from-blue-200/20 via-blue-100/10 to-transparent dark:bg-gradient-radial dark:from-amber-200/20 dark:via-amber-100/10 dark:to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-64 h-64 transition-all duration-500 bg-gradient-radial from-purple-300/15 via-purple-200/8 to-transparent dark:bg-gradient-radial dark:from-amber-300/15 dark:via-amber-200/8 dark:to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-48 h-48 transition-all duration-500 bg-gradient-radial from-cyan-400/10 via-cyan-300/5 to-transparent dark:bg-gradient-radial dark:from-amber-400/10 dark:via-amber-300/5 dark:to-transparent rounded-full blur-xl"></div>
        </div>        
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Navigation */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-serif"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Products</span>
            <span className="sm:hidden">Back</span>
          </motion.button>

          {/* Main Product Layout */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Product Image Display */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="relative">
                {/* Product Frame */}
                <div className="relative bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-800/10 p-8 rounded-lg border-4 border-gray-300/50 dark:border-amber-700/40 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-100/20 dark:bg-gradient-radial dark:from-transparent dark:via-transparent dark:to-black/30 pointer-events-none"></div>
                  
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/50 dark:bg-black/50 shadow-2xl relative group transition-all duration-500">
                    <SmartImage
                      imageId={productData.imageIds[0]}
                      alt={productData.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-5"
                      fallbackCategory={productData.category}
                    />
                    
                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:bg-gradient-to-br dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none"></div>
                    
                    {/* Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {productData.certificationId && (
                        <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-green-500 dark:text-green-400 transition-all duration-500">
                          <Shield className="w-4 h-4" />
                        </div>
                      )}
                      {productData.isAuction && (
                        <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-purple-500 dark:text-purple-400 transition-all duration-500">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Audio Guide Button */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <motion.button
                        onClick={() => handleAudioGuide("product")}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          activeAudioGuide === "product"
                            ? "bg-blue-500 dark:bg-amber-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-amber-500/30"
                            : "bg-white/70 dark:bg-black/70 text-blue-600 dark:text-amber-300 hover:bg-blue-50 dark:hover:bg-amber-900/50"
                        }`}
                        title="Audio Guide: About this Product"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Volume2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Additional Images Carousel Indicators (if multiple images) */}
                    {productData.imageIds.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {productData.imageIds.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full ${
                              idx === 0 
                                ? "bg-blue-500 dark:bg-amber-500" 
                                : "bg-white/50 dark:bg-gray-500/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product Information Panel */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 transition-all duration-500">
                <motion.h1
                  className="text-4xl font-bold mb-3 text-gray-900 dark:text-amber-100 font-serif tracking-tight leading-tight"
                  variants={itemVariants}
                >
                  {productData.name}
                </motion.h1>
                
                <motion.p
                  className="text-lg text-gray-600 dark:text-amber-300/80 mb-6 font-sans"
                  variants={itemVariants}
                >
                  By <span 
                    className="font-semibold text-blue-600 dark:text-amber-400 cursor-pointer hover:text-blue-700 dark:hover:text-amber-300 transition-colors"
                    title={productData.sellerAddress} // Show full address on hover
                    onClick={() => {
                      navigator.clipboard.writeText(productData.sellerAddress);
                      console.log('Copied seller address to clipboard:', productData.sellerAddress);
                    }}
                  >
                    {productData.sellerAddress.startsWith('0x') 
                      ? truncateAddress(productData.sellerAddress, 6, 4)
                      : productData.sellerAddress
                    }
                  </span>
                </motion.p>

                <motion.div
                  className="flex items-center space-x-6 mb-8 text-sm text-gray-500 dark:text-amber-300/70"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-blue-500 dark:text-amber-500" />
                    <span>{productData.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500 dark:text-amber-500" />
                    <span>{new Date(productData.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
                
                {/* Price Section */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-amber-300/70 mb-2 uppercase tracking-wider font-sans">
                    {productData.isAuction ? "Current Bid" : "Price"}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-amber-400 font-serif">
                    {productData.price} ETH
                  </p>
                  
                  {/* Auction Bid Form or Buy Now Button */}
                  {productData.isAuction ? (
                    <form onSubmit={handleBidSubmit} className="mt-4 flex gap-3">
                      <input
                        type="text"
                        value={currentBid}
                        onChange={(e) => setCurrentBid(e.target.value)}
                        placeholder="Enter bid amount (e.g., 2.5 ETH)"
                        className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-amber-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 outline-none bg-white/80 dark:bg-gray-700/50 dark:text-amber-100 placeholder-gray-400 dark:placeholder-amber-500/70 transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Place Bid
                      </button>
                    </form>
                  ) : (
                    <button
                      className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      Buy Now
                    </button>
                  )}
                </motion.div>

                <motion.div className="flex space-x-3" variants={itemVariants}>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-medium">
                    <Heart className="w-5 h-5" />
                    <span>Favorite</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-medium">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </motion.div>

                {/* Product Status Badge */}
                <motion.div 
                  className="mt-6 flex justify-end"
                  variants={itemVariants}
                >
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium 
                    ${productData.status === 'Available' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}
                  >
                    {productData.status || 'Available'}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight">
              Product Details
            </h2>
            
            <div className="mb-10 prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-amber-300/90 prose-headings:font-serif prose-headings:text-gray-800 dark:prose-headings:text-amber-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-500 dark:text-amber-500" />
                Description
              </h3>
              <p className="leading-relaxed whitespace-pre-wrap">{productData.description}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-amber-200 font-serif">
                <Award className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                Product Properties
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productProperties.map((prop, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50/70 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    variants={itemVariants}
                  >
                    <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans">
                      {prop.trait}
                    </p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-amber-200 mt-1">
                      {prop.value}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-2">
                      Quality: {prop.rarity}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-amber-200 font-serif">
                <FileCheck className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
                Certification & Authentication
              </h3>
              <div className="space-y-5">                
                {[
                  {
                    label: "Product ID",
                    value: productData.productId,
                    icon: <Tag className="w-5 h-5 text-blue-500 dark:text-amber-500" />,
                  },
                  {
                    label: "Certification ID",
                    value: productData.certificationId || "Pending",
                    icon: <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />,
                  },
                  {
                    label: "Appraisal Certificate",
                    value: productData.appraisalCert || "Not Available",
                    icon: <FileCheck className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
                  },
                  {
                    label: "Listed Date",
                    value: new Date(productData.createdAt).toLocaleDateString(),
                    icon: <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
                  },
                  {
                    label: "Last Updated",
                    value: new Date(productData.updatedAt).toLocaleDateString(),
                    icon: <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50/70 dark:bg-gray-700/50 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3 text-sm font-medium text-gray-600 dark:text-amber-300/80">
                        {item.label}:
                      </span>
                    </div>
                    <span 
                      className="text-sm text-gray-800 dark:text-amber-200 font-mono break-all cursor-pointer hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
                      title={item.value} // Show value on hover
                      onClick={() => {
                        if (item.value && !item.value.includes('Not Available') && !item.value.includes('Pending')) {
                          navigator.clipboard.writeText(item.value);
                          console.log('Copied to clipboard:', item.value);
                        }
                      }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Marketplace Insights Section */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <BarChart2 className="w-8 h-8 mr-3 text-blue-500 dark:text-amber-500" />
              Marketplace Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sale Status */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Sale Type
                </p>
                <p className={`text-2xl font-semibold mt-2 ${
                  productData.isAuction 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-blue-600 dark:text-amber-400'
                }`}>
                  {productData.isAuction ? "Auction" : "Fixed Price"}
                </p>
                <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                  {productData.isAuction 
                    ? "Bid to purchase this item" 
                    : "Buy now at listed price"
                  }
                </p>
              </motion.div>

              {/* Price */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {productData.isAuction ? "Current Bid" : "Price"}
                </p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-amber-400 mt-2">
                  {productData.price} ETH
                </p>
                <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                  {productData.isAuction ? "(Current highest bid)" : "(Excluding gas fees)"}
                </p>
              </motion.div>

              {/* Status */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Status
                </p>
                <p className={`text-2xl font-semibold mt-2 ${
                  productData.status === 'Available' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-700 dark:text-amber-300'
                }`}>
                  {productData.status || "Available"}
                </p>
                <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                  Current product status
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Audio Guide Section */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <Volume2 className="w-8 h-8 mr-3 text-blue-500 dark:text-amber-500" />
              Interactive Audio Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(audioGuideInfo).map(([key, info]) => (
                <motion.button
                  key={key}
                  onClick={() => handleAudioGuide(key)}
                  className={`p-6 rounded-lg border transition-all duration-300 transform hover:-translate-y-1 ${
                    activeAudioGuide === key
                      ? "bg-blue-500 dark:bg-amber-500 text-white shadow-blue-500/40 dark:shadow-amber-500/40"
                      : "bg-gray-50/70 dark:bg-gray-700/50 border-gray-200/80 dark:border-amber-800/50 hover:shadow-md"
                  }`}
                  variants={itemVariants}
                >
                  <h4 className="text-lg font-semibold mb-2 text-left">{info.title}</h4>
                  <p className={`text-sm text-left ${activeAudioGuide === key ? 'text-blue-100 dark:text-amber-100' : 'text-gray-600 dark:text-amber-300/80'}`}>
                    Duration: {info.duration}
                  </p>
                </motion.button>
              ))}
            </div>
            {activeAudioGuide && audioGuideInfo[activeAudioGuide] && (
              <motion.div
                className="mt-6 p-6 bg-gray-100/80 dark:bg-gray-700/60 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-inner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-amber-200 font-serif">
                  {audioGuideInfo[activeAudioGuide].title}
                </h4>
                <p className="text-gray-700 dark:text-amber-300/90 leading-relaxed whitespace-pre-wrap">
                  {audioGuideInfo[activeAudioGuide].content}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Similar Products Section */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-purple-500 dark:text-purple-400" />
              Similar Products
            </h2>
            
            {/* Loading state */}
            {similarProductsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-amber-300">Loading similar products...</span>
              </div>
            )}
            
            {/* Empty state */}
            {!similarProductsLoading && similarProducts.length === 0 && (
              <div className="text-center py-12">
                <Box className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-amber-300/80">
                  No similar products found in this category yet.
                </p>
              </div>
            )}
            
            {/* Similar Products grid */}
            {!similarProductsLoading && similarProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white/80 dark:bg-gray-700/60 rounded-lg shadow-lg overflow-hidden border border-gray-200/80 dark:border-amber-800/50 group transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1.5"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <SmartImage
                        imageId={product.imageIds[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        fallbackCategory={product.category}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-amber-200 font-serif">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-amber-300/80 mb-1">
                        By {product.sellerAddress.startsWith('0x') && product.sellerAddress.length > 20 
                          ? truncateAddress(product.sellerAddress, 6, 4)
                          : product.sellerAddress
                        }
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-blue-600 dark:text-amber-400">
                          {product.price} ETH
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full 
                          ${product.isAuction 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}
                        >
                          {product.isAuction ? "Auction" : "Fixed Price"}
                        </span>
                      </div>
                      <button 
                        onClick={() => navigate(`/Home/product/${product.id}`)}
                        className="mt-4 w-full px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all duration-300 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DetailProduct;
