import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Constants
const BASE_TRANSITION_DURATION = 0.01;
const SPRING_TRANSITION_NORMAL = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};
const SPRING_TRANSITION_SIDEBAR_CLOSED = {
  type: "spring",
  stiffness: 400,
  damping: 40,
};
const SPRING_TRANSITION_ITEM_OPEN = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};
const SPRING_TRANSITION_ITEM_CLOSED_DURATION = 0.2;
const SPRING_TRANSITION_ICON_HOVER = {
  type: "spring",
  stiffness: 350,
  damping: 10,
};
const SPRING_TRANSITION_ACTIVE_INDICATOR = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};
const SPRING_TRANSITION_TOGGLE_BUTTON = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

const REDUCED_MOTION_TRANSITION = {
  type: "tween",
  duration: BASE_TRANSITION_DURATION,
};

const STAGGER_CHILDREN_OPEN = 0.08;
const DELAY_CHILDREN_OPEN = 0.15;
const STAGGER_CHILDREN_CLOSED = 0.03;

const FLOATING_PARTICLE_ANIMATION = {
  y: [-10, 10, -10],
  x: [-5, 5, -5],
  scale: [0.8, 1.2, 0.8],
  opacity: [0.2, 0.5, 0.2],
};
const FLOATING_PARTICLE_TRANSITION = () => ({
  duration: 4 + Math.random() * 2,
  repeat: Infinity,
  delay: Math.random() * 2,
  ease: "easeInOut",
});
const REDUCED_FLOATING_PARTICLE_ANIMATION = { opacity: 0.2, scale: 0.8 };

const HEADER_ICON_ROTATION_TRANSITION = {
  duration: 20,
  repeat: Infinity,
  ease: "linear",
};
const HEADER_ICON_GLOW_ANIMATION = {
  scale: [1, 1.2, 1],
  opacity: [0.5, 0.8, 0.5],
};
const HEADER_ICON_GLOW_TRANSITION = { duration: 2, repeat: Infinity };
const HEADER_ICON_DOT_ANIMATION = { scale: [1, 1.3, 1] };
const HEADER_ICON_DOT_TRANSITION = { duration: 1.5, repeat: Infinity };

const QUICK_ACTION_HIGHLIGHT_ANIMATION = () => ({
  x: [-100, 400],
  opacity: [0, 0.5, 0],
});
const QUICK_ACTION_HIGHLIGHT_TRANSITION = (index: number) => ({
  duration: 3,
  repeat: Infinity,
  delay: index * 0.5,
});

