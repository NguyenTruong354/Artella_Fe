import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [time, setTime] = useState(new Date());

  // Navigation items with artistic icons
  const navigationItems = [
    {
      icon: "⌂",
      label: "Home",
      path: "/home",
      description: "Creative Hub",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: "⚘",
      label: "Gallery",
      path: "gallery",
      description: "Art Collection",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: "⚡",
      label: "Auctions",
      path: "auctions",
      description: "Live Bidding",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: "◊",
      label: "Collections",
      path: "/collections",
      description: "NFT Series",
      gradient: "from-pink-500 to-purple-500"
    },
    {
      icon: "⌘",
      label: "Profile",
      path: "/profile",
      description: "Your Space",
      gradient: "from-purple-500 to-indigo-500"
    }
  ];

  // Artistic quick actions
  const quickActions = [
    {
      icon: "✦",
      label: "Create NFT",
      action: "create",
      gradient: "from-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
      description: "Mint Art"
    },
    {
      icon: "⊙",
      label: "Sell Art",
      action: "sell",
      gradient: "from-gradient-to-r from-green-400 via-blue-500 to-purple-600",
      description: "List Item"
    },
    {
      icon: "◈",
      label: "Analytics",
      action: "analytics",
      gradient: "from-gradient-to-r from-purple-400 via-pink-500 to-red-500",
      description: "View Stats"
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Wallet info (mock data)
  const walletInfo = {
    address: "0x742d...4e9f",
    balance: "12.45 ETH",
    isConnected: true
  };

  useEffect(() => {
    setActiveSection(location.pathname);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [location]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Artistic Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-80 z-50 lg:z-30 overflow-hidden"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Complex Artistic Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
          
          {/* Organic shapes overlay */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-20" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="organic1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#ea580c" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="organic2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              
              {/* Organic flowing shapes */}
              <path d="M0,100 Q100,50 200,100 T400,100 L400,300 Q300,250 200,300 T0,300 Z" fill="url(#organic1)"/>
              <path d="M0,400 Q150,350 300,400 T400,400 L400,600 Q250,550 100,600 T0,600 Z" fill="url(#organic2)"/>
              <path d="M0,650 Q200,600 400,650 L400,800 L0,800 Z" fill="url(#organic1)"/>
              
              {/* Floating artistic elements */}
              <circle cx="50" cy="150" r="30" fill="url(#organic2)" opacity="0.6"/>
              <circle cx="350" cy="300" r="25" fill="url(#organic1)" opacity="0.4"/>
              <circle cx="100" cy="500" r="20" fill="url(#organic2)" opacity="0.5"/>
              <circle cx="320" cy="650" r="35" fill="url(#organic1)" opacity="0.3"/>
              
              {/* Artistic lines */}
              <path d="M50,50 Q200,100 350,50" stroke="url(#organic1)" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M0,250 Q200,200 400,250" stroke="url(#organic2)" strokeWidth="1.5" fill="none" opacity="0.4"/>
              <path d="M50,750 Q200,700 350,750" stroke="url(#organic1)" strokeWidth="1" fill="none" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  x: [-5, 5, -5],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Glass morphism overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/40 border-r border-amber-200/50"></div>
        </div>        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Artistic Header */}
          <motion.div 
            className="p-6 relative"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-transparent"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-white font-bold text-xl relative z-10">A</span>
                  </div>
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h2 className="text-gray-800 font-bold text-xl tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ArtChain
                  </h2>
                  <p className="text-gray-600 text-xs font-medium">Creative Marketplace</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-200 lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Artistic Time Display */}
            <motion.div 
              className="text-center py-3 px-4 bg-white/60 rounded-2xl border border-amber-200/60 backdrop-blur-sm"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="text-gray-800 font-mono text-sm">
                {time.toLocaleTimeString()}
              </div>
              <div className="text-gray-600 text-xs">
                {time.toLocaleDateString()}
              </div>
            </motion.div>
          </motion.div>          {/* Artistic Wallet Info */}
          <motion.div 
            className="px-6 pb-6"
            variants={itemVariants}
          >
            <div className="relative overflow-hidden">
              {/* Artistic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-amber-50/80 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-100/30 to-orange-100/30 rounded-3xl"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-300/20 to-transparent rounded-full transform translate-x-4 -translate-y-4"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-orange-300/20 to-transparent rounded-full transform -translate-x-3 translate-y-3"></div>
              
              <div className="relative p-5 border border-amber-200/40 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 text-sm font-bold tracking-wide flex items-center">
                    <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 shadow-sm"></span>
                    Wallet Connected
                  </span>
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </motion.div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100/80 px-4 py-3 rounded-2xl border border-gray-200/50">
                    <div className="text-gray-800 font-mono text-sm tracking-wider">{walletInfo.address}</div>
                  </div>
                  <div className="text-amber-700 font-bold text-2xl tracking-tight">
                    {walletInfo.balance}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>          {/* Artistic Navigation */}
          <motion.div 
            className="flex-1 px-6 space-y-6"
            variants={containerVariants}
          >
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                <span className="w-8 h-px bg-gradient-to-r from-amber-400 to-orange-400 mr-3"></span>
                Navigation
              </h3>
              <nav className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div 
                    key={item.path} 
                    variants={itemVariants}
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      className={`group relative flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                        activeSection === item.path
                          ? "bg-white/70 border border-amber-300/50 text-gray-800 shadow-lg"
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }`}
                      onClick={() => setActiveSection(item.path)}
                    >
                      {/* Background gradient for active item */}
                      {activeSection === item.path && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-5`}
                          layoutId="activeBackground"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      
                      {/* Icon with artistic styling */}
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                        activeSection === item.path 
                          ? `bg-gradient-to-br ${item.gradient} text-white shadow-md` 
                          : "bg-white/60 text-gray-600 group-hover:bg-white/80"
                      }`}>
                        <span className="text-lg font-bold">{item.icon}</span>
                        {activeSection === item.path && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-semibold tracking-wide">{item.label}</div>
                        <div className="text-xs opacity-70 font-medium">{item.description}</div>
                      </div>
                      
                      {activeSection === item.path && (
                        <motion.div
                          className={`w-3 h-3 bg-gradient-to-br ${item.gradient} rounded-full shadow-sm`}
                          layoutId="activeIndicator"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>            {/* Artistic Quick Actions */}
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                <span className="w-8 h-px bg-gradient-to-r from-orange-400 to-red-400 mr-3"></span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.action}
                    className="w-full group relative flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20"
                      animate={{ 
                        x: [-100, 400],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: index * 0.5 
                      }}
                    />
                    
                    <div className="relative flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl">
                      <span className="text-xl font-bold">{action.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold tracking-wide">{action.label}</div>
                      <div className="text-xs opacity-80 font-medium">{action.description}</div>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>          {/* Artistic Footer */}
          <motion.div 
            className="p-6 relative"
            variants={itemVariants}
          >
            <div className="relative overflow-hidden bg-white/60 rounded-3xl border border-amber-200/40 backdrop-blur-sm">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full transform translate-x-6 -translate-y-6"></div>
              
              <div className="relative p-4 space-y-3">
                <motion.button 
                  className="w-full flex items-center justify-center space-x-3 p-3 rounded-2xl bg-white/60 text-gray-700 hover:text-gray-800 hover:bg-white/80 transition-all duration-200 border border-gray-200/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    </svg>
                  </div>
                  <span className="font-medium">Settings</span>
                </motion.button>
                
                <motion.button 
                  className="w-full flex items-center justify-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                  </div>
                  <span className="font-medium">Disconnect</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>      {/* Artistic Toggle Button for Desktop */}
      <motion.button
        className="fixed top-6 left-6 z-30 lg:block hidden w-14 h-14 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-xl text-white hover:shadow-2xl transition-all duration-300 overflow-hidden group"
        onClick={onToggle}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { x: 320, rotate: 180 } : { x: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-transparent"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="relative flex items-center justify-center w-full h-full">
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </motion.svg>
        </div>
      </motion.button>
    </>
  );
};

export default Sidebar;
