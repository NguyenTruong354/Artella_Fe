import { useState, useEffect, useCallback } from 'react';
import { nftService } from '../api/services/nftService';
import { DigitalArtNFT } from '../api/types';
import { mockTrendingNFTs } from '../data/mockNFTs';

interface UseNFTState {
  nfts: DigitalArtNFT[];
  loading: boolean;
  error: string | null;
}

interface UseNFTActions {
  refetch: () => void;
  clearError: () => void;
}

interface UseNFTReturn extends UseNFTState, UseNFTActions {}

/**
 * Hook để lấy danh sách NFT xu hướng
 * @param limit - Số lượng NFT cần lấy (mặc định 10)
 * @param autoFetch - Có tự động fetch dữ liệu khi mount hay không (mặc định true)
 * @returns Object chứa state và actions
 */
export const useTrendingNFTs = (limit: number = 10, autoFetch: boolean = true): UseNFTReturn => {
  const [state, setState] = useState<UseNFTState>({
    nfts: [],
    loading: false,
    error: null,
  });  const fetchTrendingNFTs = useCallback(async () => {
    console.log('🚀 Starting fetchTrendingNFTs with limit:', limit);
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const nfts = await nftService.getTrendingNFTs({ limit });
      console.log('✅ Received NFTs from service:', nfts);
      console.log('✅ NFTs count:', nfts?.length);
      
      // Ensure nfts is always an array
      const validNfts = Array.isArray(nfts) ? nfts : [];
      console.log('✅ Valid NFTs after validation:', validNfts);
      
      setState(prev => ({ ...prev, nfts: validNfts, loading: false }));
    } catch (error: unknown) {
      console.warn('⚠️ API not available, using mock data:', error);
      
      // Check if it's a 404 error or API not available
      const isApiUnavailable = error instanceof Error && 
        (error.message.includes('404') || 
         error.message.includes('Network Error') ||
         error.message.includes('Failed to fetch'));
      
      if (isApiUnavailable) {
        // Use mock data as fallback
        console.log('📦 Using mock data as fallback');
        const mockData = mockTrendingNFTs.slice(0, limit);
        setState(prev => ({ 
          ...prev, 
          nfts: Array.isArray(mockData) ? mockData : [], 
          loading: false,
          error: null // Don't show error when using fallback
        }));
      } else {
        // Show error for other types of failures but keep empty array
        const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải NFT xu hướng';
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          nfts: [], // Ensure nfts is always an array
          error: errorMessage
        }));
      }
    }
  }, [limit]);

  const refetch = () => {
    fetchTrendingNFTs();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTrendingNFTs();
    }
  }, [autoFetch, fetchTrendingNFTs]);

  return {
    ...state,
    refetch,
    clearError,
  };
};

/**
 * Hook để lấy NFT theo ID
 * @param nftId - ID của NFT
 * @param autoFetch - Có tự động fetch dữ liệu khi mount hay không (mặc định true)
 * @returns Object chứa state và actions
 */
export const useNFTById = (nftId: string, autoFetch: boolean = true) => {
  const [state, setState] = useState<{
    nft: DigitalArtNFT | null;
    loading: boolean;
    error: string | null;
  }>({
    nft: null,
    loading: false,
    error: null,
  });

  const fetchNFT = useCallback(async () => {
    if (!nftId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const nft = await nftService.getNFTById(nftId);
      setState(prev => ({ ...prev, nft, loading: false }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin NFT';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
    }
  }, [nftId]);

  const refetch = () => {
    fetchNFT();
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    if (autoFetch && nftId) {
      fetchNFT();
    }
  }, [autoFetch, fetchNFT, nftId]);

  return {
    ...state,
    refetch,
    clearError,
  };
};

/**
 * Hook để search NFT
 * @returns Object chứa state và actions
 */
export const useSearchNFTs = () => {
  const [state, setState] = useState<UseNFTState>({
    nfts: [],
    loading: false,
    error: null,
  });
  const searchNFTs = async (query: string, limit: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const nfts = await nftService.searchNFTs(query, limit);
      setState(prev => ({ ...prev, nfts, loading: false }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm kiếm NFT';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
    }
  };

  const clearResults = () => {
    setState({ nfts: [], loading: false, error: null });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    searchNFTs,
    clearResults,
    clearError,
  };
};
