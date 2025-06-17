import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
// All imports are now in components
import {
  AuctionHeader,
  BiddingArea,
  AuctionDetails,
  BiddersList,
  AuctionEndOverlay,
} from "../components/Auction/AuctionParticipation";
import AuctionAnalytics from "../components/Auction/AuctionParticipation/AuctionAnalytics";
import AuctionSound from "../components/Auction/AuctionSound";
import {
  BidHistory,
  Bidder,
  AuctionDTO,
} from "../types/auction";
import { auctionService, BidRequest } from "../api/services";
import { useAuth } from "../api/auth/useAuth";
import { authService } from "../api/services/authService";
import { UserProfileResponse } from "../api/types";
import SmartImage from "../components/SmartImage";

const AuctionParticipation: React.FC = () => {
  const navigate = useNavigate();
  const { auctionId } = useParams<{ auctionId: string }>();
  const { state: authState } = useAuth();
  // State for real auction data
  const [auctionData, setAuctionData] = useState<AuctionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    // State for user profile
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
  
  // Theater audience - bidders in seats
  const [bidders] = useState<Bidder[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isWatched, setIsWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);  const [isEndingAuction, setIsEndingAuction] = useState(false);
    // State for fullscreen image viewer
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  
  // Realtime polling state
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  // Fetch auction data on component mount
  useEffect(() => {
    const fetchAuctionData = async () => {
      console.log("🔍 AuctionParticipation - Starting fetch with auctionId:", auctionId);
      
      if (!auctionId) {
        console.log("❌ No auctionId provided");
        setError("Auction ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("🔍 Calling auctionService.getAuction with ID:", auctionId);
        const fetchedAuction = await auctionService.getAuction(auctionId);
        console.log("✅ Fetched auction data:", fetchedAuction);
        setAuctionData(fetchedAuction);
        
        // Calculate time left (convert from milliseconds to seconds)
        const now = Date.now();
        const timeLeftInSeconds = Math.max(0, Math.floor((fetchedAuction.endTime - now) / 1000));
        console.log("🔍 Time calculation:", { now, endTime: fetchedAuction.endTime, timeLeftInSeconds });
        setTimeLeft(timeLeftInSeconds);
        
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching auction data:", err);
        setError("Failed to load auction data");
      } finally {
        setIsLoading(false);
      }
    };    fetchAuctionData();
  }, [auctionId]);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("🔍 Fetching user profile...");
      
      try {
        setIsLoadingProfile(true);
        const profileResponse = await authService.getUserProfile();
        console.log("✅ User profile response:", profileResponse);
        
        if (profileResponse.success && profileResponse.data) {
          setUserProfile(profileResponse.data);
          console.log("✅ User profile set:", profileResponse.data);
        } else {
          console.log("❌ Failed to get user profile:", profileResponse.message);
        }
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };    fetchUserProfile();
  }, []);

  // Realtime polling for auction updates
  useEffect(() => {
    if (!auctionId || !isPolling || isLoading) return;    const pollAuctionData = async () => {
      try {
        console.log("🔄 Polling auction data for updates...");
        const updatedAuction = await auctionService.getAuction(auctionId);
        
        // Check if auction status changed to NFT_MINTED
        if (auctionData && updatedAuction.status !== auctionData.status) {
          console.log("🔍 Auction status changed:", {
            oldStatus: auctionData.status,
            newStatus: updatedAuction.status
          });
          
          // If status changed to NFT_MINTED, the useEffect will handle the redirect
          setAuctionData(updatedAuction);
          return; // Exit early to let useEffect handle the redirect
        }
        
        // Check if there are any bid changes
        if (auctionData && updatedAuction.currentBid !== auctionData.currentBid) {
          console.log("🔥 New bid detected!", {
            oldBid: auctionData.currentBid,
            newBid: updatedAuction.currentBid,
            bidder: updatedAuction.bidderAddress
          });
          
          // Update auction data
          setAuctionData(updatedAuction);
            // Add new bid to history if it's from another user
          if (updatedAuction.bidderAddress && updatedAuction.bidderAddress !== authState.user?.walletAddress) {
            const newBid: BidHistory = {
              id: bidHistory.length + 1,
              bidder: '@' + updatedAuction.bidderAddress.slice(0, 6) + '...' + updatedAuction.bidderAddress.slice(-4),
              amount: `${(updatedAuction.currentBid / 1000).toFixed(2)} ETH`,
              timestamp: "Just now",
              isWinning: true,
            };

            setBidHistory((prev) => [
              newBid,
              ...prev.map((bid) => ({ ...bid, isWinning: false })),
            ]);
            
            // Trigger new bid sound
            setHasNewBid(true);
            setTimeout(() => setHasNewBid(false), 1000);
          }
        }
        
        // Update timestamp for last update
        setLastUpdateTime(Date.now());
        
      } catch (error) {
        console.error("❌ Error polling auction data:", error);
      }
    };

    // Initial delay then poll every 3 seconds
    const pollInterval = setInterval(pollAuctionData, 3000);

    return () => clearInterval(pollInterval);
  }, [auctionId, isPolling, isLoading, auctionData, bidHistory.length, authState.user?.walletAddress]);

  // Stop polling when auction is completed or user is placing a bid
  useEffect(() => {
    if (auctionData && (timeLeft <= 0 || auctionData.status === 'NFT_MINTED')) {
      setIsPolling(false);
    } else if (auctionData && timeLeft > 0) {
      setIsPolling(true);
    }
  }, [timeLeft, auctionData]);
  // Pause polling when user is placing a bid to avoid conflicts
  useEffect(() => {
    setIsPolling(!isPlacingBid);
  }, [isPlacingBid]);  // Check if auction status is NFT_MINTED and redirect to EndAuctionLive
  useEffect(() => {
    console.log("🔍 Checking auction status for redirect:", {
      auctionData: auctionData ? {
        auctionId: auctionData.auctionId,
        status: auctionData.status
      } : null
    });
    
    if (auctionData && auctionData.status === 'NFT_MINTED') {
      console.log("✅ Auction status is NFT_MINTED, redirecting to EndAuctionLive...");
      navigate(`/Home/end-auction-live/${auctionData.auctionId}`);
    }
  }, [auctionData, navigate]);
    // Check if current user is the owner of the auction
  const isOwner = auctionData && userProfile && auctionData.owner === userProfile.walletAddress;
  
  // Debug logging for owner check
  console.log("🔍 Owner check:", {
    auctionData: auctionData ? { owner: auctionData.owner, auctionId: auctionData.auctionId } : null,
    userProfile: userProfile ? { walletAddress: userProfile.walletAddress } : null,
    isOwner
  });
  // Zoom level is now managed by the AuctionGallery component
  const [activeBidder] = useState<number | null>(null);
  const [hasNewBid, setHasNewBid] = useState(false);
  const [hasApplause] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format time for display
  const formattedTimeLeft = formatTime(timeLeft);  const handlePlaceBid = async () => {
    if (!auctionData || !authState.user) {
      alert("Please login to place a bid");
      return;
    }

    // Check if user is the owner of the auction
    if (isOwner) {
      alert("You cannot bid on your own auction");
      return;
    }    
    
    // Convert ETH string to base units (1 ETH = 1000 units)
    // First strip out non-numeric characters except decimal point
    const ethValue = parseFloat(bidAmount.replace(/[^0-9.]/g, ""));
    
    // Check if the value is valid
    if (isNaN(ethValue)) {
      alert("Please enter a valid bid amount");
      return;
    }
    
    // Convert ETH to internal units (1 ETH = 1000 units)
    const bidValue = Math.floor(ethValue * 1000);
    const minimumBid = auctionData.currentBid + 500; // Minimum increment

    console.log("Bidding:", { 
      inputValue: bidAmount,
      cleanedValue: bidAmount.replace(/[^0-9.]/g, ""),
      ethValue,
      bidValue,
      minimumBid
    });

    if (bidValue < minimumBid) {
      alert(`Minimum bid is ${(minimumBid / 1000).toFixed(2)} ETH`);
      return;
    }

    if (!authState.user.walletAddress) {
      alert("Wallet address is required to place a bid");
      return;
    }    setIsPlacingBid(true);
    setIsPolling(false); // Pause polling while placing bid
    setHasNewBid(true); // Trigger bid success sound

    try {
      // Create bid request
      const bidRequest: BidRequest = {
        amount: bidValue,
        walletAddress: authState.user.walletAddress
      };

      // Call API to place bid
      const updatedAuction = await auctionService.placeBid(auctionData.auctionId, bidRequest);
      
      // Update local auction data
      setAuctionData(updatedAuction);      // Update bid history
      const newBid: BidHistory = {
        id: bidHistory.length + 1,
        bidder: "You",
        amount: `${(bidValue / 1000).toFixed(2)} ETH`,
        timestamp: "Just now",
        isWinning: true,
      };

      setBidHistory((prev) => [
        newBid,
        ...prev.map((bid) => ({ ...bid, isWinning: false })),
      ]);
        setBidAmount("");
      setBidSuccess(true);

      setTimeout(() => setBidSuccess(false), 3000);

    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
      setIsPlacingBid(false);
      setHasNewBid(false);
    } finally {
      setIsPlacingBid(false);
      setIsPolling(true); // Resume polling after bid is complete
    }  };  const handleQuickBid = (increment: number) => {
    if (!auctionData) return;
    
    // Calculate the new bid amount (current bid + increment)
    const newBid = auctionData.currentBid + increment;
    
    // Format as ETH with 2 decimal places
    setBidAmount(`${(newBid / 1000).toFixed(2)} ETH`);
    
    console.log("Quick Bid:", { 
      increment,
      currentBid: auctionData.currentBid,
      newBid,
      displayValue: `${(newBid / 1000).toFixed(2)} ETH` 
    });
  };
  // Handle ending auction (only for owner)
  const handleEndAuction = async () => {
    if (!auctionData || !isOwner) {
      alert("Only the auction owner can end the auction");
      return;
    }

    if (!confirm("Are you sure you want to end this auction?")) {
      return;
    }

    setIsEndingAuction(true);

    try {
      console.log("🔍 Ending auction:", auctionData.auctionId);
      const endedAuction = await auctionService.endAuction(auctionData.auctionId);
      console.log("✅ Auction ended successfully:", endedAuction);
      
      setAuctionData(endedAuction);
      
      // Redirect all participants to the EndAuctionLive page
      navigate(`/Home/end-auction-live/${auctionData.auctionId}`);
      
    } catch (error) {
      console.error("❌ Error ending auction:", error);
      alert("Failed to end auction. Please try again.");
    } finally {
      setIsEndingAuction(false);
    }
  };
  // Remove unused handleZoom since it's now handled in AuctionGallery

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        damping: 15,
      },
    },
  };

  const handleToggleSound = () => {
    setIsSoundActive(!isSoundActive);
  };

  const handleShowAnalytics = () => {
    setShowAnalytics(true);
  };
  const handleCloseAnalytics = () => {
    setShowAnalytics(false);
  };

  // Test function to simulate NFT_MINTED status (for debugging)
  const handleTestNftMinted = () => {
    if (auctionData) {
      console.log("🧪 Testing NFT_MINTED status...");
      setAuctionData({ ...auctionData, status: 'NFT_MINTED' });
    }
  };
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >      {/* Loading State */}
      {(isLoading || isLoadingProfile) && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <div className="text-xl">
              {isLoading ? "Loading auction data..." : "Loading user profile..."}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      )}      {/* Auction Content */}
      {!isLoading && !isLoadingProfile && !error && auctionData && (
        <>
          {/* Sound System */}
          <AuctionSound
            isActive={isSoundActive}
            hasNewBid={hasNewBid}
            hasApplause={hasApplause}
          />            {/* Header */}
          <AuctionHeader
            id={parseInt(auctionData.auctionId)}
            auctionHouse={auctionData.productName || "Premium Gallery"}
            timeLeft={formattedTimeLeft}
            isWatched={isWatched}
            isSoundActive={isSoundActive}
            onNavigateBack={() => navigate(-1)}
            onToggleWatch={() => setIsWatched(!isWatched)}
            onToggleSound={handleToggleSound}
            onShowAnalytics={handleShowAnalytics}
          />
            {/* Owner Status Indicator */}
          {isOwner && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center font-semibold">
              🏛️ You are the owner of this auction
            </div>
          )}

          {/* Realtime Status Indicator */}
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-l-4 border-green-500 mx-4 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full ${isPolling ? 'bg-green-400' : 'bg-yellow-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPolling ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                </span>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">
                    {isPolling ? '🔄 Live Updates Active' : '⏸️ Updates Paused'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    • Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Checks every 3 seconds
              </div>
            </div>
          </div>{/* Gallery Wall - Upper Theater */}
          <div className="relative bg-gradient-to-b from-gray-800 to-black py-8">
            <div className="max-w-7xl mx-auto px-4">
              {/* Premium Gallery Frame */}
              <div className="relative">
                {/* Auction spotlight effect */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-yellow-300/30 to-transparent rounded-full blur-xl"></div>
                
                {/* Main image container with natural sizing */}
                <div 
                  className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-500 hover:shadow-amber-500/20 hover:shadow-3xl mx-auto"
                  style={{ maxWidth: 'fit-content' }}
                  onClick={() => setIsFullscreenOpen(true)}
                >{/* Inner image container - natural sizing with smart constraints */}
                  <div className="relative flex items-center justify-center p-6 lg:p-8">
                    <div className="relative w-full max-w-4xl">
                      <SmartImage
                        imageId={auctionData.productImages?.[0] || auctionData.productId || ''}
                        alt={auctionData.productName || 'Auction Item'}
                        className="w-full h-auto max-h-[70vh] object-contain transition-all duration-500 group-hover:scale-[1.02] rounded-lg"
                        fallbackCategory="nft"
                        priority={true}
                      />
                    </div>
                  </div>
                  
                  {/* Premium gallery frame borders */}
                  <div className="absolute inset-0 border-4 border-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-500/40 rounded-2xl pointer-events-none"></div>
                  <div className="absolute inset-2 border-2 border-amber-300/20 rounded-xl pointer-events-none group-hover:border-amber-300/40 transition-colors duration-300"></div>
                  <div className="absolute inset-6 border border-amber-200/10 rounded-lg pointer-events-none group-hover:border-amber-200/20 transition-colors duration-300"></div>
                  
                  {/* Corner decorative elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-400/60 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/60 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-400/60 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-400/60 rounded-br-lg"></div>
                    {/* Interactive elements */}
                  <div className="absolute top-6 right-6 flex space-x-2">
                    {/* Fullscreen button */}
                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80">
                      <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    
                    {/* Quality indicator */}
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-green-300 text-xs font-medium">HD</span>
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                {/* Gallery information panel */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center space-x-4 bg-gray-900/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
                    <span className="text-amber-400">🖼️</span>
                    <span className="text-gray-300 text-sm font-medium">
                      Click to view in full screen
                    </span>
                    <span className="text-amber-400">•</span>
                    <span className="text-gray-300 text-sm">
                      High resolution available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {/* Auction Details */}
          <AuctionDetails            currentBid={`${(auctionData.currentBid / 1000).toFixed(2)} ETH`}
            currentBidValue={auctionData.currentBid}
            bidCount={bidHistory.length}
            watchers={0} // Will be updated when API supports it
            bidHistory={bidHistory}
          />
          
          {/* Theater Audience - Lower Section */}
          <motion.div
            className="relative bg-gradient-to-t from-black via-gray-900 to-gray-800 min-h-[40vh] py-8"
            variants={itemVariants}
          >
            <div className="max-w-7xl mx-auto px-4">
              {/* Stage Lights */}
              <div className="absolute top-0 left-1/4 w-2 h-8 bg-gradient-to-b from-yellow-400 to-transparent opacity-60" />
              <div className="absolute top-0 right-1/4 w-2 h-8 bg-gradient-to-b from-yellow-400 to-transparent opacity-60" />              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Theater Seating - Left Side */}
                <BiddersList bidders={bidders} activeBidder={activeBidder} />
                
                {/* Right Side - Conditional Content */}
                <div className="lg:col-span-2">
                  {isOwner ? (
                    /* Owner Panel - Show End Auction Controls */
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-amber-500/30 shadow-2xl">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-amber-400 mb-2">
                          🏛️ Auction Owner Panel
                        </h3>
                        <p className="text-gray-300">
                          You are the owner of this auction. You can end it at any time.
                        </p>
                      </div>
                        {/* Auction Statistics */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {(auctionData.currentBid / 1000).toFixed(2)} ETH
                          </div>
                          <div className="text-sm text-gray-400">Current Bid</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {bidHistory.length}
                          </div>
                          <div className="text-sm text-gray-400">Total Bids</div>
                        </div>
                      </div>
                        {/* End Auction Button */}
                      <button
                        onClick={handleEndAuction}
                        disabled={isEndingAuction || timeLeft <= 0}
                        className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 disabled:transform-none mb-4"
                      >
                        {isEndingAuction ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Ending Auction...
                          </div>
                        ) : timeLeft <= 0 ? (
                          "Auction Ended"
                        ) : (
                          "🔨 End Auction Now"
                        )}
                      </button>
                      
                      {/* Test NFT Minted Button (for debugging) */}
                      <button
                        onClick={handleTestNftMinted}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium rounded-lg transition-all duration-300"
                      >
                        🧪 Test NFT Minted Status
                      </button>
                    </div>
                  ) : (
                    /* Regular Bidding Panel for Non-Owners */
                    <BiddingArea
                      bidAmount={bidAmount}
                      setBidAmount={setBidAmount}
                      handlePlaceBid={handlePlaceBid}
                      isPlacingBid={isPlacingBid}
                      bidSuccess={bidSuccess}
                      minimumBid={auctionData.currentBid + 500}
                      handleQuickBid={handleQuickBid}
                      timeLeft={timeLeft}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Auction Ended Overlay */}
          <AnimatePresence>
            <AuctionEndOverlay show={timeLeft <= 0} />
          </AnimatePresence>          {/* Analytics Modal */}
          <AuctionAnalytics
            isOpen={showAnalytics}
            onClose={handleCloseAnalytics}
            auctionId={parseInt(auctionData.auctionId)}
            productData={{
              name: auctionData.productName || "Unknown",
              artist: "Artist", // Will be updated when API supports it
              category: "Digital Art", // Will be updated when API supports it
              startingPrice: auctionData.startPrice,
              currentPrice: auctionData.currentBid,
              estimatedValue: `$${(auctionData.startPrice * 1.5).toLocaleString()} - $${(auctionData.startPrice * 2.5).toLocaleString()}`,
              rarity: "Ultra Rare", // Will be updated when API supports it
              views: 0, // Will be updated when API supports it
              likes: 0, // Will be updated when API supports it
              watchlist: 0, // Will be updated when API supports it
            }}
          />
            {/* Enhanced Fullscreen Image Modal */}
          <AnimatePresence>
            {isFullscreenOpen && (
              <motion.div
                className="fixed inset-0 bg-black/98 backdrop-blur-sm z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFullscreenOpen(false)}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-500 via-transparent to-purple-500"></div>
                
                <div className="relative max-w-screen-2xl max-h-screen w-full h-full flex items-center justify-center p-4 lg:p-8">                  {/* Top control bar */}
                  <div className="absolute top-4 right-4 z-10">
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreenOpen(false);
                      }}
                      className="bg-red-500/60 hover:bg-red-500/80 text-white rounded-full p-3 transition-colors backdrop-blur-md border border-red-400/50"
                      title="Close"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Main image container */}
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Image container with preserved aspect ratio */}
                    <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                      <SmartImage
                        imageId={auctionData.productImages?.[0] || auctionData.productId || ''}
                        alt={auctionData.productName || 'Auction Item'}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-amber-500/20"
                        fallbackCategory="nft"
                        priority={true}
                      />
                      
                      {/* Image quality indicator */}
                      <div className="absolute top-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-400/30">
                        <span className="text-green-300 text-xs font-medium">FULL RESOLUTION</span>
                      </div>
                    </div>
                  </motion.div>
                    {/* Navigation hints */}
                  <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 pointer-events-none">
                    <div className="text-white/40 text-sm text-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <p>Click outside to close</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default AuctionParticipation;
