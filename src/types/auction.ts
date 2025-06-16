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

export type ScheduledAuctionStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'CANCELLED';

export interface ScheduledAuction {
  id: string;
  productId: string;
  startPrice: number;
  endTime: number; // Thời gian kết thúc đấu giá (milliseconds)
  appraisalCert: string;
  owner: string; // wallet address của người tạo đấu giá
  imageUrl: string; // URL hình ảnh cho NFT
  scheduledTime: string; // Thời gian dự kiến tạo đấu giá (ISO date string)
  status: ScheduledAuctionStatus;
  createdAt: string; // Thời gian tạo lịch (ISO date string)
  processedAt?: string; // Thời gian đã xử lý (ISO date string)
  processingError?: string; // Lỗi nếu có khi xử lý
  createdAuctionId?: string; // ID của đấu giá đã được tạo (nếu đã tạo thành công)
}

export interface ScheduledAuctionDetailDTO {
  id: string;
  // Thông tin đấu giá
  productId: string;
  productName: string;
  startPrice: number;
  endTime: number;
  appraisalCert: string;
  owner: string;
  imageUrl: string;
  productImages: string[];
  // Thông tin lên lịch
  scheduledTime: string; // ISO date string
  status: ScheduledAuctionStatus;
  createdAt: string; // ISO date string
  processedAt?: string; // ISO date string
  createdAuctionId?: string;
}

export interface AuctionDTO {
  auctionId: string;
  productId: string;
  startPrice: number;
  endTime: number; // Timestamp in milliseconds
  appraisalCert?: string;
  status: string; // Consider creating an enum for AuctionStatus if specific values are known
  currentBid: number;
  bidderAddress?: string;
  owner: string;
}
