import { apiClient } from '../client';
import { ApiResponse } from '../types';

// Product types
export interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  category: string;
  price: string; // BigDecimal from backend
  isAuction: boolean;
  imageIds: string[];
  sellerAddress: string;
  certificationId: string;
  appraisalCert: string; // ID của chứng thư thẩm định đã được phê duyệt
  status: string; // Default: "Available"
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number; // Current page number
  size: number; // Page size
  totalElements: number; // Total number of elements
  totalPages: number; // Total number of pages
}

export interface ProductQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

class ProductService {
  private readonly baseEndpoint = '/api/products';
  /**
   * Get all products with pagination support
   */
  async getAllProducts(params: ProductQueryParams = {}): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'price', // Đổi default thành 'price' vì đã test thành công trên Postman
      sortDir = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}?${queryParams}`);
  }

  /**
   * Get a product by ID
   */
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`${this.baseEndpoint}/${productId}`);
  }

  /**
   * Get products by category (all products in category)
   */
  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>(`${this.baseEndpoint}/category/${category}`);
  }

  /**
   * Get products by category with pagination
   */
  async getProductsByCategoryPaged(
    category: string, 
    params: ProductQueryParams = {}
  ): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDir = 'asc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}/category/${category}/page?${queryParams}`);
  }

  /**
   * Get products available for auction
   */
  async getAuctionProducts(params: ProductQueryParams = {}): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDir = 'asc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
      isAuction: 'true'
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}?${queryParams}`);
  }

  /**
   * Search products by name or description
   */
  async searchProducts(
    searchTerm: string, 
    params: ProductQueryParams = {}
  ): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDir = 'asc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
      search: searchTerm
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}/search?${queryParams}`);
  }

  /**
   * Get products by seller address
   */
  async getProductsBySeller(
    sellerAddress: string, 
    params: ProductQueryParams = {}
  ): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDir = 'asc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}/seller/${sellerAddress}?${queryParams}`);
  }

  /**
   * Get products by status
   */
  async getProductsByStatus(
    status: string, 
    params: ProductQueryParams = {}
  ): Promise<ApiResponse<PageResponse<Product>>> {
    const {
      page = 0,
      size = 10,
      sortBy = 'name',
      sortDir = 'asc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
      status
    });

    return apiClient.get<PageResponse<Product>>(`${this.baseEndpoint}?${queryParams}`);
  }
}

export const productService = new ProductService();
export { ProductService };
