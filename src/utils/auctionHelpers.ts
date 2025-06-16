import { AuctionDTO, ScheduledAuctionDetailDTO } from '../types/auction';

// Interface for display data in the UI
export interface AuctionDisplayData {
  id: string;
  title: string;
  artist: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidders: number;
  category: string;
  isHot: boolean;
  estimatedValue: string;
  totalBids: number;
  highestBidder: string;
  storyType: string;
  readingTime: string;
  tags: string[];
  status: string;
  lastUpdate: string;
  storyPreview: string;
  location: string;
  type: 'live' | 'scheduled';
  endTime?: number; // timestamp
  startPrice?: number;
  scheduledTime?: string;
}

/**
 * Convert AuctionDTO to display format
 */
export const convertAuctionToDisplay = (auction: AuctionDTO): AuctionDisplayData => {
  // Check if NFT is already minted
  const isNFTMinted = auction.status === 'NFT_MINTED';
    // Debug log for currentBid values
  console.log(`🔍 Auction ${auction.auctionId}:`, {
    status: auction.status,
    isNFTMinted,
    currentBid: auction.currentBid,
    startPrice: auction.startPrice,
    // Check if values are already in ETH (small numbers) or Wei (very large numbers)
    isCurrentBidWei: auction.currentBid > 1000000,
    isStartPriceWei: auction.startPrice > 1000000
  });
  
  // Only calculate time left if NFT is not minted
  const timeLeft = isNFTMinted ? 'Auction Completed' : calculateTimeLeft(auction.endTime);
  const isEndingSoon = !isNFTMinted && Boolean(auction.endTime && (auction.endTime - Date.now()) < 3600000); // 1 hour
  const hasHighBids = auction.currentBid > auction.startPrice * 2;
  // Helper function to format price (check if it's already in ETH or needs conversion from Wei)
  const formatPrice = (price: number): string => {
    // If price is very large (> 1M), assume it's in Wei and convert to ETH
    if (price > 1000000) {
      return (price / 1e18).toFixed(2);
    }
    // If price is small, assume it's already in ETH
    return price.toFixed(2);
  };

  return {
    id: auction.auctionId,
    title: auction.productName || `Product #${auction.productId}`,
    artist: auction.owner.slice(0, 6) + '...' + auction.owner.slice(-4), // Shortened wallet address
    currentBid: isNFTMinted 
      ? `Sold for ${formatPrice(auction.currentBid > 0 ? auction.currentBid : auction.startPrice)} ETH` 
      : `${formatPrice(auction.currentBid)} ETH`,
    timeLeft,
    image: auction.productImages?.[0] || '/api/placeholder/500/600',
    bidders: Math.floor(Math.random() * 50) + 5, // Mock data - replace with real bidder count
    category: 'Digital Art', // Default category - could be enhanced
    isHot: hasHighBids || isEndingSoon,
    estimatedValue: `€${(parseFloat(formatPrice(auction.startPrice)) * 2000).toLocaleString()} - €${(parseFloat(formatPrice(auction.startPrice)) * 3000).toLocaleString()}`, // Rough EUR conversion
    totalBids: Math.floor(Math.random() * 100) + 10, // Mock data
    highestBidder: auction.bidderAddress ? 
      '@' + auction.bidderAddress.slice(0, 6) + '...' + auction.bidderAddress.slice(-4) : 
      '@anonymous',    storyType: isNFTMinted ? 'NFT Collection' : isEndingSoon ? 'Bidding Wars' : hasHighBids ? 'Market Analysis' : 'Artist Spotlight',
    readingTime: '3 min read',
    tags: [
      isNFTMinted ? 'minted' : hasHighBids ? 'hot-bid' : 'steady',
      isNFTMinted ? 'completed' : isEndingSoon ? 'ending-soon' : 'active',
      'blockchain'
    ],
    status: isNFTMinted ? 'NFT Minted' : isEndingSoon ? 'Ending soon' : auction.currentBid > auction.startPrice ? 'Active bidding' : 'New auction',
    lastUpdate: 'Updated 5 min ago', // Mock - could be calculated from real timestamp
    storyPreview: generateStoryPreview(auction),
    location: 'Global',
    type: 'live',
    endTime: auction.endTime,
    startPrice: auction.startPrice
  };
};

