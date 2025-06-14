import React, { useEffect, useRef, useState, Suspense } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Bell, Search, Copy, Heart, Wallet, PenLine, Share2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/auth';
import useDarkMode from '../hooks/useDarkMode';
import { WaveTransition } from '../components/WaveTransition';
import { DarkModeToggle } from '../components/DarkModeToggle';
import FloatingAvatar from '../components/Profile/FloatingAvatar';
import LiquidContentWrapper from '../components/Profile/LiquidContentWrapper';
import '../styles/holographic.css';

const Profile: React.FC = () => {
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [activeTab, setActiveTab] = useState<string>('owned');
  const [watchedItems, setWatchedItems] = useState<Set<number>>(new Set());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const darkMode = useDarkMode();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const userStats = {
    ownedNFTs: 42,
    totalValue: "156.7 ETH",
    sold: 18,
    created: 12
  };

  const ownedNFTs = [
    { id: 1, title: "Digital Dream #001", collection: "Digital Dreams", price: "2.5 ETH", image: "/src/assets/background_1.jpg" },
    { id: 2, title: "Abstract Reality #045", collection: "Abstract Realities", price: "1.8 ETH", image: "/src/assets/background_2.jpg" },
    { id: 3, title: "Crypto Landscape #012", collection: "Crypto Landscapes", price: "3.2 ETH", image: "/src/assets/background_3.jpg" }
  ];
  const toggleWatch = (nftId: number) => {
    setWatchedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nftId)) newSet.delete(nftId);
      else newSet.add(nftId);
      return newSet;
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login for security
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.4 } },
  };

  return (
    <>
      <WaveTransition isTransitioning={darkMode.isTransitioning} isDark={darkMode.isDark} />
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-visible gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
        role="main"
        aria-label="Profile Section"
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-amber-400 to-orange-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
        </div>

        <motion.header
          className="flex flex-col sm:flex-row justify-between items-center mb-10 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate={controls}
          role="banner"
          aria-label="Top Navigation"
        >
          <div className="relative flex items-center backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl w-full sm:w-auto lg:w-[380px] mb-4 sm:mb-0 group transition-all duration-500 bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50 sm:ml-auto sm:mr-4">
            <Search className="w-5 h-5 mr-3 transition-colors text-gray-500 group-focus-within:text-amber-500 dark:text-gray-400 dark:group-focus-within:text-blue-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search NFTs..."
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400 dark:text-gray-200 dark:placeholder-gray-500"
              aria-label="Search NFTs"
              role="searchbox"
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-amber-400/10 to-orange-500/10 dark:bg-gradient-to-r dark:from-blue-400/10 dark:to-purple-500/10" aria-hidden="true"></div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              className="relative cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-white hover:border-gray-300/50 dark:hover:bg-gradient-to-r dark:hover:from-[#1A1A1A] dark:hover:to-[#1F1F1F] dark:hover:border-gray-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View notifications"
            >
              <Bell className="w-6 h-6 transition-colors text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-blue-400" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg" aria-label="3 unread notifications">3</span>
            </motion.button>
            <DarkModeToggle />
          </div>
        </motion.header>

        <motion.main
          className="max-w-7xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div 
            className={`holographic-card rounded-2xl p-8 mb-8 shadow-xl transition-all duration-500 ${darkMode.isDark ? 'dark' : ''}`}
            variants={itemVariants}
            role="region"
            aria-label="Profile Information"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                <Suspense fallback={<div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>}>
                  <FloatingAvatar />
                </Suspense>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">John Doe</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Digital Art Collector & Creator</p>
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <span className="text-green-500 text-sm">●</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">0x742d35Cc6643C59532F3D8f...</span>
                  <button className="text-amber-600 hover:text-amber-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center">
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center backdrop-blur-sm rounded-xl p-3 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-md">
                    <div className="text-2xl font-bold text-amber-600 dark:text-blue-400">{userStats.ownedNFTs}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Owned</div>
                  </div>
                  <div className="text-center backdrop-blur-sm rounded-xl p-3 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-md">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.totalValue}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Portfolio</div>
                  </div>
                  <div className="text-center backdrop-blur-sm rounded-xl p-3 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-md">
                    <div className="text-2xl font-bold text-blue-600 dark:text-amber-400">{userStats.sold}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Sold</div>
                  </div>
                  <div className="text-center backdrop-blur-sm rounded-xl p-3 transition-all duration-300 bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30 hover:shadow-md">
                    <div className="text-2xl font-bold text-orange-600 dark:text-purple-400">{userStats.created}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Created</div>
                  </div>
                </div>
              </div>              <div className="flex flex-col space-y-3">
                <motion.button 
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-blue-500 dark:to-purple-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 dark:hover:from-blue-600 dark:hover:to-purple-700 transition-all duration-300 shadow-md flex items-center justify-center"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  <PenLine className="w-4 h-4 mr-2" /> Edit Profile
                </motion.button>
                <motion.button 
                  className="px-6 py-2 border border-amber-200 dark:border-gray-700 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 text-gray-700 dark:text-gray-300 flex items-center justify-center"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share Profile
                </motion.button>
                <motion.button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-6 py-2 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isLoggingOut ? { scale: 1.03 } : {}} 
                  whileTap={!isLoggingOut ? { scale: 0.97 } : {}}
                >
                  {isLoggingOut ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Logging Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="flex space-x-6 mb-8 border-b border-amber-200/50 dark:border-gray-800/50 transition-colors duration-500"
            variants={itemVariants} role="tablist" aria-label="Profile Sections"
          >
            {['owned', 'created', 'activity', 'favorites'].map(tab => (
              <button 
                key={tab}
                className={`pb-4 font-medium transition-colors duration-300 ${
                  activeTab === tab 
                    ? 'border-b-2 border-amber-500 text-amber-600 dark:border-blue-500 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`${tab}-tab`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'owned' ? 'NFTs' : ''}
              </button>
            ))}
          </motion.div>
          
          <LiquidContentWrapper contentKey={activeTab}>
            {activeTab === 'owned' && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                id="owned-tab" role="tabpanel" aria-labelledby="owned-tab"
                // variants={containerVariants} // Let LiquidContentWrapper handle main transition
                // initial="hidden"
                // animate="visible"
              >
                {ownedNFTs.map((nft) => (
                  <motion.div
                    key={nft.id}
                    className="backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 shadow-xl bg-gradient-to-r from-white/80 to-gray-50/80 border border-gray-200/50 dark:bg-gradient-to-r dark:from-[#1A1A1A] dark:to-[#1F1F1F] dark:border dark:border-gray-800/50 group"
                    variants={itemVariants} // For individual item animation
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="relative">
                      <img src={nft.image} alt={nft.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <motion.button
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            watchedItems.has(nft.id)
                              ? 'bg-amber-500 dark:bg-blue-500 text-white'
                              : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300'
                          }`}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => toggleWatch(nft.id)}
                          aria-label={watchedItems.has(nft.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={`w-4 h-4 ${watchedItems.has(nft.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 text-gray-800 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-blue-400 transition-colors duration-300">{nft.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{nft.collection}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-amber-600 dark:text-blue-400 font-bold">
                          <Wallet className="w-4 h-4 mr-1" />
                          <span>{nft.price}</span>
                        </div>
                        <motion.button 
                          className="text-sm px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-blue-500/10 dark:to-purple-500/10 text-amber-600 dark:text-blue-400 hover:from-amber-500/20 hover:to-orange-500/20 dark:hover:from-blue-500/20 dark:hover:to-purple-500/20 transition-all duration-300"
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                          Sell
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            {activeTab === 'created' && (
              <div id="created-tab" role="tabpanel" aria-labelledby="created-tab" className="p-8 text-center text-xl">Created NFTs Content (Placeholder)</div>
            )}
            {activeTab === 'activity' && (
              <div id="activity-tab" role="tabpanel" aria-labelledby="activity-tab" className="p-8 text-center text-xl">Activity Content (Placeholder)</div>
            )}
            {activeTab === 'favorites' && (
              <div id="favorites-tab" role="tabpanel" aria-labelledby="favorites-tab" className="p-8 text-center text-xl">Favorites Content (Placeholder)</div>
            )}
          </LiquidContentWrapper>

          {activeTab === 'owned' && (
            <motion.div 
              className="mt-12 text-center"
              // variants={itemVariants} // Let LiquidContentWrapper handle its animation
            >
              <motion.button 
                className="backdrop-blur-sm rounded-xl px-8 py-3 transition-all duration-500 bg-white/50 dark:bg-gray-800/30 border border-amber-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-800/50 shadow-md"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Load More NFTs
              </motion.button>
            </motion.div>
          )}
        </motion.main>
      </div>
    </>
  );
};

export default Profile;
