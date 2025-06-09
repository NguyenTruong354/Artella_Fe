import React, { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut } from "lucide-react";

interface AuctionGalleryProps {
  image: string;
  zoomLevel?: number;
}

const AuctionGallery: React.FC<AuctionGalleryProps> = ({ image, zoomLevel: initialZoomLevel = 1 }) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  
  const handleZoom = (direction: "in" | "out") => {
    setZoomLevel((prev) => {
      if (direction === "in") return Math.min(prev + 0.2, 2);
      return Math.max(prev - 0.2, 0.8);
    });
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
      },
    },
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-gray-800 to-gray-700 min-h-[60vh] flex items-center justify-center"
      variants={itemVariants}
    >
      {/* Gallery Lighting */}
      <div className="absolute inset-0 bg-gradient-radial from-yellow-200/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Spotlight Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 800px 400px at center 60%, rgba(255,223,0,0.1) 0%, transparent 50%)`,
        }}
      />
      
      {/* Wall Texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`,
        }}
      />
      
      {/* Auctioneer Podium - Left Side */}
      <motion.div
        className="absolute left-8 bottom-8 z-10"
        variants={itemVariants}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Podium Base Foundation */}
        <div className="relative">
          {/* Podium Shadow/Base */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-black/30 rounded-full blur-md"></div>

          {/* Main Podium Structure */}
          <div className="relative w-24 h-36 bg-gradient-to-t from-yellow-900 via-yellow-700 to-yellow-500 rounded-t-2xl shadow-2xl border-3 border-yellow-400/70">
            {/* Podium Base Ring */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-26 h-3 bg-gradient-to-r from-yellow-800 to-yellow-600 rounded-full border border-yellow-500/50"></div>

            {/* Podium Top Surface */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-t-2xl shadow-inner border-2 border-yellow-200/80">
              {/* Lectern Surface Details */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-yellow-400 rounded shadow-inner opacity-90">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-yellow-200 rounded"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-14 h-0.5 bg-yellow-200 rounded"></div>
              </div>
            </div>

            {/* Podium Middle Section */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-18 h-16 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded border border-yellow-500/60">
              {/* Decorative Elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded shadow-sm"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded"></div>
              <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded"></div>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded shadow-inner"></div>
            </div>

            {/* Podium Side Panels */}
            <div className="absolute top-12 -left-1 w-2 h-12 bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-l transform -skew-y-2 opacity-70"></div>
            <div className="absolute top-12 -right-1 w-2 h-12 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-r transform skew-y-2 opacity-80"></div>

            {/* Professional Microphone Setup */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              {/* Mic Stand */}
              <div className="w-1.5 h-16 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-sm relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-400 rounded-full"></div>
              </div>

              {/* Microphone Head */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full border-2 border-gray-500 shadow-lg">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-600 rounded"></div>
              </div>

              {/* Mic Windscreen */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-5 h-7 bg-gray-800/20 rounded-full border border-gray-600/30"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Artwork Display */}
      <motion.div
        className="relative w-[80%] max-w-4xl mx-auto"
        style={{ transform: `scale(${zoomLevel})` }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Frame */}
        <div className="p-4 bg-gradient-to-br from-yellow-700 via-yellow-600 to-yellow-800 rounded-xl shadow-2xl border-8 border-gradient-gold">
          {/* Artwork */}
          <img
            src={image}
            alt="Auction artwork"
            className="w-full object-cover shadow-inner rounded"
            style={{ aspectRatio: "16/9" }}
          />
          {/* Plaque */}
          <div className="mt-2 py-1 px-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded text-center">
            <p className="text-gold-300 text-sm">Now Viewing</p>
          </div>
        </div>
      </motion.div>

      {/* Zoom Controls - New Addition */}
      <div className="absolute top-4 right-4 flex space-x-2 z-20">
        <button
          onClick={() => handleZoom("in")}
          className="p-2 bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2 bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

export default AuctionGallery;
