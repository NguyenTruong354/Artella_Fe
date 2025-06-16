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

// Request/Response types for NFT API
export interface GetTrendingNFTsRequest {
  limit?: number;
}

export interface GetTrendingNFTsResponse {
  message: string;
  data: DigitalArtNFT[];
  success: boolean;
}
