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

  // Navigation items
  const navigationItems = [
    {
      icon: "🏠",
      label: "Home",
      path: "/",
      description: "Dashboard"
    },
    {
      icon: "🎨",
      label: "Gallery",
      path: "/gallery",
      description: "Browse Art"
    },
    {
      icon: "🔨",
      label: "Auctions",
      path: "/auctions",
      description: "Live Bidding"
    },
    {
      icon: "💎",
      label: "Collections",
      path: "/collections",
      description: "NFT Series"
    },
    {
      icon: "👤",
      label: "Profile",
      path: "/profile",
      description: "My Account"
    }
  ];

  // Quick actions
  const quickActions = [
    {
      icon: "🚀",
      label: "Create NFT",
      action: "create",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: "💰",
      label: "Sell Art",
      action: "sell",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📊",
      label: "Analytics",
      action: "analytics",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Wallet info (mock data)
  const walletInfo = {
    address: "0x742d...4e9f",
    balance: "12.45 ETH",
    isConnected: true
  };

  useEffect(() => {
    setActiveSection(location.pathname);
  }, [location]);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0f0f23] via-[#1a1a3e] to-[#2d1b69] backdrop-blur-xl border-r border-white/10 z-50 lg:z-30"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div 
            className="p-6 border-b border-white/10"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">ArtChain</h2>
                  <p className="text-gray-400 text-xs">Digital Marketplace</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors duration-200 lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Wallet Info */}
          <motion.div 
            className="p-6 border-b border-white/10"
            variants={itemVariants}
          >
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Wallet</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs">Connected</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-white font-mono text-sm">{walletInfo.address}</div>
                <div className="text-purple-400 font-semibold">{walletInfo.balance}</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            className="flex-1 p-6 space-y-2"
            variants={containerVariants}
          >
            <div className="mb-6">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">                {navigationItems.map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        activeSection === item.path
                          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => setActiveSection(item.path)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                      {activeSection === item.path && (
                        <motion.div
                          className="w-2 h-2 bg-purple-400 rounded-full"
                          layoutId="activeIndicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">                {quickActions.map((action) => (
                  <motion.button
                    key={action.action}
                    className={`w-full group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-200 text-white`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="p-6 border-t border-white/10"
            variants={itemVariants}
          >
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
              
              <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Toggle Button for Desktop */}
      <motion.button
        className="fixed top-6 left-6 z-30 lg:block hidden w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg text-white hover:shadow-purple-500/25 transition-all duration-300"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { x: 320 } : { x: 0 }}
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
          />
        </svg>
      </motion.button>
    </>
  );
};

export default Sidebar;
