import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Clock, ArrowUpRight } from 'lucide-react';
import SmartImage from '../SmartImage';

interface ArtworkData {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  currentBid: string;
  estimatedValue: string;
  timeLeft: string;
  bidCount: number;
  category: string;
  status: "live" | "upcoming" | "sold";
  auctionHouse: string;
}

interface LiveAuctionsProps {
  auctions: ArtworkData[];
  watchedItems: Set<number>;
  toggleWatch: (id: number) => void;
}

const LiveAuctions: React.FC<LiveAuctionsProps> = ({
  auctions,
  watchedItems,
  toggleWatch,
}) => {
  const navigate = useNavigate();

  console.log('🎯 LiveAuctions component received props:', auctions.length, 'auctions');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            ⚡ Live Auctions
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Active bidding now ({auctions.length} auctions)
          </p>
        </div>
        <button className="text-pink-400 hover:text-pink-300 text-sm font-semibold flex items-center bg-pink-500/10 hover:bg-pink-500/20 px-3 py-2 rounded-xl transition-all border border-pink-500/30">
          EXPLORE <ArrowUpRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-pink-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <SmartImage
                  imageId={auction.image}
                  alt={auction.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  fallbackCategory="nft"
                />
                <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {auction.status === 'upcoming' ? '⏰' : '🔴'}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {auction.title}
                  </h3>
                  <button
                    onClick={() => toggleWatch(auction.id)}
                    className={`p-1 rounded-full transition-all ${
                      watchedItems.has(auction.id)
                        ? "bg-pink-500 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-pink-500/80 hover:text-white dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    <Heart className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    By <span className="font-medium">{auction.artist}</span>
                  </p>
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {auction.category}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {auction.status === 'upcoming' ? 'Starting Price' : 'Current Bid'}
                    </p>
                    <p className="text-sm font-semibold text-pink-500">
                      {auction.currentBid}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {auction.bidCount} bids
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {auction.status === 'live' && (
                    <button
                      onClick={() => navigate(`/Home/auction/${auction.id}`)}
                      className="flex-1 text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg transition-all font-semibold"
                    >
                      🎯 Place Bid
                    </button>
                  )}
                  {auction.status === 'upcoming' && (
                    <div className="flex-1 text-xs bg-gray-400 text-white px-3 py-2 rounded-lg text-center font-semibold">
                      ⏰ Starting Soon
                    </div>
                  )}
                  <div className="text-xs px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-pink-400" />
                      <span className="font-mono text-gray-800 dark:text-white text-xs">
                        {auction.timeLeft}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveAuctions;
