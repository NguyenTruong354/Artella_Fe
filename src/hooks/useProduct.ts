import { useState, useEffect, useCallback } from 'react';
import { productService } from '../api/services';
import { Product, ProductQueryParams } from '../api/types';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  };
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface UseProductsParams extends ProductQueryParams {
  category?: string;
  sellerAddress?: string;
  status?: string;
  searchTerm?: string;
  isAuction?: boolean;
  autoLoad?: boolean;
}

export function useProducts(params: UseProductsParams = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: params.size || 10,
  });

  const {
    category,
    sellerAddress,
    status,
    searchTerm,
    isAuction,
    autoLoad = true,
    ...queryParams
  } = params;

  const loadProducts = useCallback(async (page: number = 0, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const requestParams = { ...queryParams, page, size: pagination.pageSize };

      if (category) {
        response = await productService.getProductsByCategoryPaged(category, requestParams);
      } else if (sellerAddress) {
        response = await productService.getProductsBySeller(sellerAddress, requestParams);
      } else if (searchTerm) {
        response = await productService.searchProducts(searchTerm, requestParams);
      } else if (isAuction) {
        response = await productService.getAuctionProducts(requestParams);
      } else if (status) {
        response = await productService.getProductsByStatus(status, requestParams);
      } else {
        response = await productService.getAllProducts(requestParams);
      }

      if (response.success && response.data) {
        const pageData = response.data;
        setProducts(append ? prev => [...prev, ...pageData.content] : pageData.content);
        setPagination({
          currentPage: pageData.pageNumber,
          totalPages: pageData.totalPages,
          totalElements: pageData.totalElements,
          pageSize: pageData.pageSize,
        });
      } else {
        setError(response.message || 'Failed to load products');
      }    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading products');
    } finally {
      setLoading(false);
    }
  }, [category, sellerAddress, status, searchTerm, isAuction, queryParams, pagination.pageSize]);

  const refresh = useCallback(() => {
    return loadProducts(0, false);
  }, [loadProducts]);

  const loadMore = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages - 1) {
      return loadProducts(pagination.currentPage + 1, true);
    }
    return Promise.resolve();
  }, [loadProducts, pagination.currentPage, pagination.totalPages]);

  const hasMore = pagination.currentPage < pagination.totalPages - 1;

  useEffect(() => {
    if (autoLoad) {
      loadProducts();
    }
  }, [autoLoad, loadProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refresh,
    loadMore,
    hasMore,
  };
}

export interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProduct(productId: string | null): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProductById(productId);
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.message || 'Failed to load product');
      }    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const refresh = useCallback(() => {
    return loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    product,
    loading,
    error,
    refresh,
  };
}
