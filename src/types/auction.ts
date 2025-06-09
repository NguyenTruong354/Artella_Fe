export interface BidHistory {
  id: number;
  bidder: string;
  amount: string;
  timestamp: string;
  isWinning: boolean;
}

export interface Bidder {
  id: number;
  name: string;
  avatar: string;
  isActive: boolean;
  isVIP: boolean;
  currentBid: number;
  totalBids: number;
  row: number; // 1 = front row (VIP), 2-4 = regular rows
  seat: number; // position in row
  paddleNumber: number; // Bidding paddle number
  isShowingPaddle: boolean; // Currently showing paddle
  reactionType: "none" | "clapping" | "excited" | "disappointed"; // Current reaction
}

export interface AuctionDetails {
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
