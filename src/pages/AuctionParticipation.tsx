import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// All imports are now in components
import {
  AuctionHeader,
  AuctionGallery,
  BiddingArea,
  AuctionDetails,
  BiddersList,
  AuctionEndOverlay,
} from "../components/Auction/AuctionParticipation";
import AuctionSound from "../components/Auction/AuctionSound";
import {
  BidHistory,
  Bidder,
  AuctionDetails as AuctionDetailsType,
} from "../types/auction";

const AuctionParticipation: React.FC = () => {
  const navigate = useNavigate();
  // Mock data - trong thực tế sẽ fetch từ API
  const [auctionData] = useState<AuctionDetailsType>({
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
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800",
    ],
    currentBid: "$12,500",
    currentBidValue: 12500,
    estimatedValue: "$15,000 - $25,000",
    timeLeft: "02:45:30",
    timeLeftSeconds: 9930,
    bidCount: 47,
    category: "Digital Art",
    auctionHouse: "Premium Art Gallery",
    description:
      "A mesmerizing digital masterpiece that captures the essence of contemporary abstract expressionism through innovative AI-assisted techniques.",
    condition: "Mint condition",
    provenance: "Direct from artist studio",
    minimumBid: 13000,
    bidIncrement: 500,
    watchers: 156,
    isWatched: false,
  });
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([
    {
      id: 1,
      bidder: "ArtLover123",
      amount: "$12,500",
      timestamp: "2 min ago",
      isWinning: true,
    },
    {
      id: 2,
      bidder: "CollectorPro",
      amount: "$12,000",
      timestamp: "5 min ago",
      isWinning: false,
    },
    {
      id: 3,
      bidder: "DigitalVision",
      amount: "$11,500",
      timestamp: "8 min ago",
      isWinning: false,
    },
    {
      id: 4,
      bidder: "ArtistFan2024",
      amount: "$11,000",
      timestamp: "12 min ago",
      isWinning: false,
    },
    {
      id: 5,
      bidder: "ModernArt",
      amount: "$10,500",
      timestamp: "15 min ago",
      isWinning: false,
    },
  ]);
  // Theater audience - bidders in seats
  const [bidders, setBidders] = useState<Bidder[]>([
    // VIP Front Row
    {
      id: 1,
      name: "ArtLover123",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      isActive: true,
      isVIP: true,
      currentBid: 12500,
      totalBids: 8,
      row: 1,
      seat: 1,
      paddleNumber: 101,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 2,
      name: "CollectorPro",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      isActive: false,
      isVIP: true,
      currentBid: 12000,
      totalBids: 5,
      row: 1,
      seat: 2,
      paddleNumber: 102,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 3,
      name: "DigitalVision",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100",
      isActive: false,
      isVIP: true,
      currentBid: 11500,
      totalBids: 3,
      row: 1,
      seat: 3,
      paddleNumber: 103,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 4,
      name: "GalleryOwner",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      isActive: false,
      isVIP: true,
      currentBid: 0,
      totalBids: 0,
      row: 1,
      seat: 4,
      paddleNumber: 104,
      isShowingPaddle: false,
      reactionType: "none",
    },

    // Regular rows
    {
      id: 5,
      name: "ArtistFan2024",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 11000,
      totalBids: 2,
      row: 2,
      seat: 1,
      paddleNumber: 201,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 6,
      name: "ModernArt",
      avatar:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 10500,
      totalBids: 1,
      row: 2,
      seat: 2,
      paddleNumber: 202,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 7,
      name: "NewCollector",
      avatar:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 2,
      seat: 3,
      paddleNumber: 203,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 8,
      name: "ArtEnthusiast",
      avatar:
        "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 2,
      seat: 4,
      paddleNumber: 204,
      isShowingPaddle: false,
      reactionType: "none",
    },

    {
      id: 9,
      name: "FirstTimeBidder",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 3,
      seat: 1,
      paddleNumber: 301,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 10,
      name: "ArtInvestor",
      avatar:
        "https://images.unsplash.com/photo-1534308143481-c55c22c71d3e?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 3,
      seat: 2,
      paddleNumber: 302,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 11,
      name: "Observer",
      avatar: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 3,
      seat: 3,
      paddleNumber: 303,
      isShowingPaddle: false,
      reactionType: "none",
    },
    {
      id: 12,
      name: "YoungCollector",
      avatar:
        "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=100",
      isActive: false,
      isVIP: false,
      currentBid: 0,
      totalBids: 0,
      row: 3,
      seat: 4,
      paddleNumber: 304,
      isShowingPaddle: false,
      reactionType: "none",
    },
  ]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isWatched, setIsWatched] = useState(auctionData.isWatched);
  const [timeLeft, setTimeLeft] = useState(auctionData.timeLeftSeconds);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  // Zoom level is now managed by the AuctionGallery component
  const [activeBidder, setActiveBidder] = useState<number | null>(null);
  const [hasNewBid, setHasNewBid] = useState(false);
  const [hasApplause, setHasApplause] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(true);
  // Countdown timer
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

  // Realistic auction crowd simulation
  useEffect(() => {
    const simulateAuctionActivity = () => {
      // Random bidder activity every 15-30 seconds
      const interval = setInterval(() => {
        if (timeLeft > 0 && Math.random() > 0.6) {
          const availableBidders = bidders.filter(
            (b) => !b.isShowingPaddle && b.reactionType === "none"
          );

          if (availableBidders.length > 0) {
            const randomBidder =
              availableBidders[
                Math.floor(Math.random() * availableBidders.length)
              ];

            // Show paddle briefly
            setBidders((prev) =>
              prev.map((bidder) =>
                bidder.id === randomBidder.id
                  ? {
                      ...bidder,
                      isShowingPaddle: true,
                      reactionType: "excited" as const,
                    }
                  : bidder
              )
            );

            // Trigger crowd reactions for competitive bids
            if (Math.random() > 0.7) {
              setTimeout(() => {
                setBidders((prev) =>
                  prev.map((bidder) => ({
                    ...bidder,
                    reactionType:
                      bidder.id !== randomBidder.id && Math.random() > 0.5
                        ? ("clapping" as const)
                        : bidder.reactionType,
                  }))
                );
              }, 800);
            }

            // Reset after animation
            setTimeout(() => {
              setBidders((prev) =>
                prev.map((bidder) => ({
                  ...bidder,
                  isShowingPaddle: false,
                  reactionType: "none" as const,
                }))
              );
            }, 3000);
          }
        }
      }, Math.random() * 15000 + 15000); // 15-30 seconds

      return interval;
    };

    const activityInterval = simulateAuctionActivity();
    return () => clearInterval(activityInterval);
  }, [timeLeft, bidders]);

  // Tension building as auction ends
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0) {
      // Last 5 minutes
      const tensionInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          setBidders((prev) =>
            prev.map((bidder) => ({
              ...bidder,
              reactionType:
                Math.random() > 0.5 ? ("excited" as const) : ("none" as const),
            }))
          );

          setTimeout(() => {
            setBidders((prev) =>
              prev.map((bidder) => ({
                ...bidder,
                reactionType: "none" as const,
              }))
            );
          }, 2000);
        }
      }, 5000);

      return () => clearInterval(tensionInterval);
    }
  }, [timeLeft]);

  // Realistic auction crowd simulation
  useEffect(() => {
    const simulateAuctionActivity = () => {
      // Random bidder activity every 15-30 seconds
      const interval = setInterval(() => {
        if (timeLeft > 0 && Math.random() > 0.6) {
          const availableBidders = bidders.filter(
            (b) => !b.isShowingPaddle && b.reactionType === "none"
          );

          if (availableBidders.length > 0) {
            const randomBidder =
              availableBidders[
                Math.floor(Math.random() * availableBidders.length)
              ];

            // Show paddle briefly
            setBidders((prev) =>
              prev.map((bidder) =>
                bidder.id === randomBidder.id
                  ? {
                      ...bidder,
                      isShowingPaddle: true,
                      reactionType: "excited" as const,
                    }
                  : bidder
              )
            );

            // Trigger crowd reactions for competitive bids
            if (Math.random() > 0.7) {
              setTimeout(() => {
                setBidders((prev) =>
                  prev.map((bidder) => ({
                    ...bidder,
                    reactionType:
                      bidder.id !== randomBidder.id && Math.random() > 0.5
                        ? ("clapping" as const)
                        : bidder.reactionType,
                  }))
                );
              }, 800);
            }

            // Reset after animation
            setTimeout(() => {
              setBidders((prev) =>
                prev.map((bidder) => ({
                  ...bidder,
                  isShowingPaddle: false,
                  reactionType: "none" as const,
                }))
              );
            }, 3000);
          }
        }
      }, Math.random() * 15000 + 15000); // 15-30 seconds

      return interval;
    };

    const activityInterval = simulateAuctionActivity();
    return () => clearInterval(activityInterval);
  }, [timeLeft, bidders]);

  // Tension building as auction ends
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0) {
      // Last 5 minutes
      const tensionInterval = setInterval(() => {
        if (Math.random() > 0.8) {
          setBidders((prev) =>
            prev.map((bidder) => ({
              ...bidder,
              reactionType:
                Math.random() > 0.5 ? ("excited" as const) : ("none" as const),
            }))
          );

          setTimeout(() => {
            setBidders((prev) =>
              prev.map((bidder) => ({
                ...bidder,
                reactionType: "none" as const,
              }))
            );
          }, 2000);
        }
      }, 5000);

      return () => clearInterval(tensionInterval);
    }
  }, [timeLeft]);

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
  const formattedTimeLeft = formatTime(timeLeft);

  const handlePlaceBid = async () => {
    const bidValue = parseInt(bidAmount.replace(/[^0-9]/g, ""));

    if (bidValue < auctionData.minimumBid) {
      alert(`Minimum bid is $${auctionData.minimumBid.toLocaleString()}`);
      return;
    }

    setIsPlacingBid(true);
    setHasNewBid(true); // Trigger bid success sound

    // Simulate bidder paddle action and reactions
    const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
    setActiveBidder(randomBidder.id);

    // Update bidder with paddle and reaction
    setBidders((prev) =>
      prev.map((bidder) => {
        if (bidder.id === randomBidder.id) {
          return {
            ...bidder,
            isShowingPaddle: true,
            reactionType: "excited" as const,
          };
        }
        return bidder;
      })
    );

    // Trigger crowd reactions for high bids
    if (bidValue > auctionData.currentBidValue + 1000) {
      setTimeout(() => {
        setBidders((prev) =>
          prev.map((bidder) => ({
            ...bidder,
            reactionType:
              bidder.id !== randomBidder.id ? "clapping" : bidder.reactionType,
          }))
        );
        setHasApplause(true); // Trigger applause sound
      }, 500);
    }

    // Simulate API call
    setTimeout(() => {
      const newBid: BidHistory = {
        id: bidHistory.length + 1,
        bidder: "You",
        amount: `$${bidValue.toLocaleString()}`,
        timestamp: "Just now",
        isWinning: true,
      };

      setBidHistory((prev) => [
        newBid,
        ...prev.map((bid) => ({ ...bid, isWinning: false })),
      ]);
      setBidAmount("");
      setIsPlacingBid(false);
      setBidSuccess(true);

      // Reset paddle and reactions after animation
      setTimeout(() => {
        setActiveBidder(null);
        setBidders((prev) =>
          prev.map((bidder) => ({
            ...bidder,
            isShowingPaddle: false,
            reactionType: "none" as const,
          }))
        );
        setHasNewBid(false); // Reset bid sound
        setHasApplause(false); // Reset applause sound
      }, 2000);

      setTimeout(() => setBidSuccess(false), 3000);
    }, 1500);
  };

  const handleQuickBid = (increment: number) => {
    const newBid = auctionData.currentBidValue + increment;
    setBidAmount(`$${newBid.toLocaleString()}`);
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sound System */}
      <AuctionSound
        isActive={isSoundActive}
        hasNewBid={hasNewBid}
        hasApplause={hasApplause}
      />
      {/* Header */}
      <AuctionHeader
        id={auctionData.id}
        auctionHouse={auctionData.auctionHouse}
        timeLeft={formattedTimeLeft}
        isWatched={isWatched}
        isSoundActive={isSoundActive}
        onNavigateBack={() => navigate(-1)}
        onToggleWatch={() => setIsWatched(!isWatched)}
        onToggleSound={handleToggleSound}
      />
      {/* Gallery Wall - Upper Theater */}{" "}
      <AuctionGallery image={auctionData.image} />
      {/* Include AuctionDetails within the gallery section */}
      <AuctionDetails
        currentBid={auctionData.currentBid}
        currentBidValue={auctionData.currentBidValue}
        bidCount={auctionData.bidCount}
        watchers={auctionData.watchers}
        bidHistory={bidHistory}
      />
      {/* Rest of the component remains unchanged */}
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
            {" "}
            {/* Theater Seating - Left Side */}
            <BiddersList bidders={bidders} activeBidder={activeBidder} />
            {/* Bidding Panel - Right Side */}
            <BiddingArea
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              handlePlaceBid={handlePlaceBid}
              isPlacingBid={isPlacingBid}
              bidSuccess={bidSuccess}
              minimumBid={auctionData.minimumBid}
              handleQuickBid={handleQuickBid}
              timeLeft={timeLeft}
            />
          </div>
        </div>
      </motion.div>{" "}
      {/* Success Toast is now handled by BiddingArea component */}{" "}
      {/* Auction Ended Overlay */}
      <AnimatePresence>
        <AuctionEndOverlay show={timeLeft <= 0} />
      </AnimatePresence>
    </motion.div>
  );
};

export default AuctionParticipation;
