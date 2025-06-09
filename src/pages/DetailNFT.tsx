import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Clock,
  ExternalLink,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  ChevronRight,
  Home,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { WaveTransition } from "../components/WaveTransition";

interface NFTData {
  id: number;
  title: string;
  artist: string;
  artistAvatar: string;
  collection: string;
  description: string;
  image: string;
  price: string;
  highestBid: string;
  timeLeft: string;
  views: number;
  likes: number;
  shares: number;
  category: string;
  createdDate: string;
  blockchain: string;
  tokenId: string;
  royalties: string;
  properties: Array<{ trait: string; value: string; rarity: string }>;
  history: Array<{
    type: string;
    price: string;
    from: string;
    to: string;
    date: string;
  }>;
}

interface SimilarNFT {
  id: number;
  title: string;
  artist: string;
  image: string;
  price: string;
}

const DetailNFT: React.FC = () => {  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const [isLiked, setIsLiked] = useState(false);
  const [currentBid, setCurrentBid] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dark mode hook
  const darkMode = useDarkMode();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Start animation immediately when component mounts and loading is done
  useEffect(() => {
    if (!isLoading) {
      controls.start("visible");
    }
  }, [controls, isLoading]);
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock NFT data
  const nftData: NFTData = {
    id: parseInt(id || "1"),
    title: "Colorful Abstract Masterpiece",
    artist: "Esther Howard",
    artistAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    collection: "Digital Dreams Collection",
    description: "A vibrant and dynamic abstract piece that explores the intersection of color, form, and digital artistry. This NFT represents a unique blend of traditional artistic techniques with cutting-edge digital innovation.",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=800&fit=crop",
    price: "3.40 ETH",
    highestBid: "3.40 ETH",
    timeLeft: "02:28:25",
    views: 1247,
    likes: 89,
    shares: 23,
    category: "Digital Art",
    createdDate: "2024-01-15",
    blockchain: "Ethereum",
    tokenId: "#7234",
    royalties: "10%",
    properties: [
      { trait: "Background", value: "Abstract", rarity: "15%" },
      { trait: "Style", value: "Modern", rarity: "8%" },
      { trait: "Color Palette", value: "Vibrant", rarity: "12%" },
      { trait: "Medium", value: "Digital", rarity: "25%" },
    ],
    history: [
      { type: "Bid", price: "3.40 ETH", from: "0x1234", to: "Current", date: "2024-06-09" },
      { type: "Bid", price: "3.20 ETH", from: "0x5678", to: "0x1234", date: "2024-06-08" },
      { type: "Listed", price: "2.50 ETH", from: "Artist", to: "Market", date: "2024-06-01" },
    ],
  };

  const similarNFTs: SimilarNFT[] = [
    {
      id: 2,
      title: "Digital Harmony",
      artist: "John Doe",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop",
      price: "2.1 ETH",
    },
    {
      id: 3,
      title: "Neon Dreams",
      artist: "Jane Smith",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=300&h=300&fit=crop",
      price: "1.8 ETH",
    },
    {
      id: 4,
      title: "Cyber Vision",
      artist: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1579965342575-15475c126358?w=300&h=300&fit=crop",
      price: "4.2 ETH",
    },
  ];

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBid) {
      // Handle bid submission logic here
      console.log("Bid submitted:", currentBid);
      setCurrentBid("");
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.1,
        duration: 0.6
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

  if (isLoading) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#121212]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Loading NFT details...
            </p>
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
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:to-[#121212] dark:text-gray-100"
      >
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 dark:bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 dark:bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate("/gallery")}
              className="hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
            >
              Gallery
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {nftData.title}
            </span>
          </motion.nav>          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </motion.button>          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Image */}
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={nftData.image}
                    alt={nftData.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isLiked
                        ? "bg-red-500 text-white"
                        : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div className="space-y-6" variants={itemVariants}>
              {/* Title and Artist */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {nftData.title}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={nftData.artistAvatar}
                    alt={nftData.artist}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {nftData.artist}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {nftData.collection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{nftData.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{nftData.likes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  <span>{nftData.shares} shares</span>
                </div>
              </div>

              {/* Price and Bidding */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {nftData.highestBid}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ending in</p>
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono font-semibold">{nftData.timeLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Bid Form */}
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter bid amount (ETH)"
                      value={currentBid}
                      onChange={(e) => setCurrentBid(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-500 transition-all duration-300"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Place Bid
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                </form>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {nftData.description}
                </p>
              </div>

              {/* Properties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Properties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {nftData.properties.map((property, index) => (
                    <div
                      key={index}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {property.trait}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {property.value}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-amber-400">
                        {property.rarity} have this trait
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>          {/* History Section */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Transaction History
            </h2>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {nftData.history.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 rounded-full flex items-center justify-center">
                      {transaction.type === "Bid" ? (
                        <TrendingUp className="w-5 h-5 text-white" />
                      ) : transaction.type === "Listed" ? (
                        <Award className="w-5 h-5 text-white" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {transaction.from} → {transaction.to}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>          {/* Similar NFTs */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Similar NFTs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/nft/${nft.id}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {nft.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {nft.artist}
                    </p>
                    <p className="font-bold text-blue-600 dark:text-amber-400">
                      {nft.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DetailNFT;
