import React, { useEffect, useState } from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { auctionService } from '../../api/services/auctionService';
import { AuctionDTO } from '../../types/auction';

interface TrendingTopicsProps {
  itemVariants: Variants;
  controls: AnimationControls;
}

// Interface cho trending item
interface TrendingItem {
  topic: string;
  change: string;
}

// Hàm chuyển đổi từ wei sang ETH
const weiToEth = (weiValue: string | number): number => {
  const wei = typeof weiValue === 'string' ? parseFloat(weiValue) : weiValue;
  return wei / Math.pow(10, 18);
};

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  itemVariants,
  controls
}) => {  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([
    { topic: "AI-Generated Art Surge", change: "+127%" },
    { topic: "Metaverse Galleries", change: "+89%" },
    { topic: "Sustainable NFTs", change: "+156%" },
    { topic: "Celebrity Collections", change: "+67%" },
  ]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        console.log('TrendingTopics: Fetching trending auction data...');
        
        const auctions = await auctionService.getAllAuctions();
        console.log('TrendingTopics: Raw auctions:', auctions);

        // Lọc các auction có status = 'NFT_MINTED'
        const mintedAuctions = auctions.filter((auction: AuctionDTO) => auction.status === 'NFT_MINTED');
        console.log('TrendingTopics: Minted auctions:', mintedAuctions);

        // Tính toán trending data từ auctions
        const trendingData: TrendingItem[] = [];
        
        mintedAuctions.forEach((auction: AuctionDTO) => {
          const startPriceEth = weiToEth(auction.startPrice);
          const currentBidEth = weiToEth(auction.currentBid);
          
          if (startPriceEth > 0 && currentBidEth > startPriceEth) {
            const priceIncrease = ((currentBidEth - startPriceEth) / startPriceEth) * 100;
            const productName = auction.productName || `NFT #${auction.productId}`;
            
            trendingData.push({
              topic: productName,
              change: `+${priceIncrease.toFixed(1)}%`
            });
          }
        });

        // Sắp xếp theo phần trăm tăng giá và lấy top 4
        trendingData.sort((a, b) => {
          const aPercentage = parseFloat(a.change.replace('+', '').replace('%', ''));
          const bPercentage = parseFloat(b.change.replace('+', '').replace('%', ''));
          return bPercentage - aPercentage;
        });

        const topTrending = trendingData.slice(0, 4);
        console.log('TrendingTopics: Top trending data:', topTrending);

        // Nếu có dữ liệu thật thì dùng, không thì giữ mock data
        if (topTrending.length > 0) {
          setTrendingItems(topTrending);
        }      } catch (error) {
        console.error('TrendingTopics: Error fetching trending data:', error);
        // Giữ nguyên mock data nếu có lỗi
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <motion.aside
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-full flex items-center justify-center mr-3">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Trending Now
        </h3>
      </div>
      <div className="space-y-3">
        {trendingItems.map((item, index) => (
          <motion.div
            key={item.topic}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center">
              <span className="w-6 h-6 bg-red-100 dark:bg-amber-100 text-red-600 dark:text-amber-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.topic}
              </span>
            </div>
            <span className="text-xs text-green-500 font-bold">
              {item.change}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default TrendingTopics;
