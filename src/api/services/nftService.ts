import { apiClient } from '../client/apiClient';
import { DigitalArtNFT, GetTrendingNFTsRequest, ApiResponse } from '../types';

class NFTService {
  private readonly basePath = '/api/v1/digital-arts';

  /**
   * Lấy danh sách NFT xu hướng
   * @param params - Tham số cho request (limit)
   * @returns Promise<DigitalArtNFT[]>
   */  async getTrendingNFTs(params: GetTrendingNFTsRequest = {}): Promise<DigitalArtNFT[]> {
    try {
      const { limit = 10 } = params;
      
      console.log('🔍 Fetching trending NFTs with params:', { limit });
      console.log('🔍 Full URL will be:', `${this.basePath}/trending?limit=${limit}`);
      
      const response = await apiClient.get(
        `${this.basePath}/trending`,
        {
          params: { limit }
        }
      );

      console.log('🔍 Raw API Response:', response);
      
      // Handle different response structures
      let nftsData: DigitalArtNFT[];
      
      if (Array.isArray(response)) {
        // Direct array response
        console.log('� Direct array response detected');
        nftsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in ApiResponse
        console.log('� Wrapped ApiResponse detected');
        nftsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Another possible structure
        console.log('📦 Alternative structure detected');
        nftsData = response.data;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        nftsData = [];
      }

      console.log('✅ Final NFTs data:', nftsData);
      console.log('✅ NFTs count:', nftsData.length);

      return nftsData;
    } catch (error) {
      console.error('❌ Error fetching trending NFTs:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một NFT theo ID
   * @param nftId - ID của NFT
   * @returns Promise<DigitalArtNFT>
   */
  async getNFTById(nftId: string): Promise<DigitalArtNFT> {
    try {
      const response: ApiResponse<DigitalArtNFT> = await apiClient.get(
        `${this.basePath}/${nftId}`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching NFT by ID:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách NFT theo category
   * @param category - Category của NFT
   * @param limit - Số lượng NFT cần lấy
   * @returns Promise<DigitalArtNFT[]>
   */
  async getNFTsByCategory(category: string, limit: number = 10): Promise<DigitalArtNFT[]> {
    try {
      const response: ApiResponse<DigitalArtNFT[]> = await apiClient.get(
        `${this.basePath}/category/${category}`,
        {
          params: { limit }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs by category:', error);
      throw error;
    }
  }

  /**
   * Tìm kiếm NFT theo tên hoặc tag
   * @param query - Từ khóa tìm kiếm
   * @param limit - Số lượng NFT cần lấy
   * @returns Promise<DigitalArtNFT[]>
   */
  async searchNFTs(query: string, limit: number = 10): Promise<DigitalArtNFT[]> {
    try {
      const response: ApiResponse<DigitalArtNFT[]> = await apiClient.get(
        `${this.basePath}/search`,
        {
          params: { q: query, limit }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error searching NFTs:', error);
      throw error;
    }
  }

  /**
   * Lấy NFT của một user cụ thể
   * @param userId - ID của user
   * @param limit - Số lượng NFT cần lấy
   * @returns Promise<DigitalArtNFT[]>
   */
  async getNFTsByUser(userId: string, limit: number = 10): Promise<DigitalArtNFT[]> {
    try {
      const response: ApiResponse<DigitalArtNFT[]> = await apiClient.get(
        `${this.basePath}/user/${userId}`,
        {
          params: { limit }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs by user:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const nftService = new NFTService();
export default nftService;