const TOGGLE_BUTTON_GLOW_ANIMATION = {
  scale: [1, 1.2, 1],
  opacity: [0.3, 0.6, 0.3],
};
const TOGGLE_BUTTON_GLOW_TRANSITION = { duration: 2, repeat: Infinity };

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [time, setTime] = useState(new Date());
  const prefersReducedMotion = useReducedMotion();

  // Navigation items with artistic icons
  const navigationItems = [
    {
      icon: "⌂",
      label: "Home",
      path: "/Home",
      description: "Creative Hub",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: "⚘",
      label: "Gallery",
      path: "/Home/gallery",
      description: "Art Collection",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: "⚡",
      label: "Auctions",
      path: "/Home/auctions",
      description: "Live Bidding",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: "◊",
      label: "Collections",
      path: "/Home/collections",
      description: "NFT Series",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      icon: "⌘",
      label: "Profile",
      path: "/Home/profile",
      description: "Your Space",
      gradient: "from-purple-500 to-indigo-500",
    },
  ];
  // Artistic quick actions
  const quickActions = [
    {
      icon: "✦",
      label: "Create NFT",
      action: "create",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      description: "Mint Art",
    },
    {
      icon: "⊙",
      label: "Sell Art",
      action: "sell",
      gradient: "from-green-400 via-blue-500 to-purple-600",
      description: "List Item",
    },
    {
      icon: "⚖",
      label: "Live Auction",
      action: "live-auction",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      description: "Join Auction",
    },
    {
      icon: "📅",
      label: "Schedule Auction",
      action: "schedule-auction",
      gradient: "from-blue-400 via-cyan-500 to-teal-500",
      description: "Plan Auction",
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: prefersReducedMotion
        ? REDUCED_MOTION_TRANSITION
        : SPRING_TRANSITION_NORMAL,
    },
    closed: {
      x: "-100%",
      transition: prefersReducedMotion
        ? REDUCED_MOTION_TRANSITION
        : SPRING_TRANSITION_SIDEBAR_CLOSED,
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: prefersReducedMotion
        ? REDUCED_MOTION_TRANSITION
        : SPRING_TRANSITION_ITEM_OPEN,
    },
    closed: {
      opacity: 0,
      x: -30,
      transition: prefersReducedMotion
        ? REDUCED_MOTION_TRANSITION
        : { duration: SPRING_TRANSITION_ITEM_CLOSED_DURATION },
    },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : STAGGER_CHILDREN_OPEN,
        delayChildren: prefersReducedMotion ? 0 : DELAY_CHILDREN_OPEN,
      },
    },
    closed: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : STAGGER_CHILDREN_CLOSED,
        staggerDirection: -1,
      },
    },
  };

  const floatingVariants = {
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : {
          y: [-10, 10, -10],
          rotate: [-5, 5, -5],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
  };
  useEffect(() => {
    setActiveSection(location.pathname);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [location]);
  // Handle quick action clicks
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        navigate("/Home/create-nft");
        break;
      case "sell":
        // TODO: Add sell functionality
        console.log("Sell action clicked");
        break;
      case "live-auction":
        // Navigate to Auctions page
        navigate("/auctions");
        console.log("Live Auction action clicked - navigating to /auctions");
        break;
      case "schedule-auction":
        // Navigate to Create Scheduled Auction page
        navigate("/Home/create-scheduled-auction");
        console.log("Schedule Auction action clicked - navigating to /Home/create-scheduled-auction");
        break;
      default:
        break;
    }
  };

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

      {/* Modern Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full w-[90vw] max-w-xs sm:w-72 md:w-80 z-50 lg:z-30 overflow-hidden" // Updated width classes for responsiveness
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={{ willChange: "transform" }}
      >
        {/* Modern Background */}
        <div className="absolute inset-0">
          {/* Base gradient - matching HomeSection style */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111]"></div>

          {/* Subtle decorative elements */}
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-5 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl opacity-5 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"></div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-cyan-500 dark:from-amber-400 dark:to-orange-500 rounded-full"
                style={{
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                  willChange: "transform, opacity",
                }}
                animate={
                  prefersReducedMotion
                    ? REDUCED_FLOATING_PARTICLE_ANIMATION
                    : FLOATING_PARTICLE_ANIMATION
                }
                transition={
                  prefersReducedMotion
                    ? REDUCED_MOTION_TRANSITION
                    : FLOATING_PARTICLE_TRANSITION()
                }
              />
            ))}
          </div>

          {/* Glass morphism overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/80 dark:bg-black/20 border-r border-gray-200/50 dark:border-gray-800/30"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Modern Header */}
          <motion.div
            className="p-6 relative"
            variants={itemVariants}
            style={{ willChange: "opacity, transform" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative"
                  animate={
                    prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }
                  }
                  transition={
                    prefersReducedMotion
                      ? REDUCED_MOTION_TRANSITION
                      : HEADER_ICON_ROTATION_TRANSITION
                  }
                  style={{ willChange: "transform" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-amber-500 dark:to-orange-500 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-yellow-400/30 dark:to-transparent"
                      animate={
                        prefersReducedMotion
                          ? { scale: 1, opacity: 0.5 }
                          : HEADER_ICON_GLOW_ANIMATION
                      }
                      transition={
                        prefersReducedMotion
                          ? REDUCED_MOTION_TRANSITION
                          : HEADER_ICON_GLOW_TRANSITION
                      }
                      style={{ willChange: "transform, opacity" }}
                    />
                    <img
                      src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png"
                      alt="ArtChain Logo"
                      className="w-8 h-8 relative z-10" // Adjust size as needed
                    />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-yellow-400 dark:to-amber-500 rounded-full"
                    animate={
                      prefersReducedMotion
                        ? { scale: 1 }
                        : HEADER_ICON_DOT_ANIMATION
                    }
                    transition={
                      prefersReducedMotion
                        ? REDUCED_MOTION_TRANSITION
                        : HEADER_ICON_DOT_TRANSITION
                    }
                    style={{ willChange: "transform" }}
                  />
                </motion.div>
                <div>
                  <h2 className="text-gray-800 dark:text-gray-200 font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                    ArtChain
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                    Creative Marketplace
                  </p>
                </div>
              </div>

              <button
                onClick={onToggle}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200 lg:hidden"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Modern Time Display */}
            <motion.div
              className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/30 rounded-2xl px-4 py-3 shadow-lg"
              variants={floatingVariants}
              animate="animate"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                {time.toLocaleTimeString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                {time.toLocaleDateString()}
              </div>
            </motion.div>{" "}
          </motion.div>

          {/* Modern Navigation */}
          <motion.div
            className="flex-1 px-6 space-y-6 overflow-y-auto custom-scrollbar"
            variants={containerVariants}
            style={{ willChange: "opacity" }}
          >
            <div>
              <h3
                id="navigation-heading"
                className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center"
              >
                <span className="w-8 h-px bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-amber-400 dark:to-orange-500 mr-3"></span>
                Navigation
              </h3>
              <nav className="space-y-2" aria-labelledby="navigation-heading">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={itemVariants}
                    custom={index}
                    style={{ willChange: "opacity, transform" }}
                  >
                    <Link
                      to={item.path}
                      title={item.description}
                      aria-label={item.description}
                      className={`group relative flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                        activeSection === item.path
                          ? "backdrop-blur-lg shadow-xl bg-gradient-to-br from-white/80 via-gray-50/80 to-gray-100/80 border border-gray-200/50 dark:bg-gradient-to-br dark:from-[#1A1A1A]/80 dark:via-[#1D1D1D]/80 dark:to-[#202020]/80 dark:border dark:border-gray-700/30" // Changed shadow-2xl to shadow-xl
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/30"
                      }`}
                      onClick={() => setActiveSection(item.path)}
                    >
                      {/* Background gradient for active item */}
                      {activeSection === item.path && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-5`}
                          layoutId="activeBackground"
                          transition={
                            prefersReducedMotion
                              ? REDUCED_MOTION_TRANSITION
                              : SPRING_TRANSITION_ACTIVE_INDICATOR
                          }
                          style={{ willChange: "transform, opacity" }}
                        />
                      )}

                      {/* Icon with modern styling */}
                      <motion.div
                        className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                          activeSection === item.path
                            ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                            : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80"
                        }`}
                        whileHover={
                          prefersReducedMotion ? {} : { scale: 1.15, rotate: 5 }
                        }
                        transition={
                          prefersReducedMotion
                            ? REDUCED_MOTION_TRANSITION
                            : SPRING_TRANSITION_ICON_HOVER
                        }
                        style={{ willChange: "transform" }}
                      >
                        <span className="text-lg font-bold">{item.icon}</span>
                      </motion.div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            activeSection === item.path
                              ? "text-gray-800 dark:text-gray-200"
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs ${
                            activeSection === item.path
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {activeSection === item.path && (
                        <motion.div
                          className={`w-1.5 h-10 bg-gradient-to-br ${item.gradient} rounded-full shadow-md`}
                          layoutId="activeIndicator"
                          transition={
                            prefersReducedMotion
                              ? REDUCED_MOTION_TRANSITION
                              : SPRING_TRANSITION_ACTIVE_INDICATOR
                          }
                          style={{ willChange: "transform" }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Modern Quick Actions */}
            <div>
              <h3
                id="quick-actions-heading"
                className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center"
              >
                <span className="w-8 h-px bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-amber-400 dark:to-orange-500 mr-3"></span>
                Quick Actions
              </h3>
              <div
                className="space-y-3"
                role="group"
                aria-labelledby="quick-actions-heading"
              >                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.action}
                    title={action.description}
                    aria-label={action.description}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full group relative flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-amber-500 dark:to-orange-600 hover:from-blue-600 hover:to-cyan-700 dark:hover:from-amber-600 dark:hover:to-orange-600 text-white transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                    variants={itemVariants}
                    custom={index}
                    whileHover={
                      prefersReducedMotion ? {} : { scale: 1.02, y: -2 }
                    }
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Decorative animated highlight */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : QUICK_ACTION_HIGHLIGHT_ANIMATION()
                      }
                      transition={
                        prefersReducedMotion
                          ? REDUCED_MOTION_TRANSITION
                          : QUICK_ACTION_HIGHLIGHT_TRANSITION(index)
                      }
                      style={{ willChange: "transform, opacity" }}
                    />

                    {/* Icon container */}
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl"
                      whileHover={
                        prefersReducedMotion ? {} : { scale: 1.15, rotate: -5 }
                      }
                      transition={
                        prefersReducedMotion
                          ? REDUCED_MOTION_TRANSITION
                          : SPRING_TRANSITION_ICON_HOVER
                      }
                      style={{ willChange: "transform" }}
                    >
                      <span className="text-lg font-bold">{action.icon}</span>
                    </motion.div>

                    {/* Text container */}
                    <div className="flex-1 text-left">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-white/70">
                        {action.description}
                      </p>
                    </div>

                    {/* Arrow icon */}
                    <svg
                      className="w-5 h-5 text-white/70 group-hover:text-white transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Modern Footer */}
          <motion.div
            className="p-6 relative"
            variants={itemVariants}
            style={{ willChange: "opacity, transform" }}
          >
            <div className="backdrop-blur-lg rounded-3xl shadow-lg p-4 transition-all duration-500 bg-gradient-to-br from-white/80 via-gray-50/80 to-gray-100/80 border border-gray-200/50 dark:bg-gradient-to-br dark:from-[#1A1A1A]/80 dark:via-[#1D1D1D]/80 dark:to-[#202020]/80 dark:border dark:border-gray-800/30">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  © 2025 ArtChain
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    whileHover={
                      prefersReducedMotion ? {} : { scale: 1.1, y: -2 }
                    }
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                    style={{ willChange: "transform" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    whileHover={
                      prefersReducedMotion ? {} : { scale: 1.1, y: -2 }
                    }
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                    style={{ willChange: "transform" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    whileHover={
                      prefersReducedMotion ? {} : { scale: 1.1, y: -2 }
                    }
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                    style={{ willChange: "transform" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Modern Toggle Button for Desktop */}
      <motion.button
        className="fixed top-6 left-6 z-30 lg:block hidden w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-amber-500 dark:to-orange-600 rounded-xl shadow-lg text-white overflow-hidden group"
        onClick={onToggle}
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        animate={
          isOpen
            ? prefersReducedMotion
              ? { x: 320, rotate: 0 }
              : { x: 320, rotate: 180 }
            : { x: 0, rotate: 0 }
        }
        transition={
          prefersReducedMotion
            ? REDUCED_MOTION_TRANSITION
            : SPRING_TRANSITION_TOGGLE_BUTTON
        }
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
          animate={
            prefersReducedMotion
              ? { scale: 1, opacity: 0.3 }
              : TOGGLE_BUTTON_GLOW_ANIMATION
          }
          transition={
            prefersReducedMotion
              ? REDUCED_MOTION_TRANSITION
              : TOGGLE_BUTTON_GLOW_TRANSITION
          }
          style={{ willChange: "transform, opacity" }}
        />
        <svg
          className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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