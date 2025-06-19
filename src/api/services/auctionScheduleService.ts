import { apiClient } from "../client/apiClient";
import {
  ScheduledAuctionDetailDTO,
  ScheduledAuction,
} from "../../types/auction";

// Interface for scheduling auction request
// Backend API sẽ tự động lấy thông tin product từ productId
// và walletAddress từ JWT token trong Authorization header
interface ScheduleAuctionRequest {
  productId: string; // ID của product cần đấu giá
  startPrice: number; // Giá khởi điểm (ETH)
  endTime: number; // Thời gian kết thúc đấu giá (timestamp)
  scheduledTime: string; // Thời gian dự kiến bắt đầu đấu giá (ISO string)
  // Optional fields (có thể bỏ qua vì backend sẽ lấy từ product)
  appraisalCert?: string; // Backend sẽ lấy từ product
  imageUrl?: string; // Backend sẽ lấy từ product
}

class AuctionScheduleService {
  private readonly basePath = "/api/scheduled-auctions"; // Thử với singular form
  /**
   * Lấy tất cả đấu giá đã lên lịch sắp diễn ra với thông tin sản phẩm chi tiết
   * API này cho phép ai cũng có thể xem được
   */
  async getUpcomingScheduledAuctions(): Promise<ScheduledAuctionDetailDTO[]> {
    try {
      const response = await apiClient.get(`${this.basePath}/upcoming`);

      console.log("🔍 Raw scheduled auctions response:", response);

      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        // Response structure: { success: true, data: [...], message: "..." }
        return response.data;
      } else if (response && Array.isArray(response)) {
        // Direct array response
        return response;
      } else {
        console.warn(
          "⚠️ Unexpected scheduled auctions response structure:",
          response
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching upcoming scheduled auctions:", error);
      throw error;
    }
  }
  /**
   * Lên lịch tạo đấu giá trong tương lai
   * API endpoint: POST /api/scheduled-auctions
   * @param auctionData - Dữ liệu để lên lịch đấu giá
   * @returns ScheduledAuctionDetailDTO với thông tin chi tiết bao gồm cả product details
   */
  async scheduleAuction(
    auctionData: ScheduleAuctionRequest
  ): Promise<ScheduledAuctionDetailDTO> {
    try {
      const response = await apiClient.post(this.basePath, auctionData);

      console.log("🔍 Schedule auction response:", response);

      // Handle response structure from API
      // Expected: ApiResponse<ScheduledAuctionDetailDTO>
      const apiResponse = response as {
        data?: { data?: ScheduledAuctionDetailDTO } | ScheduledAuctionDetailDTO;
      };
      if (apiResponse?.data && "data" in apiResponse.data) {
        return apiResponse.data.data as ScheduledAuctionDetailDTO; // ApiResponse<ScheduledAuctionDetailDTO> structure
      } else if (apiResponse?.data) {
        return apiResponse.data as ScheduledAuctionDetailDTO; // Direct ScheduledAuctionDetailDTO
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error scheduling auction:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách đấu giá đã lên lịch của người dùng hiện tại
   */
  async getMyScheduledAuctions(): Promise<ScheduledAuctionDetailDTO[]> {
    try {
      const response = await apiClient.get(`${this.basePath}/my-scheduled`);

      console.log("🔍 My scheduled auctions response:", response);

      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response && Array.isArray(response)) {
        return response;
      } else {
        console.warn(
          "⚠️ Unexpected my scheduled auctions response structure:",
          response
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching my scheduled auctions:", error);
      throw error;
    }
  }

  /**
   * Hủy một đấu giá đã được lên lịch
   */ async cancelScheduledAuction(
    scheduledAuctionId: string
  ): Promise<ScheduledAuction> {
    try {
      const response = await apiClient.delete(
        `${this.basePath}/${scheduledAuctionId}`
      );

      console.log("🔍 Cancel scheduled auction response:", response);

      // Handle response structure from API
      const apiResponse = response as {
        data?: { data?: ScheduledAuction } | ScheduledAuction;
      };
      if (apiResponse?.data && "data" in apiResponse.data) {
        return apiResponse.data.data as ScheduledAuction; // ApiResponse<ScheduledAuction> structure
      } else if (apiResponse?.data) {
        return apiResponse.data as ScheduledAuction; // Direct ScheduledAuction
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error canceling scheduled auction:", error);
      throw error;
    }
  }
}

export const auctionScheduleService = new AuctionScheduleService();
