import React from 'react';
import { motion } from 'framer-motion';

const Collections: React.FC = () => {
  const collections = [
    {
      id: 1,
      name: "Digital Dreams",
      description: "A collection of surreal digital artworks exploring the boundaries of imagination",
      items: 125,
      floorPrice: "0.5 ETH",
      volume: "234 ETH",
      image: "/src/assets/background_1.jpg",
      verified: true
    },
    {
      id: 2,
      name: "Abstract Realities",
      description: "Modern abstract art pieces that challenge perception and reality",
      items: 89,
      floorPrice: "0.8 ETH",
      volume: "189 ETH",
      image: "/src/assets/background_2.jpg",
      verified: true
    },
    {
      id: 3,
      name: "Crypto Landscapes",
      description: "Beautiful landscapes reimagined through blockchain technology",
      items: 67,
      floorPrice: "1.2 ETH",
      volume: "312 ETH",
      image: "/src/assets/background_3.jpg",
      verified: false
    }
  ];

  return (
    <div className="min-h-screen text-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            NFT Collections
          </h1>
          <p className="text-xl text-gray-600">
            Explore curated collections from top artists and creators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-200/50 hover:border-amber-400/50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: collection.id * 0.1 }}
            >
              <div className="relative">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-48 object-cover"
                />
                {collection.verified && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold">{collection.name}</h3>
                  {collection.verified && (
                    <span className="ml-2 text-blue-500 text-sm">✓ Verified</span>
                  )}
                </div>
                <p className="text-gray-600 mb-4 text-sm">{collection.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-gray-600 text-xs">Items</p>
                    <p className="font-semibold">{collection.items}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Floor</p>
                    <p className="font-semibold text-amber-600">{collection.floorPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Volume</p>
                    <p className="font-semibold text-green-600">{collection.volume}</p>
                  </div>
                </div>
                
                <motion.button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Collection
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="bg-white/50 backdrop-blur-sm border border-amber-200/50 text-gray-800 px-8 py-3 rounded-xl hover:bg-white/70 transition-all duration-300">
            Explore More Collections
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Collections;
