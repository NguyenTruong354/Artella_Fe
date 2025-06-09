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
