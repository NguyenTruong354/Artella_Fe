import React from 'react';
import { motion } from 'framer-motion';
import { useTrendingNFTs } from '../../hooks/useNFT';
import { DigitalArtNFT } from '../../api/types';
import SmartImage from '../SmartImage';
// Using SmartImage component for image loading

interface TrendingNFTsProps {
  limit?: number;
  className?: string;
  showApiStatus?: boolean; // Option to show if using mock data
}

const TrendingNFTs: React.FC<TrendingNFTsProps> = ({ 
  limit = 10, 
  className = '',
  showApiStatus = true
}) => {
  const { nfts, loading, error, refetch } = useTrendingNFTs(limit);
  
  // Debug logging without references to removed functions
  console.log('🎨 TrendingNFTs Component - Current state:', {
    nftsCount: nfts?.length,
    isArray: Array.isArray(nfts),
    loading,
    error
  });

  // Check if we're using mock data (when API is not available)
  // Add defensive check to ensure nfts is an array
  const isUsingMockData = Array.isArray(nfts) && nfts.length > 0 && nfts[0]?.id === "1";

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Đang tải NFT xu hướng...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-medium">
                Lỗi khi tải dữ liệu
              </h3>
              <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                {error}
              </p>
            </div>
            <button
              onClick={refetch}
              className="bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 
                         text-red-700 dark:text-red-200 px-4 py-2 rounded-md text-sm font-medium
                         transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!Array.isArray(nfts) || nfts.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.44-.844-6.09-2.243C7.5 11.717 9.649 11 12 11s4.5.717 6.09 1.757A7.962 7.962 0 0112 15z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">Chưa có NFT xu hướng</h3>
            <p className="text-sm">Hãy quay lại sau để xem những NFT hot nhất!</p>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🔥 Top 3 NFT Xu Hướng
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Top 3 NFT được quan tâm nhiều nhất hiện tại
        </p>
        
        {/* API Status Indicator */}
        {showApiStatus && isUsingMockData && (
          <div className="mt-3 flex items-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Đang hiển thị dữ liệu demo (API chưa khả dụng)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.slice(0, 3).map((nft, index) => (
          <NFTCard key={nft.id} nft={nft} index={index} />
        ))}
      </div>
    </div>
  );
};

interface NFTCardProps {
  nft: DigitalArtNFT;
  index: number;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, index }) => {
  // Special styling for top 3
  const getCardStyling = (position: number) => {
    switch (position) {
      case 0: // #1 - Gold
        return 'ring-2 ring-yellow-400 shadow-yellow-100 dark:shadow-yellow-900/20';
      case 1: // #2 - Silver  
        return 'ring-2 ring-gray-300 shadow-gray-100 dark:shadow-gray-900/20';
      case 2: // #3 - Bronze
        return 'ring-2 ring-orange-400 shadow-orange-100 dark:shadow-orange-900/20';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl 
                 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700
                 ${getCardStyling(index)}`}
    >      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">        <SmartImage
          imageId={nft.imageUrl}
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackCategory={nft.category}
          onLoad={() => {
            console.log('✅ Smart image loaded successfully:', nft.imageUrl);
          }}
          onError={() => {
            console.log('❌ Smart image failed to load:', nft.imageUrl);
          }}
        />
          {/* Overlay với thông tin trending */}
        <div className="absolute top-3 left-3">
          <span className={`
            text-white px-2 py-1 rounded-full text-xs font-bold
            ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : // Gold for #1
              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :   // Silver for #2  
              index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700' : // Bronze for #3
              'bg-gradient-to-r from-orange-500 to-red-500'} // Default
          `}>
            #{index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
          </span>
        </div>

        {/* Quick stats overlay */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            {nft.viewCount}
          </div>
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
            {nft.likeCount}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
          {nft.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
          {nft.description}
        </p>        {/* Creator info */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>Tác giả: </span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {nft.creator.startsWith('0x') 
                ? `${nft.creator.slice(0, 6)}...${nft.creator.slice(-4)}`
                : nft.creator.length > 12 
                  ? `${nft.creator.slice(0, 12)}...` 
                  : nft.creator
              }
            </span>
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                           px-2 py-1 rounded-full">
            {nft.category}
          </span>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between">
          {nft.onSale ? (
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Giá:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 ml-1">
                {nft.price.toLocaleString()} ETH
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Không bán
            </span>
          )}
          
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 
                             dark:hover:text-blue-300 font-medium transition-colors">
            Xem chi tiết
          </button>
        </div>

        {/* Tags */}
        {nft.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {nft.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                           px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {nft.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{nft.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TrendingNFTs;
