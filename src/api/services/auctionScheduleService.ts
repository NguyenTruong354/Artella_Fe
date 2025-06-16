import { apiClient } from '../client/apiClient';
import { ScheduledAuctionDetailDTO } from '../../types/auction';

class AuctionScheduleService {
  private readonly basePath = '/api/scheduled-auctions'; // Thử với singular form
  /**
   * Lấy tất cả đấu giá đã lên lịch sắp diễn ra với thông tin sản phẩm chi tiết
   * API này cho phép ai cũng có thể xem được
   */
  async getUpcomingScheduledAuctions(): Promise<ScheduledAuctionDetailDTO[]> {
    try {
      const response = await apiClient.get(
        `${this.basePath}/upcoming`
      );
      
      console.log('🔍 Raw scheduled auctions response:', response);
      
      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        // Response structure: { success: true, data: [...], message: "..." }
        return response.data;
      } else if (response && Array.isArray(response)) {
        // Direct array response
        return response;
      } else {
        console.warn('⚠️ Unexpected scheduled auctions response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching upcoming scheduled auctions:', error);
      throw error;
    }
  }
}

export const auctionScheduleService = new AuctionScheduleService();
