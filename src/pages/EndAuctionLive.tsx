import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auctionService } from "../api/services";
import { AuctionDTO } from "../types/auction";
import SmartImage from "../components/SmartImage";
import confetti from "canvas-confetti";
import { FaEthereum, FaTrophy, FaCheck, FaSpinner, FaClock, FaChevronRight } from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";

const EndAuctionLive: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  
  const [auctionData, setAuctionData] = useState<AuctionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nftStatus, setNftStatus] = useState<'checking' | 'minting' | 'minted' | 'failed'>('checking');
  const [countdown, setCountdown] = useState(30); // 30 seconds to check NFT status

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
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
        damping: 15
      }
    },
  };

  // Trigger confetti on successful NFT minting
  const triggerConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#FFD700', '#FFA500', '#C0C0C0', '#32CD32'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };
  // Load auction data
  useEffect(() => {
    const loadAuctionData = async () => {
      if (!auctionId) {
        setError("Auction ID is missing");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Loading auction data for EndAuctionLive:", auctionId);
        const data = await auctionService.getAuction(auctionId);
        setAuctionData(data);
        console.log("✅ Auction data loaded:", data);
      } catch (error) {
        console.error("❌ Failed to load auction data:", error);
        setError("Failed to load auction data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const checkNftStatusInternal = async (auctionId: string) => {
      try {
        console.log("🔍 Checking NFT minting status...");
        setNftStatus('checking');
        
        // Simulate checking NFT status (replace with actual API call)
        // In real implementation, this would call an API to check if NFT is minted
        const response = await auctionService.getAuction(auctionId);        // Check if NFT is already minted
        if (response.status === 'NFT_MINTED') {
          setNftStatus('minted');
          triggerConfetti();
          return;
        }
        
        // If not minted, start the minting process simulation
        setNftStatus('minting');
        
        // Simulate minting process (3-5 seconds)
        const mintingTime = Math.random() * 2000 + 3000; // 3-5 seconds
        
        setTimeout(() => {
          // Simulate 90% success rate
          if (Math.random() > 0.1) {
            setNftStatus('minted');
            triggerConfetti();
              // Update auction data to reflect NFT minted status
            setAuctionData(prev => prev ? { ...prev, status: 'NFT_MINTED' } : null);
          } else {
            setNftStatus('failed');
          }
        }, mintingTime);
        
      } catch (error) {
        console.error("❌ Error checking NFT status:", error);
        setNftStatus('failed');
      }
    };

    loadAuctionData().then(() => {
      if (auctionId) {
        checkNftStatusInternal(auctionId);
      }
    });  }, [auctionId]);

  // Countdown timer
  useEffect(() => {
    if (nftStatus === 'minted') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nftStatus]);

  // Auto redirect after countdown or when NFT is minted
  useEffect(() => {
    if (nftStatus === 'minted' && countdown <= 0) {
      setTimeout(() => {
        navigate(`/Home/nft/${auctionData?.productId || auctionId}`);
      }, 3000);
    } else if (nftStatus === 'failed' && countdown <= 0) {
      setTimeout(() => {
        navigate(`/Home/auctions`);
      }, 3000);
    }
  }, [nftStatus, countdown, navigate, auctionData?.productId, auctionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <h3 className="text-xl text-amber-500 font-medium">Loading auction results...</h3>
        </div>
      </div>
    );
  }

  if (error || !auctionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error || "Failed to load auction data"}</p>
          <button 
            onClick={() => navigate("/Home/auctions")}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200"
          >
            Return to Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 py-10 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="max-w-5xl mx-auto text-center mb-12"
      >
        <div className="inline-block p-2 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full mb-6">
          <PiCertificateFill className="text-gray-900 w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Auction Ended Successfully!
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          The auction for "{auctionData.productName || 'Unknown Item'}" has ended. 
          We're now processing the NFT minting...
        </p>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
        {/* Left column - NFT Image */}
        <motion.div variants={itemVariants}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500">
            <SmartImage 
              imageId={auctionData.productImages?.[0] || auctionData.productId || ''}
              alt={auctionData.productName || "Auction NFT"}
              className="w-full h-[500px] object-contain bg-gray-800"
              fallbackCategory="nft"
              priority={true}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-bold text-xl truncate">
                {auctionData.productName || 'Auction Item'}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Right column - Status and Results */}
        <motion.div variants={itemVariants}>
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 h-full">
            {/* NFT Minting Status */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  {nftStatus === 'checking' && <FaClock className="text-amber-400 text-xl" />}
                  {nftStatus === 'minting' && <FaSpinner className="text-blue-400 text-xl animate-spin" />}
                  {nftStatus === 'minted' && <FaCheck className="text-green-400 text-xl" />}
                  {nftStatus === 'failed' && <span className="text-red-400 text-xl">❌</span>}
                </div>
                <h2 className="text-2xl font-bold text-white">NFT Status</h2>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
                <AnimatePresence mode="wait">
                  {nftStatus === 'checking' && (
                    <motion.div
                      key="checking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className="text-amber-400 text-lg font-medium mb-2">
                        🔍 Checking NFT Status...
                      </div>
                      <p className="text-gray-400 text-sm">
                        Verifying if the product has been minted as an NFT
                      </p>
                    </motion.div>
                  )}
                  
                  {nftStatus === 'minting' && (
                    <motion.div
                      key="minting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className="text-blue-400 text-lg font-medium mb-2">
                        ⚡ Minting NFT...
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Creating your unique NFT on the blockchain
                      </p>
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500" 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {nftStatus === 'minted' && (
                    <motion.div
                      key="minted"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className="text-green-400 text-lg font-medium mb-2">
                        ✅ NFT Minted Successfully!
                      </div>
                      <p className="text-gray-400 text-sm">
                        Your NFT has been created and is ready to view
                      </p>
                    </motion.div>
                  )}
                  
                  {nftStatus === 'failed' && (
                    <motion.div
                      key="failed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className="text-red-400 text-lg font-medium mb-2">
                        ❌ NFT Minting Failed
                      </div>
                      <p className="text-gray-400 text-sm">
                        There was an issue minting the NFT. Please contact support.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Auction Results */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FaTrophy className="text-amber-400 text-2xl" />
                <h2 className="text-2xl font-bold text-white">Final Results</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Winning Bid:</span>
                  <div className="flex items-center text-amber-400 font-bold text-xl">
                    <FaEthereum className="mr-1" />
                    {(auctionData.currentBid / 1000).toFixed(4)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Winner:</span>
                  <span className="text-white font-medium">
                    {auctionData.bidderAddress ? 
                      `@${auctionData.bidderAddress.slice(0, 6)}...${auctionData.bidderAddress.slice(-4)}` : 
                      'No bids'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Auction ID:</span>
                  <span className="text-blue-400 text-sm">#{auctionData.auctionId}</span>
                </div>
              </div>
            </div>
            
            {/* Countdown and Actions */}
            <div className="space-y-4">
              <div className="text-center text-gray-400 text-sm">
                {nftStatus === 'minted' ? (
                  "Redirecting to NFT details in 3 seconds..."
                ) : nftStatus === 'failed' ? (
                  "Redirecting to auctions in 3 seconds..."
                ) : (
                  `Auto-redirect in ${countdown} seconds`
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {nftStatus === 'minted' && (
                  <button 
                    onClick={() => navigate(`/Home/nft/${auctionData.productId || auctionId}`)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    View NFT <FaChevronRight />
                  </button>
                )}
                
                <button 
                  onClick={() => navigate("/Home/auctions")}
                  className="flex-1 px-6 py-3 border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors duration-300"
                >
                  Back to Auctions
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Status Information */}
      <motion.div 
        variants={itemVariants}
        className="max-w-5xl mx-auto bg-gray-800/50 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4">What happens next?</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${nftStatus === 'minted' ? 'bg-green-800/30 border border-green-500/30' : 'bg-gray-800'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${nftStatus === 'minted' ? 'bg-green-500' : 'bg-blue-500/20'}`}>
                <span className={`font-bold text-sm ${nftStatus === 'minted' ? 'text-white' : 'text-blue-400'}`}>1</span>
              </div>
              <h4 className={`text-lg font-medium ${nftStatus === 'minted' ? 'text-green-400' : 'text-blue-400'}`}>
                NFT Creation
              </h4>
            </div>
            <p className="text-gray-400 text-sm">
              {nftStatus === 'minted' ? 'NFT has been successfully created on the blockchain' : 'Creating the NFT on the blockchain'}
            </p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-400 font-bold text-sm">2</span>
              </div>
              <h4 className="text-lg font-medium text-purple-400">Transfer</h4>
            </div>
            <p className="text-gray-400 text-sm">
              NFT will be transferred to the winner's wallet automatically
            </p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-amber-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <span className="text-amber-400 font-bold text-sm">3</span>
              </div>
              <h4 className="text-lg font-medium text-amber-400">Completion</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Payment processed and ownership certificate issued
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EndAuctionLive;
