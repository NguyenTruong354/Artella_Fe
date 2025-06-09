import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiChartBar, 
  HiUsers, 
  HiClock, 
  HiTrendingUp,
  HiCurrencyDollar,
  HiEye,
  HiHeart,
  HiStar
} from 'react-icons/hi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AuctionAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  auctionId: number;
  productData: {
    name: string;
    artist: string;
    category: string;
    startingPrice: number;
    currentPrice: number;
    estimatedValue: string;
    rarity: string;
    views: number;
    likes: number;
    watchlist: number;
  };
}

const AuctionAnalytics: React.FC<AuctionAnalyticsProps> = ({
  isOpen,
  onClose,
  auctionId,
  productData
}) => {
  // Mock data for analytics
  const participantStats = {
    totalParticipants: 157,
    activeBidders: 23,
    watchingUsers: 892,
    newUsers: 34,
    returningUsers: 123
  };

  const bidHistory = [
    { time: '14:30', price: 5000, bidder: 'User#1234', increase: 500 },
    { time: '14:32', price: 5500, bidder: 'User#5678', increase: 500 },
    { time: '14:35', price: 6200, bidder: 'User#9012', increase: 700 },
    { time: '14:38', price: 7000, bidder: 'User#3456', increase: 800 },
    { time: '14:40', price: 7800, bidder: 'User#7890', increase: 800 },
    { time: '14:42', price: 8500, bidder: 'User#2345', increase: 700 },
    { time: '14:45', price: 9200, bidder: 'User#6789', increase: 700 },
    { time: '14:47', price: 10000, bidder: 'User#1111', increase: 800 },
  ];

  // Chart data for price history
  const priceChartData = {
    labels: bidHistory.map(bid => bid.time),
    datasets: [
      {
        label: 'Bid Price ($)',
        data: bidHistory.map(bid => bid.price),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB'
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: '#374151'
        }
      },
      y: {        ticks: {
          color: '#9CA3AF',
          callback: function(value: number | string) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: '#374151'
        }
      }
    }
  };

  // Participant distribution chart
  const participantChartData = {
    labels: ['Active Bidders', 'Watching Only', 'New Users', 'Returning Users'],
    datasets: [
      {
        data: [23, 892, 34, 123],
        backgroundColor: [
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#8B5CF6'
        ],
        borderColor: '#1F2937',
        borderWidth: 2,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#E5E7EB',
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <HiChartBar className="w-6 h-6 text-gold-400" />
              <h2 className="text-2xl font-bold text-white">
                Auction Analytics #{auctionId}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <HiX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Product Information */}
              <motion.div
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center">
                  <HiStar className="w-5 h-5 mr-2" />
                  Product Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Name</label>
                      <p className="text-white font-semibold">{productData.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Artist</label>
                      <p className="text-white font-semibold">{productData.artist}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Category</label>
                      <p className="text-white font-semibold">{productData.category}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Rarity</label>
                      <p className="text-gold-400 font-semibold">{productData.rarity}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <HiEye className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Views</p>
                      <p className="text-white font-bold">{productData.views.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <HiHeart className="w-6 h-6 text-red-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Likes</p>
                      <p className="text-white font-bold">{productData.likes.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <HiClock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Watchlist</p>
                      <p className="text-white font-bold">{productData.watchlist.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Price Statistics */}
              <motion.div
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center">
                  <HiCurrencyDollar className="w-5 h-5 mr-2" />
                  Price Statistics
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Starting Price</label>
                      <p className="text-white font-bold text-lg">
                        ${productData.startingPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Current Price</label>
                      <p className="text-gold-400 font-bold text-lg">
                        ${productData.currentPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <label className="text-sm text-gray-400">Estimated Value</label>
                    <p className="text-green-400 font-bold text-lg">{productData.estimatedValue}</p>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Price Increase</span>
                      <span className="text-green-400 font-bold">
                        +{((productData.currentPrice - productData.startingPrice) / productData.startingPrice * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(((productData.currentPrice - productData.startingPrice) / productData.startingPrice * 100), 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Participant Statistics */}
              <motion.div
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center">
                  <HiUsers className="w-5 h-5 mr-2" />
                  Participant Statistics
                </h3>
                <div className="h-64">
                  <Doughnut data={participantChartData} options={doughnutOptions} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Participants:</span>
                    <span className="text-white font-bold">{participantStats.totalParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Bidders:</span>
                    <span className="text-gold-400 font-bold">{participantStats.activeBidders}</span>
                  </div>
                </div>
              </motion.div>

              {/* Price History Chart */}
              <motion.div
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center">
                  <HiTrendingUp className="w-5 h-5 mr-2" />
                  Price Trend
                </h3>
                <div className="h-64">
                  <Line data={priceChartData} options={chartOptions} />
                </div>
              </motion.div>
            </div>

            {/* Bid History Table */}
            <motion.div
              className="mt-6 bg-gray-800/50 rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4 flex items-center">
                <HiClock className="w-5 h-5 mr-2" />
                Bid History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">Time</th>
                      <th className="text-left py-3 px-4 text-gray-400">Bidder</th>
                      <th className="text-right py-3 px-4 text-gray-400">Price</th>
                      <th className="text-right py-3 px-4 text-gray-400">Increase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidHistory.reverse().map((bid, index) => (
                      <motion.tr
                        key={index}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                      >
                        <td className="py-3 px-4 text-gray-300">{bid.time}</td>
                        <td className="py-3 px-4 text-blue-400 font-mono">{bid.bidder}</td>
                        <td className="py-3 px-4 text-right text-gold-400 font-bold">
                          ${bid.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-green-400 font-semibold">
                          +${bid.increase.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuctionAnalytics;
