import { apiClient } from '../client/apiClient';
import { 
  DigitalArtNFT, 
  GetTrendingNFTsRequest, 
  ApiResponse, 
  NFT, 
  CreateDigitalArtNFTFromDrawingRequest,
  PaymentRequestDTO,
  PaymentResponse,
  MetaMaskPaymentResponse,
  PaymentConfirmationData,
  PaymentConfirmationResponse
} from '../types';

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
        return response as unknown as NFT;
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
      });      console.log('🎨 Raw create NFT from drawing response:', response);

      // Handle the actual response structure from backend
      if (response && typeof response === 'object') {
        // Check if it's the direct DigitalArtNFT object (like in Postman response)
        if ('id' in response && 'name' in response && 'tokenId' in response) {          console.log('✅ Successfully created digital art NFT from drawing:', {
            id: response.id,
            name: response.name,
            tokenId: response.tokenId,
            nftId: 'nftId' in response ? response.nftId : 'N/A'
          });
          return response as unknown as DigitalArtNFT;
        }
        
        // Check if wrapped in ApiResponse format
        if ('data' in response && response.data && typeof response.data === 'object') {
          const data = response.data;
          if ('id' in data && 'name' in data && 'tokenId' in data) {
            console.log('✅ Wrapped response - Successfully created NFT:', {
              id: data.id,
              name: data.name,
              tokenId: data.tokenId
            });
            return data as DigitalArtNFT;
          }
        }
        
        // Check if it's a success response with NFT data in other fields
        if ('success' in response && response.success) {          console.log('✅ Success response detected, checking for NFT data...');
            // Type-safe way to check dynamic fields
          const responseAny = response as unknown as Record<string, unknown>;
          const possibleDataFields = ['nft', 'digitalArt', 'result', 'data'];
          
          for (const field of possibleDataFields) {
            if (field in responseAny && responseAny[field] && typeof responseAny[field] === 'object') {
              const nftData = responseAny[field] as Record<string, unknown>;
              if ('id' in nftData && 'name' in nftData) {
                console.log(`✅ Found NFT data in ${field} field`);
                return nftData as unknown as DigitalArtNFT;
              }
            }
          }
        }
        
        // If none of the above worked but response looks like an NFT object
        const hasNFTFields = ('name' in response || 'title' in response) && 
                           ('id' in response || 'tokenId' in response);
        if (hasNFTFields) {
          console.log('✅ Response has NFT-like structure, using as NFT data');
          return response as unknown as DigitalArtNFT;
        }
      }
      
      console.error('⚠️ Unexpected create NFT response structure:', response);
      console.error('📝 Response type:', typeof response);
      console.error('� Response keys:', Object.keys(response || {}));
      
      throw new Error('Unable to parse NFT creation response. Please check console for details.');
    } catch (error) {
      console.error('❌ Error creating digital art NFT from drawing:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách NFT theo owner address
   * @param ownerAddress - Địa chỉ wallet của owner
   * @returns Promise<DigitalArtNFT[]>
   */
  async getDigitalArtNFTsByOwner(ownerAddress: string): Promise<DigitalArtNFT[]> {
    try {
      console.log('🔍 Fetching NFTs by owner address:', ownerAddress);
      console.log('🔍 Full URL will be:', `${this.basePath}/owner/${ownerAddress}`);
      
      const response = await apiClient.get(`${this.basePath}/owner/${ownerAddress}`);
      
      console.log('🔍 Raw API Response:', response);
      
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

      console.log('✅ Final NFTs data:', nftsData);
      console.log('✅ NFTs count:', nftsData.length);

      return nftsData;
    } catch (error) {
      console.error('❌ Error fetching NFTs by owner:', error);
      throw error;
    }
  }

  /**
   * Đặt NFT lên bán
   * @param id - ID của NFT
   * @param price - Giá bán (ETH)
   * @returns Promise<DigitalArtNFT>
   */
  async putDigitalArtNFTOnSale(id: string, price: number): Promise<DigitalArtNFT> {
    try {
      console.log('💰 Putting NFT on sale:', { id, price });
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/sale`);
      
      const response = await apiClient.post(
        `${this.basePath}/${id}/sale`,
        null, // No body needed
        {
          params: { price }
        }
      );
      
      console.log('🔍 Raw put on sale response:', response);
      
      // Handle different response structures
      let nftData: DigitalArtNFT;
        if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftData = response.data as DigitalArtNFT;
      } else if (response && typeof response === 'object' && 'id' in response) {
        // Direct NFT object response
        console.log('📦 Direct NFT object response');
        nftData = response as unknown as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        throw new Error('Invalid put on sale response structure');
      }

      console.log('✅ NFT put on sale successfully:', nftData);
      return nftData;
    } catch (error) {
      console.error('❌ Error putting NFT on sale:', error);
      throw error;
    }
  }

  /**
   * Hủy bán NFT
   * @param id - ID của NFT
   * @returns Promise<DigitalArtNFT>
   */
  async removeDigitalArtNFTFromSale(id: string): Promise<DigitalArtNFT> {
    try {
      console.log('🚫 Removing NFT from sale:', id);
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/sale`);
      
      const response = await apiClient.delete(`${this.basePath}/${id}/sale`);
      
      console.log('🔍 Raw remove from sale response:', response);
      
      // Handle different response structures
      let nftData: DigitalArtNFT;
        if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftData = response.data as DigitalArtNFT;
      } else if (response && typeof response === 'object' && 'id' in response) {
        // Direct NFT object response
        console.log('📦 Direct NFT object response');
        nftData = response as unknown as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        throw new Error('Invalid remove from sale response structure');
      }

      console.log('✅ NFT removed from sale successfully:', nftData);
      return nftData;
    } catch (error) {
      console.error('❌ Error removing NFT from sale:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin NFT - phương thức đơn giản hóa với các tham số riêng lẻ
   * @param id - ID của NFT
   * @param params - Các tham số cập nhật (name, description, category, tags)
   * @returns Promise<DigitalArtNFT>
   */
  async updateDigitalArtNFTSimple(
    id: string, 
    params: {
      name?: string;
      description?: string;
      category?: string;
      tags?: string;
    }
  ): Promise<DigitalArtNFT> {
    try {
      console.log('✏️ Updating NFT simple:', id, params);
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/simple`);
      
      // Tạo URLSearchParams để gửi dữ liệu dưới dạng form data
      const formData = new URLSearchParams();
      
      if (params.name && params.name.trim()) {
        formData.append('name', params.name);
      }
      if (params.description && params.description.trim()) {
        formData.append('description', params.description);
      }
      if (params.category && params.category.trim()) {
        formData.append('category', params.category);
      }
      if (params.tags && params.tags.trim()) {
        formData.append('tags', params.tags);
      }

      const response = await apiClient.put(`${this.basePath}/${id}/simple`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      console.log('🔍 Raw update simple response:', response);
      
      // Handle different response structures
      let nftData: DigitalArtNFT;
        if (response && response.data && typeof response.data === 'object') {
        // Wrapped in ApiResponse
        console.log('📦 Wrapped ApiResponse detected');
        nftData = response.data as DigitalArtNFT;
      } else if (response && typeof response === 'object' && 'id' in response) {
        // Direct NFT object response
        console.log('📦 Direct NFT object response');
        nftData = response as unknown as DigitalArtNFT;
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        throw new Error('Invalid update simple response structure');
      }

      console.log('✅ NFT updated successfully:', nftData);
      return nftData;
    } catch (error) {
      console.error('❌ Error updating NFT simple:', error);
      throw error;
    }
  }

  /**
   * Xử lý thanh toán và mua NFT
   * @param id - ID của NFT
   * @param paymentRequest - Thông tin thanh toán
   * @returns Promise<PaymentResponse>
   */
  async processNFTPayment(id: string, paymentRequest: PaymentRequestDTO): Promise<PaymentResponse> {
    try {
      console.log('💳 Processing NFT payment for:', id, paymentRequest);
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/payment`);
      
      const response = await apiClient.post(`${this.basePath}/${id}/payment`, paymentRequest);
      
      console.log('🔍 Raw payment response:', response);
      
      // Handle response structure
      if (response && response.data) {
        console.log('✅ Payment processed successfully:', response.data);
        return response.data as PaymentResponse;
      } else if (response && 'message' in response && 'transaction' in response && 'nft' in response) {
        console.log('✅ Direct payment response');
        return response as PaymentResponse;
      } else {
        console.warn('⚠️ Unexpected payment response structure:', response);
        throw new Error('Invalid payment response structure');
      }
    } catch (error) {
      console.error('❌ Error processing NFT payment:', error);
      throw error;
    }
  }

  /**
   * Chuẩn bị dữ liệu giao dịch cho MetaMask
   * @param id - ID của NFT
   * @returns Promise<MetaMaskPaymentResponse>
   */
  async prepareMetaMaskPayment(id: string): Promise<MetaMaskPaymentResponse> {
    try {
      console.log('🦊 Preparing MetaMask payment for NFT:', id);
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/prepare-metamask-payment`);
      
      const response = await apiClient.get(`${this.basePath}/${id}/prepare-metamask-payment`);      console.log('🔍 Raw MetaMask preparation response:', response);
      
      // Debug the transactionData.value specifically
      const responseData = response?.data as unknown;
      const responseUnknown = response as unknown;
      
      if (response && response.data && responseData && typeof responseData === 'object' && 'transactionData' in responseData) {
        const txData = (responseData as { transactionData: { value: unknown } }).transactionData;
        console.log('🔍 Transaction Data from response.data:', txData);
        console.log('🔍 Value from response.data:', txData.value, 'Type:', typeof txData.value);
      } else if (response && responseUnknown && typeof responseUnknown === 'object' && 'transactionData' in responseUnknown) {
        const txData = (responseUnknown as { transactionData: { value: unknown } }).transactionData;
        console.log('🔍 Transaction Data from direct response:', txData);
        console.log('🔍 Value from direct response:', txData.value, 'Type:', typeof txData.value);
      }
      
      // Handle response structure
      if (response && response.data) {
        console.log('✅ MetaMask payment data prepared:', response.data);
        return response.data as MetaMaskPaymentResponse;
      } else if (response && 'message' in response && 'transactionData' in response) {
        console.log('✅ Direct MetaMask response');
        return response as MetaMaskPaymentResponse;
      } else {
        console.warn('⚠️ Unexpected MetaMask response structure:', response);
        throw new Error('Invalid MetaMask preparation response structure');
      }
    } catch (error) {
      console.error('❌ Error preparing MetaMask payment:', error);
      throw error;
    }
  }

  /**
   * Xác nhận thanh toán (webhook từ bên thứ ba)
   * @param id - ID của NFT
   * @param confirmationData - Dữ liệu xác nhận thanh toán
   * @returns Promise<PaymentConfirmationResponse>
   */
  async confirmPayment(id: string, confirmationData: PaymentConfirmationData): Promise<PaymentConfirmationResponse> {
    try {
      console.log('✅ Confirming payment for NFT:', id, confirmationData);
      console.log('🔍 Full URL will be:', `${this.basePath}/${id}/payment/confirm`);
      
      const response = await apiClient.post(`${this.basePath}/${id}/payment/confirm`, confirmationData);
      
      console.log('🔍 Raw payment confirmation response:', response);
      
      // Handle response structure
      if (response && response.data) {
        console.log('✅ Payment confirmation processed:', response.data);
        return response.data as PaymentConfirmationResponse;
      } else if (response && 'message' in response && 'transactionStatus' in response) {
        console.log('✅ Direct confirmation response');
        return response as PaymentConfirmationResponse;
      } else {
        console.warn('⚠️ Unexpected confirmation response structure:', response);
        throw new Error('Invalid payment confirmation response structure');
      }
    } catch (error) {
      console.error('❌ Error confirming payment:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const nftService = new NFTService();
export default nftService;