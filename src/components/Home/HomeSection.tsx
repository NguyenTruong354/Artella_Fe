import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Bell, TrendingUp, Eye, Heart, Clock, Users, ChevronRight, Star, Activity } from 'lucide-react';

const Dashboard = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Mock user data
  const userData = {
    name: "Minh Nguyen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    balance: "12.47 ETH",
    totalValue: "$24,892",
    ownedNFTs: 23,
    notifications: 5
  };

  // Live auctions data
  const liveAuctions = [
    {
      id: 1,
      title: "Cosmic Dreams #142",
      artist: "Luna Art",
      currentBid: "5.2 ETH",
      timeLeft: "2h 45m",
      image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=300&h=300&fit=crop",
      bidders: 12,
      isHot: true
    },
    {
      id: 2,
      title: "Digital Metamorphosis",
      artist: "CyberVision",
      currentBid: "3.8 ETH", 
      timeLeft: "1h 23m",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
      bidders: 8,
      isHot: false
    },
    {
      id: 3,
      title: "Neon Genesis",
      artist: "PixelMaster",
      currentBid: "7.1 ETH",
      timeLeft: "4h 12m", 
      image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=300&h=300&fit=crop",
      bidders: 19,
      isHot: true
    }
  ];

  // Trending collections
  const trendingCollections = [
    {
      id: 1,
      name: "Abstract Futures",
      floorPrice: "2.1 ETH",
      change: "+24.5%",
      volume: "126.3 ETH",
      image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=100&h=100&fit=crop",
      isUp: true
    },
    {
      id: 2,
      name: "Digital Portraits",
      floorPrice: "1.8 ETH", 
      change: "-8.2%",
      volume: "89.7 ETH",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
      isUp: false
    },
    {
      id: 3,
      name: "Cyber Landscapes",
      floorPrice: "3.4 ETH",
      change: "+12.8%",
      volume: "203.1 ETH", 
      image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=100&h=100&fit=crop",
      isUp: true
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: "bid",
      title: "Bạn đã đặt giá 4.2 ETH",
      artwork: "Starry Night Redux",
      time: "15 phút trước",
      status: "leading"
    },
    {
      id: 2,
      type: "outbid",
      title: "Ai đó đã vượt giá của bạn",
      artwork: "Digital Dreams #89",
      time: "1 giờ trước", 
      status: "outbid"
    },
    {
      id: 3,
      type: "sold",
      title: "NFT của bạn đã được bán",
      artwork: "Abstract Reality",
      time: "3 giờ trước",
      status: "completed"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 p-6"
    >
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Header Section */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4">
            <img 
              src={userData.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Chào {userData.name}! 👋
              </h1>
              <p className="text-gray-600">Chào mừng trở lại với bộ sưu tập của bạn</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {userData.notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {userData.notifications}
                </span>
              )}
            </motion.div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{userData.balance}</div>
              <div className="text-sm text-gray-600">{userData.totalValue}</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { title: "Tổng NFTs", value: userData.ownedNFTs, icon: Eye, color: "bg-blue-500" },
            { title: "Đang đấu giá", value: "7", icon: Activity, color: "bg-green-500" },
            { title: "Yêu thích", value: "45", icon: Heart, color: "bg-red-500" },
            { title: "Theo dõi", value: "128", icon: Users, color: "bg-purple-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Live Auctions */}
          <motion.div 
            className="xl:col-span-2 space-y-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-red-500" />
                Đấu giá đang diễn ra
              </h2>
              <button className="text-amber-600 hover:text-amber-700 flex items-center font-medium">
                Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-4">
              {liveAuctions.map((auction) => (
                <motion.div
                  key={auction.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={auction.image}
                        alt={auction.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      {auction.isHot && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                          HOT
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{auction.title}</h3>
                      <p className="text-gray-600">bởi {auction.artist}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {auction.bidders} người đặt giá
                        </span>
                        <span className="flex items-center text-sm text-red-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {auction.timeLeft}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{auction.currentBid}</div>
                      <motion.button
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Đặt giá
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Trending Collections */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Bộ sưu tập thịnh hành
              </h3>
              
              <div className="space-y-4">
                {trendingCollections.map((collection, index) => (
                  <div key={collection.id} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-sm font-bold text-gray-500 w-4">#{index + 1}</span>
                      <img 
                        src={collection.image}
                        alt={collection.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{collection.name}</p>
                        <p className="text-xs text-gray-600">{collection.floorPrice}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${collection.isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {collection.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Hoạt động gần đây
              </h3>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'leading' ? 'bg-green-500' :
                      activity.status === 'outbid' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.artwork}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                Xem tất cả hoạt động
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50"
          variants={itemVariants}
        >
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Bạn muốn làm gì hôm nay?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { title: "Tạo NFT mới", desc: "Mint tác phẩm của bạn", color: "from-blue-500 to-blue-600" },
                { title: "Khám phá", desc: "Tìm tác phẩm mới", color: "from-green-500 to-green-600" },
                { title: "Bán NFT", desc: "Đưa ra đấu giá", color: "from-purple-500 to-purple-600" },
                { title: "Ví của tôi", desc: "Quản lý tài sản", color: "from-orange-500 to-orange-600" }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  className={`px-6 py-4 bg-gradient-to-r ${action.color} text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <div className="font-bold">{action.title}</div>
                    <div className="text-sm opacity-90">{action.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;