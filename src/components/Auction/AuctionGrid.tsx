import React from 'react';
import { Heart, Eye, Clock, TrendingUp } from 'lucide-react';
import { AuctionDisplayData } from '../../utils/auctionHelpers';
import SmartImage from '../SmartImage';

export interface AuctionGridProps {
  auctions: AuctionDisplayData[];
  watchedItems: Set<string>;
  onToggleWatch: (id: string) => void;
  getStoryTypeColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  itemVariants?: any;
  containerVariants?: any;
  controls?: any;
}

const AuctionGrid: React.FC<AuctionGridProps> = ({ 
  auctions,
  watchedItems,
  onToggleWatch,
  getStoryTypeColor,
  getStatusColor
}) => {
  console.log('🎨 AuctionGrid rendering:', auctions.length, 'auctions');

  return (
    <div className="relative space-y-4 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group"
          >
            {/* Header with status and watch button */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(auction.status)}`}>
                  {auction.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full text-white ${getStoryTypeColor(auction.storyType)}`}>
                  {auction.storyType}
                </span>
              </div>
              <button
                onClick={() => onToggleWatch(auction.id)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  watchedItems.has(auction.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Heart size={16} className={watchedItems.has(auction.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Image */}
            <div className="relative mb-4 overflow-hidden rounded-lg">              <SmartImage
                imageId={auction.image}
                alt={auction.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Clock size={12} className="inline mr-1" />
                {auction.timeLeft}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                  {auction.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  by {auction.artist}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Bid</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {auction.currentBid}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Highest Bidder</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {auction.highestBidder}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {auction.bidders} watchers
                </span>
                <span className="flex items-center">
                  <TrendingUp size={14} className="mr-1" />
                  {auction.totalBids} bids
                </span>
              </div>

              {/* Location and reading time */}
              <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>{auction.location}</span>
                <span>{auction.readingTime} read</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
          Load More Auctions
        </button>
      </div>
    </div>
  );
};

export default AuctionGrid;
