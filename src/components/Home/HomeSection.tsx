import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Bell,
  Search,
} from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";
import { WaveTransition } from "../WaveTransition";
import { DarkModeToggle } from "../DarkModeToggle";
import { authService, auctionService, auctionScheduleService } from "../../api/services";
import { UserProfileResponse, TopSellerRevenueResponse } from "../../api/types";
import { AuctionDTO, ScheduledAuctionDetailDTO } from "../../types/auction";

// Direct imports instead of lazy loading
import BannerSection from './BannerSection';
import TrendingNFTs from './TrendingNFTs';
import TopSellers from './TopSellers';
import LiveAuctions from './LiveAuctions';

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

interface FeaturedArtist {
  id: number;
  name: string;
  nationality: string;
  birthYear: string;
  avatar: string;
  totalWorks: number;
  averagePrice: string;
  topSale: string;
  specialty: string;
}

const HomeSection: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [topSellersData, setTopSellersData] = useState<TopSellerRevenueResponse[]>([]);
  const [isLoadingTopSellers, setIsLoadingTopSellers] = useState(false);
  // State cho auction data
  const [liveAuctionsData, setLiveAuctionsData] = useState<AuctionDTO[]>([]);
  const [upcomingAuctionsData, setUpcomingAuctionsData] = useState<ScheduledAuctionDetailDTO[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);

  // Dark mode hook
  const darkMode = useDarkMode();
  // Function to transform API data to component format
  const transformTopSellersData = (apiData: TopSellerRevenueResponse[]): FeaturedArtist[] => {
    return apiData.map((seller) => ({
      id: parseInt(seller.id),
      name: seller.fullName,
      nationality: "Unknown", // API doesn't provide this, using default
      birthYear: "Unknown", // API doesn't provide this, using default
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.fullName)}&background=random&color=fff&size=40`,
      totalWorks: seller.totalSales,
      averagePrice: `${seller.averagePrice.toFixed(6)} ETH`,
      topSale: `${seller.topSalePrice.toFixed(2)} ETH`,
      specialty: "Digital Art", // API doesn't provide this, using default
    }));
  };

  // Function to generate avatar background color
  const generateAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-r from-blue-400 to-blue-600',
      'bg-gradient-to-r from-green-400 to-green-600',
      'bg-gradient-to-r from-purple-400 to-purple-600',
      'bg-gradient-to-r from-pink-400 to-pink-600',
      'bg-gradient-to-r from-yellow-400 to-yellow-600',
      'bg-gradient-to-r from-red-400 to-red-600',
      'bg-gradient-to-r from-indigo-400 to-indigo-600',
      'bg-gradient-to-r from-orange-400 to-orange-600',
    ];
    
    // Use name length to pick a color consistently
    const index = name.length % colors.length;
    return colors[index];
  };
  // Function to get initials from full name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2); // Max 2 characters
  };

  // Helper function để format thời gian
  const formatTimeLeft = (endTime: number): string => {
    const now = Date.now();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return "00:00:00";
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeUntilStart = (scheduledTime: string): string => {
    const startTime = new Date(scheduledTime).getTime();
    const now = Date.now();
    const timeUntil = startTime - now;
    
    if (timeUntil <= 0) return "Starting soon";
    
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  // Transform AuctionDTO to ArtworkData
  const transformAuctionToArtwork = (auction: AuctionDTO): ArtworkData => {
    return {
      id: parseInt(auction.auctionId),
      title: `Live Auction #${auction.productId}`, // Có thể cải thiện bằng cách fetch thông tin NFT
      artist: auction.owner.slice(0, 8) + "...", // Rút gọn địa chỉ wallet
      year: "2024",
      medium: "Digital Art",
      dimensions: "1080x1080px",
      image: auction.productId, // Sử dụng productId làm imageId cho SmartImage
      currentBid: `${auction.currentBid} ETH`,
      estimatedValue: `${auction.startPrice} - ${auction.currentBid * 1.5} ETH`,
      timeLeft: formatTimeLeft(auction.endTime),
      bidCount: Math.floor(Math.random() * 20) + 1, // Random số bid
      category: "Digital",
      status: "live",
      auctionHouse: "Artella Digital",
    };
  };// Transform ScheduledAuctionDetailDTO to ArtworkData
  const transformScheduledAuctionDetailToArtwork = (scheduledAuction: ScheduledAuctionDetailDTO): ArtworkData => {
    // Ưu tiên productImages[0], nếu không có thì dùng imageUrl, cuối cùng là productId
    const primaryImageId = scheduledAuction.productImages?.[0] || 
                           scheduledAuction.imageUrl || 
                           scheduledAuction.productId;
    
    return {
      id: parseInt(scheduledAuction.id),
      title: scheduledAuction.productName || `Scheduled Auction #${scheduledAuction.id}`,
      artist: scheduledAuction.owner.slice(0, 8) + "...",
      year: "2024",
      medium: "Digital Art", 
      dimensions: "1080x1080px",
      image: primaryImageId, // Chuyển thành imageId để SmartImage xử lý
      currentBid: `${scheduledAuction.startPrice} ETH (Starting)`,
      estimatedValue: `Starting from ${scheduledAuction.startPrice} ETH`,
      timeLeft: formatTimeUntilStart(scheduledAuction.scheduledTime),
      bidCount: 0,
      category: "Digital",
      status: "upcoming",
      auctionHouse: "Artella Digital",
    };
  };
  // Fetch user profile
  const fetchUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await authService.getUserProfile();
      if (response.success) {
        setUserProfile(response.data);
      } else {
        console.error('Failed to fetch profile:', response.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };
  // Fetch top sellers
  const fetchTopSellers = async () => {
    setIsLoadingTopSellers(true);
    try {
      const response = await authService.getTopSellers({ limit: 3 });
      if (response.success) {
        setTopSellersData(response.data);
      } else {
        console.error('Failed to fetch top sellers:', response.message);
      }
    } catch (error) {
      console.error('Error fetching top sellers:', error);
    } finally {
      setIsLoadingTopSellers(false);
    }
  };  // Fetch live auctions và upcoming scheduled auctions
  const fetchAuctionsData = async () => {
    setIsLoadingAuctions(true);
    console.log('🔍 Starting to fetch auctions data...');
    
    try {
      // Call API để lấy live auctions - thử nhiều status khác nhau
      let liveAuctionsResponse: AuctionDTO[] = [];      try {
        console.log('🔍 Trying to fetch ACTIVE auctions...');
        liveAuctionsResponse = await auctionService.getAllAuctions({ status: 'ACTIVE' });
        console.log('✅ Successfully fetched ACTIVE auctions:', Array.isArray(liveAuctionsResponse) ? liveAuctionsResponse.length : 'Not an array');
      } catch (liveError) {
        console.warn('⚠️ Failed to fetch ACTIVE auctions, trying without status filter:', liveError);
        try {
          console.log('🔍 Trying to fetch all auctions...');
          // Thử lấy tất cả auctions nếu filter theo status không hoạt động
          liveAuctionsResponse = await auctionService.getAllAuctions();
          console.log('✅ Successfully fetched all auctions:', Array.isArray(liveAuctionsResponse) ? liveAuctionsResponse.length : 'Not an array');
        } catch (allError) {
          console.warn('❌ Failed to fetch all auctions:', allError);
          liveAuctionsResponse = [];
        }
      }
      
      // Ensure we have a valid array
      if (!Array.isArray(liveAuctionsResponse)) {
        console.warn('⚠️ liveAuctionsResponse is not an array, setting to empty array');
        liveAuctionsResponse = [];
      }
      setLiveAuctionsData(liveAuctionsResponse);      // Call API để lấy upcoming scheduled auctions
      let upcomingResponse: ScheduledAuctionDetailDTO[] = [];
      try {
        console.log('🔍 Trying to fetch upcoming scheduled auctions...');
        upcomingResponse = await auctionScheduleService.getUpcomingScheduledAuctions();
        console.log('✅ Successfully fetched upcoming auctions:', Array.isArray(upcomingResponse) ? upcomingResponse.length : 'Not an array');
      } catch (upcomingError) {
        console.warn('❌ Failed to fetch upcoming scheduled auctions:', upcomingError);
        upcomingResponse = [];
      }
      
      // Ensure we have a valid array
      if (!Array.isArray(upcomingResponse)) {
        console.warn('⚠️ upcomingResponse is not an array, setting to empty array');
        upcomingResponse = [];
      }
      setUpcomingAuctionsData(upcomingResponse);

      console.log('📊 Final results - Live:', Array.isArray(liveAuctionsResponse) ? liveAuctionsResponse.length : 0, 'Upcoming:', Array.isArray(upcomingResponse) ? upcomingResponse.length : 0);
    } catch (error) {
      console.error('❌ Error fetching auctions data:', error);
      // Set empty arrays để không crash app
      setLiveAuctionsData([]);
      setUpcomingAuctionsData([]);
    } finally {
      setIsLoadingAuctions(false);
    }
  };
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);  useEffect(() => {
    fetchUserProfile();
    fetchTopSellers();
    fetchAuctionsData(); // Thêm call để fetch auction data
  }, []);

  // Featured Artworks Data
  const featuredArtworks: ArtworkData[] = [
    {
      id: 1,
      title: "Full Abstract",
      artist: "Esther Howard",
      year: "2023",
      medium: "Digital Art",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop",
      currentBid: "3.40 ETH",
      estimatedValue: "€50,000 - €70,000",
      timeLeft: "02:28:25",
      bidCount: 23,
      category: "Digital",
      status: "live",
      auctionHouse: "Artella Digital",
    },
    {
      id: 2,
      title: "The Fantasy Flower",
      artist: "Esther Howard",
      year: "2022",
      medium: "3D Render",
      dimensions: "1080x1080px",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=500&fit=crop",
      currentBid: "2.50 ETH",
      estimatedValue: "€40,000 - €55,000",
      timeLeft: "01:15:10",
      bidCount: 18,
      category: "Digital",
      status: "live",
      auctionHouse: "Artella Digital",
    },
    {
      id: 3,
      title: "Colorful Abstract",
      artist: "@johndoe",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop",
      currentBid: "3.40 ETH",
      timeLeft: "02:28:25",
      year: "2024",
      medium: "Digital Painting",
      dimensions: "1920x1080",
      estimatedValue: "3-4 ETH",
      bidCount: 12,
      category: "Digital",
      status: "live",
      auctionHouse: "NFT Marketplace",
    },
    {
      id: 4,
      title: "Modern Art Collection",
      artist: "@janedoe",
      image: "https://images.unsplash.com/photo-1579965342575-15475c126358?w=400&h=500&fit=crop",
      currentBid: "2.43 ETH",
      timeLeft: "02:28:25",
      year: "2024",
      medium: "Generative Art",
      dimensions: "2000x2000",
      estimatedValue: "2-3 ETH",
      bidCount: 8,
      category: "Digital",
      status: "live",
      auctionHouse: "NFT Marketplace",
    },  ];  // Get transformed top sellers data
  const transformedTopSellers = transformTopSellersData(topSellersData);
  // Kết hợp dữ liệu từ API với dữ liệu tĩnh
  const getCombinedAuctionsData = (): ArtworkData[] => {
    console.log('🔍 getCombinedAuctionsData called');
    console.log('🔍 liveAuctionsData:', liveAuctionsData);
    console.log('🔍 upcomingAuctionsData:', upcomingAuctionsData);
    
    const transformedLiveAuctions = liveAuctionsData.map(transformAuctionToArtwork);
    const transformedUpcomingAuctions = upcomingAuctionsData.map(transformScheduledAuctionDetailToArtwork);
    
    console.log('🔍 transformedLiveAuctions:', transformedLiveAuctions);
    console.log('🔍 transformedUpcomingAuctions:', transformedUpcomingAuctions);
      // Log chi tiết từng object
    transformedUpcomingAuctions.forEach((auction: ArtworkData, index: number) => {
      console.log(`🔍 Upcoming auction ${index}:`, {
        id: auction.id,
        title: auction.title,
        artist: auction.artist,
        status: auction.status,
        currentBid: auction.currentBid,
        timeLeft: auction.timeLeft
      });
    });
    
    const apiAuctions: ArtworkData[] = [
      ...transformedLiveAuctions,
      ...transformedUpcomingAuctions,
    ];

    console.log('🔍 Total apiAuctions:', apiAuctions.length);
    console.log('🔍 apiAuctions:', apiAuctions);

    // Nếu có dữ liệu từ API, ưu tiên sử dụng, nếu không thì dùng dữ liệu tĩnh
    if (apiAuctions.length > 0) {
      console.log('✅ Using API auctions data');
      return apiAuctions;
    }
    
    console.log('📋 Falling back to static data');
    return featuredArtworks; // Fallback về dữ liệu tĩnh
  };

  const combinedAuctionsData = getCombinedAuctionsData();

  const toggleWatch = (artworkId: number) => {
    setWatchedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(artworkId)) {
        newSet.delete(artworkId);
      } else {
        newSet.add(artworkId);
      }
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
      },
    },
  };
  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-visible gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
        role="main"
        aria-label="Home Section"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"></div>
        </div>
        {/* Top Bar: Search and User Info */}
        <motion.header
          className="flex flex-col sm:flex-row justify-between items-center mb-10 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
          role="banner"
          aria-label="Top Navigation"
        >
          <div className="relative flex items-center backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl w-full sm:w-auto lg:w-[380px] mb-4 sm:mb-0 group transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50 sm:ml-auto sm:mr-4">
            <Search className="w-5 h-5 mr-3 transition-colors text-gray-500 group-focus-within:text-blue-500 dark:text-gray-400 dark:group-focus-within:text-amber-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search Artwork..."
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400 dark:text-gray-200 dark:placeholder-gray-500"
              aria-label="Search Artwork"
              role="searchbox"
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-blue-400/10 to-cyan-500/10 dark:bg-gradient-to-r dark:from-amber-400/10 dark:to-orange-500/10" aria-hidden="true"></div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <motion.button
              className="relative cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-white hover:border-gray-300/50 dark:hover:bg-gradient-to-r dark:hover:from-[#1A1A1A] dark:hover:to-[#1F1F1F] dark:hover:border-gray-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View notifications"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Bell className="w-6 h-6 transition-colors text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-amber-400" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg" aria-label="3 unread notifications">
                3
              </span>
            </motion.button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />            <div 
              className="flex items-center space-x-3 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50"
              role="button"
              tabIndex={0}
              aria-label="User profile"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {/* Avatar with initials */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                userProfile?.fullName 
                  ? generateAvatarColor(userProfile.fullName)
                  : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}>
                {isLoadingProfile 
                  ? '...' 
                  : userProfile?.fullName 
                    ? getInitials(userProfile.fullName)
                    : 'U'
                }
              </div>
              
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {isLoadingProfile 
                    ? 'Loading...' 
                    : userProfile?.fullName || 'User'
                  }
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Premium Member
                </p>
              </div>
            </div>
          </div>
        </motion.header>
        {/* Main Content Area */}
        <motion.main
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          role="main"
          aria-label="Main Content"
        >
          {" "}
          {/* Left Column (Banner & Trending) */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={itemVariants}
            role="region"
            aria-label="Featured Content"
          >            <div className="rounded-xl p-4">
              <BannerSection />
            </div>              <div className="rounded-xl p-4">
              <TrendingNFTs limit={3} showApiStatus={true} />
            </div>
          </motion.div>
          {/* Right Column (Top Sellers & Live Auctions) */}
          <motion.div
            className="lg:col-span-1 space-y-8"
            variants={itemVariants}
            role="complementary"
            aria-label="Sidebar Content"
          >            <div className="rounded-xl p-4">
              <TopSellers 
                topSellers={transformedTopSellers} 
                isLoading={isLoadingTopSellers}
              />
            </div>            <div className="rounded-xl p-4">
              {isLoadingAuctions ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading auctions...</span>
                </div>
              ) : (
                (() => {
                  const auctionsToDisplay = combinedAuctionsData.slice(0, 4);
                  console.log('🎯 About to render LiveAuctions with:', auctionsToDisplay);
                  console.log('🎯 Total combined data:', combinedAuctionsData.length);
                  console.log('🎯 Is loading:', isLoadingAuctions);
                  
                  return (
                    <LiveAuctions 
                      auctions={auctionsToDisplay}
                      watchedItems={watchedItems}
                      toggleWatch={toggleWatch}
                    />
                  );
                })()
              )}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default HomeSection;