/**
 * Convert ScheduledAuctionDetailDTO to display format
 */
export const convertScheduledAuctionToDisplay = (scheduled: ScheduledAuctionDetailDTO): AuctionDisplayData => {
  const timeUntilStart = calculateTimeUntilStart(scheduled.scheduledTime);
  
  return {
    id: scheduled.id,
    title: scheduled.productName || `Product #${scheduled.productId}`,
    artist: scheduled.owner.slice(0, 6) + '...' + scheduled.owner.slice(-4),
    currentBid: `Starting at ${(scheduled.startPrice / 1e18).toFixed(2)} ETH`,
    timeLeft: timeUntilStart,
    image: scheduled.productImages?.[0] || scheduled.imageUrl || '/api/placeholder/500/600',
    bidders: 0, // No bidders yet for scheduled auctions
    category: 'Digital Art',
    isHot: false, // Scheduled auctions are not "hot" yet
    estimatedValue: `€${((scheduled.startPrice / 1e18) * 2000).toLocaleString()} - €${((scheduled.startPrice / 1e18) * 3000).toLocaleString()}`,
    totalBids: 0,
    highestBidder: 'No bids yet',
    storyType: 'Upcoming Auction',
    readingTime: '2 min read',    tags: ['upcoming', 'scheduled', 'preview'],
    status: scheduled.status === 'PENDING' ? 'Scheduled' : scheduled.status,
    lastUpdate: `Scheduled ${formatDate(scheduled.scheduledTime)}`,
    storyPreview: generateScheduledStoryPreview(scheduled),
    location: 'Global',
    type: 'scheduled',
    scheduledTime: scheduled.scheduledTime,
    startPrice: scheduled.startPrice,
    endTime: scheduled.endTime
  };
};

/**
 * Calculate time left for live auctions
 */
function calculateTimeLeft(endTime: number): string {
  const now = Date.now();
  const timeLeft = endTime - now;
  
  if (timeLeft <= 0) {
    return 'Ended';
  }
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Calculate time until scheduled auction starts
 */
function calculateTimeUntilStart(scheduledTime: string): string {
  const now = Date.now();
  const startTime = new Date(scheduledTime).getTime();
  const timeUntil = startTime - now;
  
  if (timeUntil <= 0) {
    return 'Starting soon';
  }
  
  const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    return `${hours}h`;
  }
}

/**
 * Generate story preview for live auctions
 */
function generateStoryPreview(auction: AuctionDTO): string {
  const isHighValue = auction.currentBid > auction.startPrice * 2;
  const timeLeft = auction.endTime - Date.now();
  const isEndingSoon = timeLeft < 3600000; // 1 hour
  
  if (isEndingSoon) {
    return `This auction is in its final hour with intense bidding activity. The current bid has reached ${(auction.currentBid / 1e18).toFixed(2)} ETH, creating excitement in the collector community.`;
  } else if (isHighValue) {
    return `Market experts are closely watching this auction as bidding has exceeded expectations. The piece is generating significant interest among serious collectors and institutions.`;
  } else {
    return `A promising auction featuring digital art from an emerging creator. Early bidding shows steady interest from the community with potential for growth.`;
  }
}

/**
 * Generate story preview for scheduled auctions
 */
function generateScheduledStoryPreview(scheduled: ScheduledAuctionDetailDTO): string {
  return `This upcoming auction is highly anticipated by the collector community. Set to begin ${formatDate(scheduled.scheduledTime)}, the piece has already generated buzz on social media and art forums.`;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
