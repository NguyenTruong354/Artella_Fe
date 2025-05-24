import React from 'react';
import { motion } from 'framer-motion';

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Art Gallery</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Discover amazing digital artworks from talented artists around the world
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div
              key={item}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Artwork {item}</h3>
              <p className="text-gray-600">By Artist Name</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-amber-600 font-bold">2.5 ETH</span>
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Gallery;
