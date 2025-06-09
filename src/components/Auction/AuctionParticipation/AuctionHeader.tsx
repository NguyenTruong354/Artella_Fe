import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';

interface AuctionHeaderProps {
  id: number;
  auctionHouse: string;
  timeLeft: string;
  isWatched: boolean;
  isSoundActive: boolean;
  onNavigateBack: () => void;
  onToggleWatch: () => void;
  onToggleSound: () => void;
  onShowAnalytics: () => void;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  id,
  auctionHouse,
  timeLeft,
  isWatched,
  isSoundActive,
  onNavigateBack,
  onToggleWatch,
  onToggleSound,
  onShowAnalytics,
}) => {
  // Format time function
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateBack}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Auction #{id}</h1>
              <p className="text-sm text-gray-400">{auctionHouse}</p>
            </div>
          </div>
            <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold">{timeLeft}</div>
              <div className="text-xs text-gray-400">Time Remaining</div>
            </div>
            <button
              onClick={onShowAnalytics}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title="View Analytics"
            >
              <HiChartBar className="w-5 h-5 text-gold-400" />
            </button>
            <button
              onClick={onToggleSound}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              title={isSoundActive ? "Mute Sound" : "Unmute Sound"}
            >
              {isSoundActive ? (
                <FaVolumeUp className="w-5 h-5" />
              ) : (
                <FaVolumeMute className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onToggleWatch}
              className={`px-4 py-2 rounded-full transition-colors ${
                isWatched
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {isWatched ? "Watching" : "Watch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionHeader;
