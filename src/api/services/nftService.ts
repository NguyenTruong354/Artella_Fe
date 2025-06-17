import { apiClient } from '../client/apiClient';
import { DigitalArtNFT, GetTrendingNFTsRequest, ApiResponse, NFT, CreateDigitalArtNFTFromDrawingRequest } from '../types';

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
   * Tìm kiếm DigitalArtNFT theo từ khóa
   * @param keyword - Từ khóa tìm kiếm
   * @returns Promise<DigitalArtNFT[]>
   */
  async searchDigitalArtNFTs(keyword: string): Promise<DigitalArtNFT[]> {
    try {
      console.log('🔍 Searching digital art NFTs with keyword:', keyword);
      
      const response = await apiClient.get(`${this.basePath}/search`, {
        params: { keyword }
      });
      
      console.log('🔍 Raw search response:', response);
      
      // Handle different response structures
      let nftsData: DigitalArtNFT[];
      
      if (Array.isArray(response)) {
        // Direct array response
        console.log('📦 Direct array response detected');
        nftsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Another possible structure
        console.log('📦 Alternative structure detected');
        nftsData = response.data;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        nftsData = [];
      }

      console.log('✅ Search results:', nftsData);
      console.log('✅ Search results count:', nftsData.length);

      return nftsData;
    } catch (error) {
      console.error('❌ Error searching digital art NFTs:', error);
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
  /**
   * Lấy chi tiết NFT theo tokenId
   * @param tokenId - Token ID của NFT
   * @returns Promise<NFT>
   */
  async getNFTByTokenId(tokenId: string): Promise<NFT> {
    try {
      console.log('🔍 Fetching NFT by tokenId:', tokenId);
      
      const response = await apiClient.get(`/api/nft/${tokenId}`);
      
      console.log('🔍 Raw NFT response:', response);
      
      // Handle different response structures
      if (response && response.data && typeof response.data === 'object') {
        // Response structure: { success: true, data: {...}, message: "..." }
        console.log('✅ Successfully fetched NFT:', response.data);
        return response.data as NFT;
      } else if (response && typeof response === 'object' && 'id' in response) {
        // Direct NFT object response
        console.log('✅ Direct NFT object response');
        return response as NFT;
      } else {
        console.warn('⚠️ Unexpected NFT response structure:', response);
        throw new Error('Invalid NFT response structure');
      }
    } catch (error) {
      console.error('❌ Error fetching NFT by tokenId:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả DigitalArtNFT
   * @returns Promise<DigitalArtNFT[]>
   */
  async getAllDigitalArtNFTs(): Promise<DigitalArtNFT[]> {
    try {
      console.log('🔍 Fetching all digital art NFTs...');
      
      const response = await apiClient.get(this.basePath);
      
      console.log('🔍 Raw all NFTs response:', response);
      
      // Handle different response structures
      if (Array.isArray(response)) {
        // Direct array response
        console.log('✅ Direct array response, count:', response.length);
        return response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in ApiResponse
        console.log('✅ Wrapped response, count:', response.data.length);
        return response.data;
      } else {
        console.warn('⚠️ Unexpected all NFTs response structure:', response);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching all digital art NFTs:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết DigitalArtNFT theo ID (sẽ tự động tăng view count)
   * @param id - ID của DigitalArtNFT
   * @returns Promise<DigitalArtNFT>
   */
  async getDigitalArtNFTById(id: string): Promise<DigitalArtNFT> {
    try {
      console.log('🔍 Fetching digital art NFT by ID:', id);
      
      const response = await apiClient.get(`${this.basePath}/${id}`);
      
      console.log('🔍 Raw digital art NFT response:', response);
        // Handle different response structures
      if (response && typeof response === 'object' && 'id' in response) {
        // Direct DigitalArtNFT object response
        console.log('✅ Successfully fetched digital art NFT:', response.id);
        return response as unknown as DigitalArtNFT;
      } else if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('✅ Wrapped digital art NFT response');
        return response.data as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected digital art NFT response structure:', response);
        throw new Error('Invalid digital art NFT response structure');
      }
    } catch (error) {
      console.error('❌ Error fetching digital art NFT by ID:', error);
      throw error;
    }
  }
  /**
   * Lấy chi tiết DigitalArtNFT theo tokenId
   * @param tokenId - Token ID của DigitalArtNFT
   * @returns Promise<DigitalArtNFT>
   */
  async getDigitalArtNFTByTokenId(tokenId: string): Promise<DigitalArtNFT> {
    try {
      console.log('🔍 Fetching digital art NFT by tokenId:', tokenId);
      
      const response = await apiClient.get(`${this.basePath}/token/${tokenId}`);
      
      console.log('🔍 Raw digital art NFT by tokenId response:', response);
        // Handle different response structures
      if (response && typeof response === 'object' && 'id' in response) {
        // Direct DigitalArtNFT object response
        console.log('✅ Successfully fetched digital art NFT by tokenId:', response.id);
        return response as unknown as DigitalArtNFT;
      } else if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('✅ Wrapped digital art NFT by tokenId response');
        return response.data as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected digital art NFT by tokenId response structure:', response);
        throw new Error('Invalid digital art NFT by tokenId response structure');
      }
    } catch (error) {
      console.error('❌ Error fetching digital art NFT by tokenId:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách DigitalArtNFT theo category
   * @param category - Category của DigitalArtNFT
   * @returns Promise<DigitalArtNFT[]>
   */
  async getDigitalArtNFTsByCategory(category: string): Promise<DigitalArtNFT[]> {
    try {
      console.log('🔍 Fetching digital art NFTs by category:', category);
      
      const response = await apiClient.get(`${this.basePath}/category/${category}`);
      
      console.log('🔍 Raw digital art NFTs by category response:', response);
      
      // Handle different response structures
      let nftsData: DigitalArtNFT[];
      
      if (Array.isArray(response)) {
        // Direct array response
        console.log('📦 Direct array response detected');
        nftsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Another possible structure
        console.log('📦 Alternative structure detected');
        nftsData = response.data;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        nftsData = [];
      }

      console.log('✅ Final NFTs by category data:', nftsData);
      console.log('✅ NFTs by category count:', nftsData.length);

      return nftsData;
    } catch (error) {
      console.error('❌ Error fetching digital art NFTs by category:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách DigitalArtNFT theo tag
   * @param tag - Tag của DigitalArtNFT
   * @returns Promise<DigitalArtNFT[]>
   */
  async getDigitalArtNFTsByTag(tag: string): Promise<DigitalArtNFT[]> {
    try {
      console.log('🔍 Fetching digital art NFTs by tag:', tag);
      
      const response = await apiClient.get(`${this.basePath}/tag/${tag}`);
      
      console.log('🔍 Raw digital art NFTs by tag response:', response);
      
      // Handle different response structures
      let nftsData: DigitalArtNFT[];
      
      if (Array.isArray(response)) {
        // Direct array response
        console.log('📦 Direct array response detected');
        nftsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftsData = response.data;
      } else if (response && Array.isArray(response.data)) {
        // Another possible structure
        console.log('📦 Alternative structure detected');
        nftsData = response.data;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        nftsData = [];
      }

      console.log('✅ Final NFTs by tag data:', nftsData);
      console.log('✅ NFTs by tag count:', nftsData.length);

      return nftsData;
    } catch (error) {
      console.error('❌ Error fetching digital art NFTs by tag:', error);
      throw error;
    }
  }

  /**
   * Tạo DigitalArtNFT từ dữ liệu vẽ (base64) - phương thức đơn giản hóa
   * @param requestData - Dữ liệu request để tạo NFT từ drawing
   * @returns Promise<DigitalArtNFT>
   */
  async createDigitalArtNFTFromDrawingSimple(requestData: CreateDigitalArtNFTFromDrawingRequest): Promise<DigitalArtNFT> {
    try {
      console.log('🎨 Creating digital art NFT from drawing with data:', {
        name: requestData.name,
        description: requestData.description,
        category: requestData.category,
        hasImage: !!requestData.image,
        imageLength: requestData.image?.length || 0
      });

      // Tạo FormData để gửi request với multipart/form-data
      const formData = new FormData();
      formData.append('image', requestData.image);
      formData.append('name', requestData.name);
      formData.append('description', requestData.description);
      
      if (requestData.category) {
        formData.append('category', requestData.category);
      }
      
      if (requestData.owner) {
        formData.append('owner', requestData.owner);
      }
      
      if (requestData.tags) {
        formData.append('tags', requestData.tags);
      }
      
      if (requestData.royaltyPercentage) {
        formData.append('royaltyPercentage', requestData.royaltyPercentage);
      }

      const response = await apiClient.post(`${this.basePath}/draw-simple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('🎨 Raw create NFT from drawing response:', response);

      // Handle different response structures
      if (response && typeof response === 'object' && 'id' in response) {
        // Direct DigitalArtNFT object response
        console.log('✅ Successfully created digital art NFT from drawing:', response.id);
        return response as unknown as DigitalArtNFT;
      } else if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('✅ Wrapped create NFT from drawing response');
        return response.data as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected create NFT from drawing response structure:', response);
        throw new Error('Invalid create NFT from drawing response structure');
      }
    } catch (error) {
      console.error('❌ Error creating digital art NFT from drawing:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const nftService = new NFTService();
export default nftService;