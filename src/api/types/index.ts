// Re-export all API types
export * from './auth';

// Common types for API responses
export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Page response for Spring Boot pagination
export interface PageResponse<T> {
  content: T[];
  number: number; // Current page number
  size: number; // Page size
  totalElements: number; // Total number of elements
  totalPages: number; // Total number of pages
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// NFT related types
export interface DigitalArtNFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  originalImageHash: string; // Hash của hình ảnh gốc để chứng minh tính xác thực

  owner: string;
  creator: string; // Người tạo NFT ban đầu

  category: string;
  tags: string[];
  royaltyPercentage: number; // Phần trăm tiền bản quyền

  tokenId: string;
  contractAddress: string;
  nftId: string;

  createdAt: string;
  mintedAt: string;

  viewCount: number; // Số lượt xem
  likeCount: number; // Số lượt thích

  onSale: boolean; // Có đang được bán không
  price: number; // Giá nếu đang bán

  // Các trường thông tin về báo cáo vi phạm bản quyền
  reported: boolean; // Đánh dấu NFT đã bị báo cáo
  reportReason?: string; // Lý do báo cáo
  reportedBy?: string; // Người báo cáo
  reportedAt?: string; // Thời gian báo cáo

  // Thông tin về cách tạo NFT
  creationMethod: 'UPLOAD' | 'DRAWING'; // "UPLOAD" hoặc "DRAWING"
}

// NFT model from backend
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  productId: string;
  owner: string;
  tokenId: string;
  contractAddress: string;
  nftId: string;
  mintDate: string; // ISO date string
}

// Request/Response types for NFT API
export interface GetTrendingNFTsRequest {
  limit?: number;
}

export interface GetTrendingNFTsResponse {
  message: string;
  data: DigitalArtNFT[];
  success: boolean;
}

// Request types for creating NFT from drawing
export interface CreateDigitalArtNFTFromDrawingRequest {
  image: string; // base64 image data
  name: string;
  description: string;
  category?: string;
  owner?: string; // optional, will be overridden by JWT
  tags?: string; // comma-separated tags
  royaltyPercentage?: string; // default is "0"
}

// Product types (from MongoDB backend)
export interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  category: string;
  price: string; // BigDecimal from backend as string
  isAuction: boolean;
  imageIds: string[];
  sellerAddress: string;
  certificationId: string;
  appraisalCert: string; // ID của chứng thư thẩm định đã được phê duyệt
  status: string; // Default: "Available"
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Payment related types
export interface PaymentRequestDTO {
  paymentMethod: string; // "CRYPTO" | "FIAT"
  transactionHash?: string; // For MetaMask transactions
  amount?: number;
}

export interface Transaction {
  id: string;
  nftId: string;
  buyerWalletAddress: string;
  sellerWalletAddress: string;
  amount: number;
  paymentMethod: string;
  transactionHash?: string;
  status: string; // "PENDING" | "COMPLETED" | "FAILED"
  createdAt: string;
  updatedAt: string;
}

export interface MetaMaskTransactionData {
  from: string;
  to: string;
  value: number;
  nftId: string;
  tokenId: string;
  contractAddress: string;
}

export interface PaymentResponse {
  message: string;
  transaction: Transaction;
  nft: DigitalArtNFT;
}

export interface MetaMaskPaymentResponse {
  message: string;
  transactionData: MetaMaskTransactionData;
}

export interface PaymentConfirmationData {
  transactionId: string;
  status: string;
}

export interface PaymentConfirmationResponse {
  message: string;
  transactionStatus: string;
}
