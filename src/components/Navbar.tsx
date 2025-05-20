import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Solution", to: "/solution" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-[60px] bg-transparent backdrop-blur-sm z-50"
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 select-none">
          <div className="bg-white rounded-lg w-12 h-12 flex items-center justify-center">
            {/* Replace with your logo image/icon */}
            <img
              src="/src/assets/Logo.PNG"
              alt="Artella Logo"
              className="w-8 h-8"
            />
          </div>{" "}
          <span
            className="text-white text-2xl font-semibold"
            style={{ fontFamily: "Segoe Print" }}
          >
            Artella
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-2 py-1 space-x-2 border border-white/10">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 hover:bg-white/20 focus:bg-white/20 focus:outline-none"
              >
                {item.label}
              </Link>
            ))}
            {/* Language Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-md text-white font-medium hover:bg-white/20 focus:bg-white/20 focus:outline-none">
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
              {/* Dropdown (hidden for now) */}
              {/* <div className="absolute left-0 mt-2 w-32 bg-white/90 rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">English</button>
                <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Vietnamese</button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Login/Register Button */}
        <div className="hidden md:flex">
          <Link
            to="/login"
            className="ml-6 px-6 py-2 rounded-md bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none"
          >
            Login/Register
          </Link>
        </div>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-white hover:bg-white/10 focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
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
