import React, { useEffect, useRef, useState } from "react";
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
  ChevronRight,
  Home,
  Volume2,
  MessageSquare,
  Shield,
  Info,
  Sparkles,
  Camera,
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

interface VisitorComment {
  id: number;
  name: string;
  location: string;
  comment: string;
  rating: number;
  date: string;
  avatar?: string;
}

interface AudioGuideInfo {
  title: string;
  content: string;
  duration: string;
}

const DetailNFT: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [currentBid, setCurrentBid] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeAudioGuide, setActiveAudioGuide] = useState<string | null>(null);
  const [visitorComments, setVisitorComments] = useState<VisitorComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentLocation, setNewCommentLocation] = useState("");

  // Dark mode hook
  const darkMode = useDarkMode();

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
    artistAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    collection: "Digital Dreams Collection",
    description:
      "A vibrant and dynamic abstract piece that explores the intersection of color, form, and digital artistry. This NFT represents a unique blend of traditional artistic techniques with cutting-edge digital innovation.",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=800&fit=crop",
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
      {
        type: "Bid",
        price: "3.40 ETH",
        from: "0x1234",
        to: "Current",
        date: "2024-06-09",
      },
      {
        type: "Bid",
        price: "3.20 ETH",
        from: "0x5678",
        to: "0x1234",
        date: "2024-06-08",
      },
      {
        type: "Listed",
        price: "2.50 ETH",
        from: "Artist",
        to: "Market",
        date: "2024-06-01",
      },
    ],
  };

  const similarNFTs: SimilarNFT[] = [
    {
      id: 2,
      title: "Digital Harmony",
      artist: "John Doe",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop",
      price: "2.1 ETH",
    },
    {
      id: 3,
      title: "Neon Dreams",
      artist: "Jane Smith",
      image:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=300&h=300&fit=crop",
      price: "1.8 ETH",
    },
    {
      id: 4,
      title: "Cyber Vision",
      artist: "Mike Johnson",
      image:
        "https://images.unsplash.com/photo-1579965342575-15475c126358?w=300&h=300&fit=crop",
      price: "4.2 ETH",
    },
  ];

  // Mock visitor comments data
  const mockVisitorComments: VisitorComment[] = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      location: "New York, USA",
      comment:
        "A masterful blend of traditional techniques with digital innovation. The color harmony is particularly striking.",
      rating: 5,
      date: "2024-06-08",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Professor James Wilson",
      location: "London, UK",
      comment:
        "This piece represents a significant evolution in digital art. The artist's vision is both bold and sophisticated.",
      rating: 5,
      date: "2024-06-07",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      location: "Barcelona, Spain",
      comment:
        "Breathtaking work that captures the essence of modern digital expression. A true gem in contemporary art.",
      rating: 4,
      date: "2024-06-06",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    },
  ];

  // Audio guide information
  const audioGuideInfo: { [key: string]: AudioGuideInfo } = {
    artwork: {
      title: "About the Artwork",
      content:
        "This digital masterpiece showcases the intersection of traditional artistry and modern technology...",
      duration: "2:34",
    },
    artist: {
      title: "Meet the Artist",
      content:
        "Esther Howard is renowned for her innovative approach to digital art creation...",
      duration: "1:48",
    },
    technique: {
      title: "Artistic Technique",
      content:
        "The piece employs advanced digital layering techniques combined with classical color theory...",
      duration: "3:12",
    },
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentBid) {
      console.log("Bid submitted:", currentBid);
      setCurrentBid("");
    }
  };

  const handleAudioGuide = (section: string) => {
    setActiveAudioGuide(activeAudioGuide === section ? null : section);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment && newCommentName && newCommentLocation) {
      const comment: VisitorComment = {
        id: Date.now(),
        name: newCommentName,
        location: newCommentLocation,
        comment: newComment,
        rating: 5,
        date: new Date().toISOString().split("T")[0],
      };
      setVisitorComments([comment, ...visitorComments]);
      setNewComment("");
      setNewCommentName("");
      setNewCommentLocation("");
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
              Preparing the exhibition...
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
      />{" "}
      {/* Museum Exhibition Layout */}
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-gray-100"
      >
        {/* Gallery Lighting Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Main spotlight on artwork */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 transition-all duration-500 bg-gradient-radial from-blue-200/20 via-blue-100/10 to-transparent dark:bg-gradient-radial dark:from-amber-200/20 dark:via-amber-100/10 dark:to-transparent rounded-full blur-3xl"></div>
          {/* Secondary ambient lighting */}
          <div className="absolute top-40 right-1/4 w-64 h-64 transition-all duration-500 bg-gradient-radial from-purple-300/15 via-purple-200/8 to-transparent dark:bg-gradient-radial dark:from-amber-300/15 dark:via-amber-200/8 dark:to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-48 h-48 transition-all duration-500 bg-gradient-radial from-cyan-400/10 via-cyan-300/5 to-transparent dark:bg-gradient-radial dark:from-amber-400/10 dark:via-amber-300/5 dark:to-transparent rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {" "}
          {/* Museum Navigation */}
          <motion.nav
            className="flex items-center space-x-3 text-sm text-gray-600 dark:text-amber-300/80 mb-8 font-serif"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center hover:text-blue-600 dark:hover:text-amber-200 transition-colors duration-300"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Museum Entrance</span>
              <span className="sm:hidden">Home</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={() => navigate("/gallery")}
              className="hover:text-blue-600 dark:hover:text-amber-200 transition-colors duration-300"
            >
              <span className="hidden sm:inline">Main Gallery</span>
              <span className="sm:hidden">Gallery</span>
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-amber-100 font-medium">
              <span className="hidden sm:inline">Exhibition Hall</span>
              <span className="sm:hidden">Details</span>
            </span>
          </motion.nav>
          {/* Back to Gallery */}
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
            <span className="hidden sm:inline">Return to Main Gallery</span>
            <span className="sm:hidden">Back</span>
          </motion.button>
          {/* Main Exhibition Layout */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Artwork Display - Museum Style */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="relative">
                {" "}
                {/* Artwork Frame */}
                <div className="relative bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-800/10 p-8 rounded-lg border-4 border-gray-300/50 dark:border-amber-700/40 transition-all duration-500">
                  {/* Spotlight effect on artwork */}
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-100/20 dark:bg-gradient-radial dark:from-transparent dark:via-transparent dark:to-black/30 pointer-events-none"></div>

                  <div className="aspect-square rounded-lg overflow-hidden bg-white/50 dark:bg-black/50 shadow-2xl relative group transition-all duration-500">
                    <img
                      src={nftData.image}
                      alt={nftData.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Museum Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:bg-gradient-to-br dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none"></div>

                    {/* Security/Preservation Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-green-500 dark:text-green-400 transition-all duration-500">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-blue-500 dark:text-blue-400 transition-all duration-500">
                        <Camera className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Audio Guide Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleAudioGuide("artwork")}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          activeAudioGuide === "artwork"
                            ? "bg-blue-500 dark:bg-amber-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-amber-500/30"
                            : "bg-white/70 dark:bg-black/70 text-blue-600 dark:text-amber-300 hover:bg-blue-50 dark:hover:bg-amber-900/50"
                        }`}
                        title="Audio Guide: About the Artwork"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Museum Placard */}
                  <div className="mt-6 bg-gradient-to-r from-white/80 to-gray-50/60 dark:bg-gradient-to-r dark:from-amber-900/30 dark:to-amber-800/20 p-6 rounded-lg border border-gray-300/50 dark:border-amber-700/30 transition-all duration-500">
                    <div className="text-center space-y-2">
                      <h1 className="text-2xl font-serif text-gray-900 dark:text-amber-100 tracking-wide">
                        {nftData.title}
                      </h1>
                      <p className="text-gray-700 dark:text-amber-300/80 font-serif italic">
                        by {nftData.artist}
                      </p>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 dark:via-amber-400 to-transparent mx-auto my-3"></div>
                      <div className="text-xs text-gray-600 dark:text-amber-200/60 font-serif space-y-1">
                        <p>Digital Art, 2024</p>
                        <p>Collection: {nftData.collection}</p>
                        <p>Token ID: {nftData.tokenId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>{" "}
            {/* Exhibition Information Panel */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Curatorial Notes */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg transition-all duration-500">
                <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-4 flex items-center gap-2 transition-colors duration-500">
                  <Sparkles className="w-5 h-5 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                  Curatorial Notes
                </h3>
                <p className="text-gray-700 dark:text-amber-200/80 leading-relaxed font-serif text-sm transition-colors duration-500">
                  {nftData.description}
                </p>

                {/* Audio Guide for Artist */}
                <button
                  onClick={() => handleAudioGuide("artist")}
                  className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeAudioGuide === "artist"
                      ? "bg-blue-500 dark:bg-amber-500 text-white"
                      : "bg-gray-200/80 dark:bg-amber-900/30 text-blue-600 dark:text-amber-300 hover:bg-gray-300/80 dark:hover:bg-amber-800/40"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  Audio Guide: Meet the Artist
                </button>
              </div>

              {/* Acquisition Information */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg transition-all duration-500">
                <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-4 transition-colors duration-500">
                  Acquisition Details
                </h3>
                <div className="space-y-3 text-sm font-serif">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-amber-300/70 transition-colors duration-500">
                      Current Valuation:
                    </span>
                    <span className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                      {nftData.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-amber-300/70 transition-colors duration-500">
                      Highest Bid:
                    </span>
                    <span className="text-gray-900 dark:text-amber-100 transition-colors duration-500">
                      {nftData.highestBid}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-amber-300/70 transition-colors duration-500">
                      Exhibition Ends:
                    </span>
                    <div className="flex items-center gap-1 text-gray-900 dark:text-amber-100 transition-colors duration-500">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{nftData.timeLeft}</span>
                    </div>
                  </div>
                </div>

                {/* Bidding Form - Museum Style */}
                <form onSubmit={handleBidSubmit} className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Private Collection Offer (ETH)"
                    value={currentBid}
                    onChange={(e) => setCurrentBid(e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300/60 dark:bg-black/30 dark:border-amber-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 text-gray-900 dark:text-amber-100 placeholder-gray-500 dark:placeholder-amber-300/50 font-serif transition-all duration-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-amber-600 dark:to-amber-700 text-white px-6 py-3 rounded-lg font-serif font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    Submit Private Offer
                  </button>
                </form>
              </div>

              {/* Visitor Stats */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg transition-all duration-500">
                <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-4 transition-colors duration-500">
                  Exhibition Analytics
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="w-4 h-4 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                    </div>
                    <p className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                      {nftData.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                      Visitors
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="w-4 h-4 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                    </div>
                    <p className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                      {nftData.likes}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                      Admirers
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Share2 className="w-4 h-4 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                    </div>
                    <p className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                      {nftData.shares}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                      Shared
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>{" "}
          {/* Technical Details & Provenance */}
          <motion.div
            className="mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-serif text-gray-900 dark:text-amber-100 mb-8 text-center transition-colors duration-500">
              Technical Documentation & Provenance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Artwork Properties */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg transition-all duration-500">
                <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-4 flex items-center gap-2 transition-colors duration-500">
                  <Info className="w-5 h-5 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                  Artistic Properties
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {nftData.properties.map((property, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-black/30 p-3 rounded-lg border border-gray-300/40 dark:border-amber-700/20 group hover:border-gray-400/60 dark:hover:border-amber-600/40 transition-all duration-300"
                    >
                      <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                        {property.trait}
                      </p>
                      <p className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                        {property.value}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-amber-400/80 font-serif transition-colors duration-500">
                        Rarity: {property.rarity}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAudioGuide("technique")}
                  className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeAudioGuide === "technique"
                      ? "bg-blue-500 dark:bg-amber-500 text-white"
                      : "bg-gray-200/80 dark:bg-amber-900/30 text-blue-600 dark:text-amber-300 hover:bg-gray-300/80 dark:hover:bg-amber-800/40"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  Audio Guide: Artistic Technique
                </button>
              </div>

              {/* Transaction History */}
              <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg transition-all duration-500">
                <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-4 flex items-center gap-2 transition-colors duration-500">
                  <TrendingUp className="w-5 h-5 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
                  Exhibition History
                </h3>
                <div className="space-y-3">
                  {nftData.history.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/40 dark:bg-black/20 rounded-lg border border-gray-300/40 dark:border-amber-700/20 transition-all duration-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-amber-600 dark:to-amber-700 rounded-full flex items-center justify-center transition-all duration-500">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-amber-100 font-semibold text-sm font-serif transition-colors duration-500">
                            {transaction.type}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                          {transaction.price}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-amber-300/70 font-serif transition-colors duration-500">
                          {transaction.from} → {transaction.to}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>{" "}
          {/* Visitor Book Section */}
          <motion.div
            className="mb-16"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-serif text-gray-900 dark:text-amber-100 mb-8 text-center flex items-center justify-center gap-2 transition-colors duration-500">
              <MessageSquare className="w-6 h-6 text-blue-500 dark:text-amber-400 transition-colors duration-500" />
              Visitor Book
            </h2>

            {/* Add New Comment Form */}
            <div className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-8 rounded-lg mb-8 transition-all duration-500">
              <h3 className="text-lg font-serif text-gray-900 dark:text-amber-100 mb-6 transition-colors duration-500">
                Leave Your Mark
              </h3>
              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="px-4 py-3 bg-white/70 border border-gray-300/60 dark:bg-black/30 dark:border-amber-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 text-gray-900 dark:text-amber-100 placeholder-gray-500 dark:placeholder-amber-300/50 font-serif transition-all duration-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Your Location"
                    value={newCommentLocation}
                    onChange={(e) => setNewCommentLocation(e.target.value)}
                    className="px-4 py-3 bg-white/70 border border-gray-300/60 dark:bg-black/30 dark:border-amber-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 text-gray-900 dark:text-amber-100 placeholder-gray-500 dark:placeholder-amber-300/50 font-serif transition-all duration-500"
                    required
                  />
                </div>
                <textarea
                  placeholder="Share your thoughts about this masterpiece..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300/60 dark:bg-black/30 dark:border-amber-700/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 text-gray-900 dark:text-amber-100 placeholder-gray-500 dark:placeholder-amber-300/50 font-serif resize-none transition-all duration-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-amber-600 dark:to-amber-700 text-white px-8 py-3 rounded-lg font-serif font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-amber-700 dark:hover:to-amber-800 transition-all duration-300"
                >
                  Sign the Visitor Book
                </button>
              </form>
            </div>

            {/* Display Comments */}
            <div className="space-y-6">
              {[...mockVisitorComments, ...visitorComments].map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gradient-to-r from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 p-6 rounded-lg group hover:border-gray-400/60 dark:hover:border-amber-600/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {comment.avatar && (
                      <img
                        src={comment.avatar}
                        alt={comment.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-300/60 dark:border-amber-700/40 transition-all duration-500"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-serif text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                          {comment.name}
                        </h4>
                        <span className="text-gray-600 dark:text-amber-300/60 font-serif text-sm transition-colors duration-500">
                          from {comment.location}
                        </span>
                        <div className="flex text-blue-500 dark:text-amber-400 text-xs transition-colors duration-500">
                          {[...Array(comment.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-amber-200/80 font-serif leading-relaxed italic transition-colors duration-500">
                        "{comment.comment}"
                      </p>
                      <p className="text-gray-500 dark:text-amber-300/50 font-serif text-xs mt-2 transition-colors duration-500">
                        {comment.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>{" "}
          {/* Related Exhibitions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-serif text-gray-900 dark:text-amber-100 mb-8 text-center transition-colors duration-500">
              Related Exhibitions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarNFTs.map((nft) => (
                <motion.div
                  key={nft.id}
                  className="bg-gradient-to-b from-gray-100/80 to-gray-200/60 border border-gray-300/50 dark:bg-gradient-to-b dark:from-amber-900/20 dark:to-amber-800/10 dark:border-amber-700/30 rounded-lg overflow-hidden hover:border-gray-400/60 dark:hover:border-amber-600/50 transition-all duration-300 cursor-pointer group"
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => navigate(`/nft/${nft.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-gray-200/50 dark:bg-black/30 transition-all duration-500">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-gray-900 dark:text-amber-100 font-semibold mb-1 transition-colors duration-500">
                      {nft.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-amber-300/70 font-serif mb-2 transition-colors duration-500">
                      by {nft.artist}
                    </p>
                    <p className="font-serif font-bold text-blue-600 dark:text-amber-400 transition-colors duration-500">
                      {nft.price}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>{" "}
          {/* Audio Guide Information Panel */}
          {activeAudioGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 dark:bg-gradient-to-r dark:from-amber-900 dark:to-amber-800 dark:border-amber-600 p-6 rounded-lg shadow-2xl shadow-gray-500/30 dark:shadow-amber-900/50 z-50 max-w-md w-full mx-4 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif text-gray-900 dark:text-amber-100 font-semibold transition-colors duration-500">
                  {audioGuideInfo[activeAudioGuide]?.title}
                </h4>
                <button
                  onClick={() => setActiveAudioGuide(null)}
                  className="text-gray-600 dark:text-amber-300 hover:text-gray-900 dark:hover:text-amber-100 transition-colors duration-300"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 dark:text-amber-200/80 font-serif text-sm mb-3 transition-colors duration-500">
                {audioGuideInfo[activeAudioGuide]?.content}
              </p>
              <div className="flex items-center gap-2 text-gray-600 dark:text-amber-300/70 text-xs transition-colors duration-500">
                <Volume2 className="w-4 h-4" />
                <span>
                  Duration: {audioGuideInfo[activeAudioGuide]?.duration}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailNFT;
