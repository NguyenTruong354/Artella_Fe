import { useState, useEffect, useCallback } from 'react';
import { productService, type Product, type ProductQueryParams } from '../api/services/productService';
import { nftService, type DigitalArtNFT } from '../api/services/nftService';

export interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  price: number;
  imageUrl: string;
  tags: string[];
  description: string;
  isAuction: boolean;
  status: string;
  createdAt: string;
  type: 'product' | 'nft';
  originalData: Product | DigitalArtNFT;
}

export interface UseGalleryDataParams {
  category?: string;
  searchQuery?: string;
  dataType?: 'products' | 'nfts' | 'both';
  pageSize?: number;
}

export interface UseGalleryDataReturn {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  totalItems: number;
  currentPage: number;
}

// Helper function to map frontend categories to product API categories
const mapProductCategory = (category: string): string => {
  // Map frontend categories to actual product API categories
  const categoryMap: Record<string, string> = {
    'All': 'All',
    'Digital Art': 'Digital', // If API has a Digital category
    'Painting': 'Painting',
    'Abstract': 'Abstract',
    'Portrait': 'Portrait',
    'Nature': 'Nature',
    'Cyberpunk': 'Cyberpunk'
  };
  
  return categoryMap[category] || category;
};

// We use getNFTFilterInfo to determine whether to use tags or categories

// Helper function to get the correct filter for NFTs (either tag or category)
const getNFTFilterInfo = (category: string): { useTag: boolean; value: string } => {
  if (category === 'All') {
    return { useTag: false, value: 'All' };
  }
  
  if (category === 'Digital Art') {
    return { useTag: false, value: 'Digital Art' };
  }
  
  // For everything else, use tag filtering
  return { useTag: true, value: category.toLowerCase() };
};

// Helper function to convert Product to GalleryItem
const productToGalleryItem = (product: Product): GalleryItem => ({
  id: product.id,
  title: product.name,
  artist: product.sellerAddress.slice(0, 8) + '...' + product.sellerAddress.slice(-4), // Format address
  category: product.category,
  price: parseFloat(product.price) || 0,
  imageUrl: product.imageIds[0] || '', // Sử dụng imageId đầu tiên thay vì URL
  tags: [product.category, product.status, ...(product.isAuction ? ['auction'] : [])],
  description: product.description,
  isAuction: product.isAuction,
  status: product.status,
  createdAt: product.createdAt,
  type: 'product',
  originalData: product
});

// Helper function to convert DigitalArtNFT to GalleryItem
const nftToGalleryItem = (nft: DigitalArtNFT): GalleryItem => ({
  id: nft.id,
  title: nft.name,
  artist: nft.creator || nft.owner || 'Unknown Artist',
  category: nft.category || 'Digital Art',
  price: parseFloat(nft.price?.toString() || '0') || 0,
  imageUrl: nft.imageUrl || '', // Sử dụng imageUrl từ NFT làm imageId
  tags: nft.tags || [nft.category || 'Digital Art'],
  description: nft.description || nft.metadata?.description || '',
  isAuction: false, // NFTs are typically not auctions in this context
  status: nft.status || 'Available',
  createdAt: nft.createdAt || new Date().toISOString(),
  type: 'nft',
  originalData: nft
});

export const useGalleryData = (params: UseGalleryDataParams = {}): UseGalleryDataReturn => {
  const {
    category = 'All',
    searchQuery = '',
    dataType = 'both',
    pageSize = 12
  } = params;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Define loadData callback first
  const loadData = useCallback(async (page: number, reset: boolean = false) => {
    try {
      console.log('Loading gallery data with category:', category);
      
      const queryParams: ProductQueryParams = {
        page,
        size: pageSize,
        sortBy: 'price',
        sortDir: 'desc'
      };

      const newItems: GalleryItem[] = [];

      // Load Products
      if (dataType === 'products' || dataType === 'both') {
        try {
          let productResponse;
          const mappedProductCategory = mapProductCategory(category);
          
          console.log('Mapped product category:', mappedProductCategory);
          
          if (mappedProductCategory !== 'All') {
            // Get products by category with pagination
            console.log(`Fetching products by category: ${mappedProductCategory}`);
            productResponse = await productService.getProductsByCategoryPaged(mappedProductCategory, queryParams);
          } else {
            // Get all products with pagination
            console.log('Fetching all products');
            productResponse = await productService.getAllProducts(queryParams);
          }

          if (productResponse.success && productResponse.data) {
            const products = productResponse.data.content;
            let filteredProducts = products;

            // Apply search filter if provided
            if (searchQuery.trim()) {
              filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            const productItems = filteredProducts.map(productToGalleryItem);
            newItems.push(...productItems);

            if (reset) {
              setTotalItems(productResponse.data.totalElements);
            }
          }
        } catch (productError) {
          console.warn('Error loading products:', productError);
        }
      }

      // Load NFTs
      if (dataType === 'nfts' || dataType === 'both') {
        try {
          let nfts: DigitalArtNFT[] = [];
          const { useTag, value: mappedNFTCategory } = getNFTFilterInfo(category);
          
          console.log('Mapped NFT category:', mappedNFTCategory);

          if (mappedNFTCategory !== 'All') {
            // Get NFTs by category or tag based on the mapping
            if (useTag) {
              // Get NFTs by tag
              console.log(`Fetching NFTs by tag: ${mappedNFTCategory}`);
              nfts = await nftService.getDigitalArtNFTsByTag(mappedNFTCategory);
            } else {
              // Get NFTs by category
              console.log(`Fetching NFTs by category: ${mappedNFTCategory}`);
              nfts = await nftService.getDigitalArtNFTsByCategory(mappedNFTCategory);
            }
          } else {
            // Get all NFTs
            console.log('Fetching all NFTs');
            nfts = await nftService.getAllDigitalArtNFTs();
          }

          // Apply search filter if provided
          if (searchQuery.trim()) {
            nfts = nfts.filter(nft =>
              nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (nft.description && nft.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (nft.category && nft.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
              (nft.tags && nft.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
            );
          }

          // Apply pagination to NFTs (since API might not support it)
          const startIndex = page * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedNFTs = nfts.slice(startIndex, endIndex);

          const nftItems = paginatedNFTs.map(nftToGalleryItem);
          newItems.push(...nftItems);

          if (reset && dataType === 'nfts') {
            setTotalItems(nfts.length);
          }
        } catch (nftError) {
          console.warn('Error loading NFTs:', nftError);
        }
      }

      // Update state
      if (reset) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }

      // Check if there are more items to load
      setHasMore(newItems.length === pageSize);
      setCurrentPage(page);

    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while loading data');
    }
  }, [category, dataType, pageSize, searchQuery]);

  // Define loadInitialData after loadData
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await loadData(0, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  // Reset when filters change
  useEffect(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    loadInitialData();
  }, [loadInitialData]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await loadData(currentPage + 1, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading more items');
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasMore, loadingMore, loadData]);

  const refresh = useCallback(async () => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    await loadInitialData();
  }, [loadInitialData]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalItems,
    currentPage
  };
};

export default useGalleryData;
