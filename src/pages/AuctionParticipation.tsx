import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  ArrowLeft, 
  Gavel, 
  TrendingUp, 
  CheckCircle,
  Star,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface BidHistory {
  id: number;
  bidder: string;
  amount: string;
  timestamp: string;
  isWinning: boolean;
}

interface Bidder {
  id: number;
  name: string;
  avatar: string;
  isActive: boolean;
  isVIP: boolean;
  currentBid: number;
  totalBids: number;
  row: number; // 1 = front row (VIP), 2-4 = regular rows
  seat: number; // position in row
}

interface AuctionDetails {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  images: string[];
  currentBid: string;
  currentBidValue: number;
  estimatedValue: string;
  timeLeft: string;
  timeLeftSeconds: number;
  bidCount: number;
  category: string;
  auctionHouse: string;
  description: string;
  condition: string;
  provenance: string;
  minimumBid: number;
  bidIncrement: number;
  watchers: number;
  isWatched: boolean;
}

const AuctionParticipation: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data - trong thực tế sẽ fetch từ API
  const [auctionData] = useState<AuctionDetails>({
    id: 1,
    title: "The Ethereal Symphony",
    artist: "Marina Celestial",
    year: "2024",
    medium: "Digital Art NFT",
    dimensions: "4000 x 4000 px",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    images: [
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800"
    ],
    currentBid: "$12,500",
    currentBidValue: 12500,
    estimatedValue: "$15,000 - $25,000",
    timeLeft: "02:45:30",
    timeLeftSeconds: 9930,
    bidCount: 47,
    category: "Digital Art",
    auctionHouse: "Premium Art Gallery",
    description: "A mesmerizing digital masterpiece that captures the essence of contemporary abstract expressionism through innovative AI-assisted techniques.",
    condition: "Mint condition",
    provenance: "Direct from artist studio",
    minimumBid: 13000,
    bidIncrement: 500,
    watchers: 156,
    isWatched: false
  });
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([
    { id: 1, bidder: "ArtLover123", amount: "$12,500", timestamp: "2 min ago", isWinning: true },
    { id: 2, bidder: "CollectorPro", amount: "$12,000", timestamp: "5 min ago", isWinning: false },
    { id: 3, bidder: "DigitalVision", amount: "$11,500", timestamp: "8 min ago", isWinning: false },
    { id: 4, bidder: "ArtistFan2024", amount: "$11,000", timestamp: "12 min ago", isWinning: false },
    { id: 5, bidder: "ModernArt", amount: "$10,500", timestamp: "15 min ago", isWinning: false },
  ]);

  // Theater audience - bidders in seats
  const [bidders] = useState<Bidder[]>([
    // VIP Front Row
    { id: 1, name: "ArtLover123", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", isActive: true, isVIP: true, currentBid: 12500, totalBids: 8, row: 1, seat: 1 },
    { id: 2, name: "CollectorPro", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", isActive: false, isVIP: true, currentBid: 12000, totalBids: 5, row: 1, seat: 2 },
    { id: 3, name: "DigitalVision", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100", isActive: false, isVIP: true, currentBid: 11500, totalBids: 3, row: 1, seat: 3 },
    { id: 4, name: "GalleryOwner", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", isActive: false, isVIP: true, currentBid: 0, totalBids: 0, row: 1, seat: 4 },
    
    // Regular rows
    { id: 5, name: "ArtistFan2024", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", isActive: false, isVIP: false, currentBid: 11000, totalBids: 2, row: 2, seat: 1 },
    { id: 6, name: "ModernArt", avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100", isActive: false, isVIP: false, currentBid: 10500, totalBids: 1, row: 2, seat: 2 },
    { id: 7, name: "NewCollector", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 2, seat: 3 },
    { id: 8, name: "ArtEnthusiast", avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 2, seat: 4 },
    
    { id: 9, name: "FirstTimeBidder", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 3, seat: 1 },
    { id: 10, name: "ArtInvestor", avatar: "https://images.unsplash.com/photo-1534308143481-c55c22c71d3e?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 3, seat: 2 },
    { id: 11, name: "Observer", avatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 3, seat: 3 },
    { id: 12, name: "YoungCollector", avatar: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=100", isActive: false, isVIP: false, currentBid: 0, totalBids: 0, row: 3, seat: 4 },
  ]);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isWatched, setIsWatched] = useState(auctionData.isWatched);
  const [timeLeft, setTimeLeft] = useState(auctionData.timeLeftSeconds);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeBidder, setActiveBidder] = useState<number | null>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handlePlaceBid = async () => {
    const bidValue = parseInt(bidAmount.replace(/[^0-9]/g, ''));
    
    if (bidValue < auctionData.minimumBid) {
      alert(`Minimum bid is $${auctionData.minimumBid.toLocaleString()}`);
      return;
    }

    setIsPlacingBid(true);
    
    // Simulate bidder standing up animation
    const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
    setActiveBidder(randomBidder.id);
    
    // Simulate API call
    setTimeout(() => {
      const newBid: BidHistory = {
        id: bidHistory.length + 1,
        bidder: "You",
        amount: `$${bidValue.toLocaleString()}`,
        timestamp: "Just now",
        isWinning: true
      };

      setBidHistory(prev => [newBid, ...prev.map(bid => ({ ...bid, isWinning: false }))]);
      setBidAmount('');
      setIsPlacingBid(false);
      setBidSuccess(true);
      
      // Reset active bidder after animation
      setTimeout(() => setActiveBidder(null), 2000);
      setTimeout(() => setBidSuccess(false), 3000);
    }, 1500);
  };

  const handleQuickBid = (increment: number) => {
    const newBid = auctionData.currentBidValue + increment;
    setBidAmount(`$${newBid.toLocaleString()}`);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in') return Math.min(prev + 0.2, 2);
      return Math.max(prev - 0.2, 0.8);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gold-500/30"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gold-400" />
              </motion.button>
              <div>
                <h1 className="text-lg font-bold text-gold-400">AUCTION HOUSE</h1>
                <p className="text-sm text-gray-400">Lot #{auctionData.id} • {auctionData.auctionHouse}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xl font-bold text-red-400 font-mono">{formatTime(timeLeft)}</div>
                <div className="text-xs text-gray-400">Time Remaining</div>
              </div>
              <motion.button
                onClick={() => setIsWatched(!isWatched)}
                className={`p-3 rounded-xl transition-all border ${
                  isWatched 
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25 border-pink-500" 
                    : "bg-gray-800 text-gray-400 border-gray-600 hover:border-pink-500/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Wall - Upper Theater */}
      <motion.div 
        className="relative bg-gradient-to-b from-gray-800 to-gray-700 min-h-[60vh] flex items-center justify-center"
        variants={itemVariants}
      >
        {/* Gallery Lighting */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Spotlight Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 800px 400px at center 60%, rgba(255,223,0,0.1) 0%, transparent 50%)`
          }}
        />

        {/* Wall Texture */}
        <div className="absolute inset-0 opacity-30" 
             style={{
               backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
             }} />

        {/* Artwork Frame */}
        <motion.div 
          className="relative"
          style={{ transform: `scale(${zoomLevel})` }}
          transition={{ duration: 0.3 }}
        >
          {/* Ornate Frame */}
          <div className="relative p-8 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 rounded-lg shadow-2xl">
            <div className="relative p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded shadow-inner">              <motion.img
                src={auctionData.images[0]}
                alt={auctionData.title}
                className="w-96 h-96 object-cover rounded shadow-2xl"
                layoutId="gallery-artwork"
              />
              
              {/* Frame Details */}
              <div className="absolute -inset-2 border-4 border-yellow-300 rounded opacity-80" />
              <div className="absolute -inset-4 border-2 border-yellow-500 rounded opacity-60" />
            </div>
          </div>

          {/* Artwork Info Plaque */}
          <motion.div 
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black px-6 py-2 rounded shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-bold text-center">"{auctionData.title}"</p>
            <p className="text-xs text-center opacity-80">{auctionData.artist}, {auctionData.year}</p>
          </motion.div>
        </motion.div>

        {/* Gallery Controls */}
        <div className="absolute top-6 right-6 flex flex-col space-y-2">
          <motion.button
            onClick={() => handleZoom('in')}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => handleZoom('out')}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomOut className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Current Bid Display - Like auction house display */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-gold-500/50 rounded-xl p-6 min-w-[300px]"
          variants={itemVariants}
        >
          <div className="text-center">
            <p className="text-gold-400 text-sm mb-1">CURRENT BID</p>
            <motion.p 
              className="text-4xl font-bold text-white mb-2"
              key={auctionData.currentBid}
              initial={{ scale: 1.2, color: "#ffd700" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.5 }}
            >
              {auctionData.currentBid}
            </motion.p>
            <div className="flex items-center justify-center space-x-4 text-gray-300 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{auctionData.bidCount} bids</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{auctionData.watchers} watching</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Badge */}
        <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span>LIVE AUCTION</span>
        </div>
      </motion.div>

      {/* Theater Audience - Lower Section */}
      <motion.div 
        className="relative bg-gradient-to-t from-black via-gray-900 to-gray-800 min-h-[40vh] py-8"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Stage Lights */}
          <div className="absolute top-0 left-1/4 w-2 h-8 bg-gradient-to-b from-yellow-400 to-transparent opacity-60" />
          <div className="absolute top-0 right-1/4 w-2 h-8 bg-gradient-to-b from-yellow-400 to-transparent opacity-60" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Theater Seating - Left Side */}
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gold-400 mb-6 text-center">AUCTION THEATER</h3>
              
              {/* Theater Rows */}
              <div className="space-y-6">
                {[1, 2, 3].map((row) => (
                  <motion.div 
                    key={row}
                    className="flex justify-center"
                    style={{
                      transform: `perspective(1000px) rotateX(${5 * row}deg)`,
                      marginBottom: row === 1 ? '2rem' : '1rem'
                    }}
                  >
                    {/* Row Label */}
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500 w-12">
                        {row === 1 ? 'VIP' : `Row ${row}`}
                      </span>
                      
                      {/* Seats in Row */}
                      <div className="flex space-x-3">
                        {bidders
                          .filter(bidder => bidder.row === row)
                          .map((bidder) => (
                            <motion.div
                              key={bidder.id}
                              className="relative group cursor-pointer"
                              whileHover={{ scale: 1.1 }}
                              animate={activeBidder === bidder.id ? {
                                scale: [1, 1.3, 1.2],
                                y: [0, -10, -8]
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              {/* Seat */}
                              <div className={`w-12 h-8 rounded-t-lg transition-all ${
                                bidder.isVIP 
                                  ? 'bg-gradient-to-t from-red-800 to-red-600 border border-gold-500/50' 
                                  : 'bg-gradient-to-t from-gray-700 to-gray-600 border border-gray-500/50'
                              }`} />
                              
                              {/* Avatar */}
                              <motion.div 
                                className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-2 overflow-hidden transition-all ${
                                  bidder.isActive || activeBidder === bidder.id
                                    ? 'border-gold-400 shadow-lg shadow-gold-400/50' 
                                    : bidder.isVIP 
                                      ? 'border-red-400' 
                                      : 'border-gray-400'
                                }`}
                                animate={activeBidder === bidder.id ? {
                                  boxShadow: [
                                    '0 0 0 0 rgba(255, 215, 0, 0.7)',
                                    '0 0 0 10px rgba(255, 215, 0, 0)',
                                    '0 0 0 0 rgba(255, 215, 0, 0)'
                                  ]
                                } : {}}
                                transition={{ duration: 1, repeat: activeBidder === bidder.id ? Infinity : 0 }}
                              >
                                <img 
                                  src={bidder.avatar} 
                                  alt={bidder.name}
                                  className="w-full h-full object-cover"
                                />
                                
                                {/* Activity Indicator */}
                                {(bidder.isActive || activeBidder === bidder.id) && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
                                )}
                              </motion.div>
                              
                              {/* Bidder Info Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                <p className="font-semibold">{bidder.name}</p>
                                {bidder.currentBid > 0 && (
                                  <p className="text-gold-400">${bidder.currentBid.toLocaleString()}</p>
                                )}
                                <p className="text-gray-400">{bidder.totalBids} bids</p>
                              </div>
                            </motion.div>
                          ))
                        }
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Theater Floor Pattern */}
              <div className="mt-8 text-center">
                <div className="inline-block w-64 h-2 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent rounded" />
                <p className="text-xs text-gray-500 mt-2">AUCTION FLOOR</p>
              </div>
            </motion.div>

            {/* Bidding Panel - Right Side */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Auctioneer Podium Style */}
              <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 rounded-2xl p-6 shadow-2xl border border-gold-400/50">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-black mb-2">PLACE YOUR BID</h3>
                  <p className="text-xs text-black/70">Minimum: ${auctionData.minimumBid.toLocaleString()}</p>
                </div>
                
                {/* Quick Bid Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[500, 1000, 2500].map((increment) => (
                    <motion.button
                      key={increment}
                      onClick={() => handleQuickBid(increment)}
                      className="p-3 bg-black/20 hover:bg-black/40 text-black rounded-xl transition-all text-sm font-bold border border-black/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      +${increment}
                    </motion.button>
                  ))}
                </div>
                
                {/* Custom Bid Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`$${auctionData.minimumBid.toLocaleString()}`}
                    className="w-full px-4 py-3 bg-black/20 border border-black/30 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-black/50 font-bold text-center text-lg"
                  />
                  
                  <motion.button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || isPlacingBid || timeLeft <= 0}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    whileHover={{ scale: isPlacingBid ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPlacingBid ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>BIDDING...</span>
                      </>
                    ) : (
                      <>
                        <Gavel className="w-5 h-5" />
                        <span>BID NOW</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Bid History - Auction Record */}
              <motion.div 
                className="bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50"
                variants={itemVariants}
              >
                <h3 className="font-semibold text-gold-400 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  BIDDING RECORD
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {bidHistory.map((bid, index) => (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          bid.isWinning 
                            ? "bg-gradient-to-r from-gold-500/20 to-yellow-500/20 border border-gold-500/30" 
                            : "bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            bid.bidder === "You" 
                              ? "bg-pink-500 text-white" 
                              : bid.isWinning
                                ? "bg-gold-500 text-black"
                                : "bg-gray-600 text-gray-300"
                          }`}>
                            {bid.bidder === "You" ? "Y" : bid.bidder.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${
                              bid.bidder === "You" ? "text-pink-400" : "text-white"
                            }`}>
                              {bid.bidder}
                            </p>
                            <p className="text-xs text-gray-400">{bid.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{bid.amount}</p>
                          {bid.isWinning && (
                            <div className="flex items-center text-gold-400 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Leading
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {bidSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-green-400/50"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Bid Placed Successfully!</p>
              <p className="text-sm text-green-100">You are now the highest bidder</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auction Ended Overlay */}
      <AnimatePresence>
        {timeLeft <= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-black rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border border-gold-500/50"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-gold-400 mb-2">AUCTION CONCLUDED</h2>
              <p className="text-gray-300 mb-6">
                The bidding has ended. Results will be announced shortly.
              </p>
              <motion.button
                onClick={() => navigate('/Home/auctions')}
                className="w-full bg-gradient-to-r from-gold-500 to-yellow-500 text-black font-bold py-3 px-6 rounded-xl hover:from-gold-600 hover:to-yellow-600 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Return to Auction House
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuctionParticipation;
