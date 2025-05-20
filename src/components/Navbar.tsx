import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Solution", to: "/solution" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const location = useLocation();

  // Cập nhật active menu item dựa vào location
  useEffect(() => {
    const path = location.pathname;
    const currentItem = menuItems.find(item => item.to === path);
    if (currentItem) {
      setActiveItem(currentItem.label);
    } else {
      setActiveItem("");
    }
  }, [location]);  return (    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-[70px] bg-white/1 backdrop-blur-sm z-50 border-b border-white/5 shadow-lg"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Link to="/" className="flex items-center space-x-2 select-none">
            <motion.div 
              className="bg-white rounded-lg w-12 h-12 flex items-center justify-center shadow-md overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img
                src="/src/assets/Logo.PNG"
                alt="Artella Logo"
                className="w-8 h-8"
              />
            </motion.div>
            <motion.span
              className="text-white text-2xl font-semibold"
              style={{ fontFamily: "Segoe Print" }}
              whileHover={{ scale: 1.05, color: "#FCD34D" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Artella
            </motion.span>
          </Link>
        </motion.div>{/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <motion.div 
            className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 space-x-1 border border-white/20 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            {menuItems.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <motion.div key={item.label} className="relative">
                  <Link
                    to={item.to}
                    className={`px-4 py-2 rounded-md text-white font-medium transition-all duration-300 flex items-center hover:bg-white/15 ${
                      isActive ? "bg-white/15" : ""
                    }`}
                    onClick={() => setActiveItem(item.label)}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-2 right-2 h-0.5 bg-yellow-400 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
            
            {/* Language Dropdown */}
            <div className="relative">
              <motion.button 
                className={`flex items-center px-4 py-2 rounded-md text-white font-medium hover:bg-white/15 focus:outline-none ${
                  languageDropdown ? "bg-white/15" : ""
                }`}
                onClick={() => setLanguageDropdown(prev => !prev)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg
                  className="w-5 h-5 mr-1 text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"
                  />
                </svg>
                <span>English</span>
                <motion.svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  animate={{ rotate: languageDropdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {languageDropdown && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-md rounded-xl shadow-lg py-2 z-10 border border-white/30"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button 
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 text-xs">EN</span>
                      English
                    </motion.button>
                    <motion.button 
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                      whileHover={{ x: 3 }}
                    >
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2 text-xs">VI</span>
                      Vietnamese
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>        {/* Login/Register Button */}
        <div className="hidden md:flex">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              to="/login"
              className="ml-6 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 border border-yellow-400/30 flex items-center"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login/Register
              </motion.span>
              <motion.svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>        {/* Hamburger (Mobile) */}
        <motion.button
          className="md:hidden flex items-center justify-center w-12 h-12 rounded-full text-white bg-white/10 hover:bg-white/20 focus:outline-none border border-white/20 backdrop-blur-md"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </motion.div>
        </motion.button>
      </div>{" "}
      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={
          menuOpen
            ? { opacity: 1, y: 0, pointerEvents: "auto" }
            : { opacity: 0, y: -20, pointerEvents: "none" }
        }
        transition={{ duration: 0.3 }}
        className="md:hidden absolute top-[60px] left-0 w-full bg-black/70 backdrop-blur-md shadow-lg z-40 border-b border-white/10"
      >
        <div className="flex flex-col items-center py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="w-11/12 text-center px-4 py-3 rounded-md text-white font-medium bg-white/10 hover:bg-white/20 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button className="w-11/12 flex items-center justify-center px-4 py-3 rounded-md text-white font-medium bg-white/10 hover:bg-white/20">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707"
              />
            </svg>
            English
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Link
            to="/login"
            className="w-11/12 text-center px-4 py-3 rounded-md bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Login/Register
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
