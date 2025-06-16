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
   */
  async getAllAuctions(params: GetAllAuctionsParams = {}): Promise<AuctionDTO[]> {
    try {
      const response = await apiClient.get(
        `${this.basePath}`,
        {
          params: params,
        }
      );
      
      console.log('🔍 Raw auctions response:', response);
      
      // Handle ApiResponse structure: { success: true, data: [...], message: "...", timestamp: "..." }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data as AuctionDTO[];
      } else {
        console.warn('⚠️ Unexpected auctions response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching all auctions:', error);
      throw error;    }
  }

  /**
   * Lấy thông tin chi tiết của một phiên đấu giá theo auctionId
   * @param auctionId - ID của phiên đấu giá
   * @returns Promise<AuctionDTO>
   */
  async getAuction(auctionId: string): Promise<AuctionDTO> {
    try {
      const response = await apiClient.get(`${this.basePath}/${auctionId}`);
      
      console.log('🔍 Raw auction response:', response);
      
      // API client returns ApiResponse<T>, so we access the data property
      if (response && response.data) {
        return response.data as AuctionDTO;
      } else {
        throw new Error(`Auction with ID ${auctionId} not found`);
      }
    } catch (error) {
      console.error(`Error fetching auction ${auctionId}:`, error);
      throw error;
    }
  }
}

export const auctionService = new AuctionService();
