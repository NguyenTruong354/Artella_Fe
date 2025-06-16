import { apiClient } from '../client/apiClient';
import { AuctionDTO } from '../../types/auction';

interface GetAllAuctionsParams {
  productId?: string;
  status?: string;
}

class AuctionService {
  private readonly basePath = '/api/auctions'; // Thử với 'auction' thay vì 'auctions'

  /**
   * Lấy tất cả các phiên đấu giá, có thể lọc theo productId hoặc status
   * @param params - Các tham số lọc (productId, status)
   * @returns Promise<AuctionDTO[]>
   */  async getAllAuctions(params: GetAllAuctionsParams = {}): Promise<AuctionDTO[]> {
    try {
      const response = await apiClient.get(
        `${this.basePath}`,
        {
          params: params,
        }
      );
      
      console.log('🔍 Raw auctions response:', response);
      
      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        // Response structure: { success: true, data: [...], message: "..." }
        return response.data;
      } else if (response && Array.isArray(response)) {
        // Direct array response
        return response;
      } else {
        console.warn('⚠️ Unexpected auctions response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching all auctions:', error);
      throw error;
    }
  }
}

export const auctionService = new AuctionService();
