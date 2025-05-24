import React from 'react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const userStats = {
    ownedNFTs: 42,
    totalValue: "156.7 ETH",
    sold: 18,
    created: 12
  };

  const ownedNFTs = [
    {
      id: 1,
      title: "Digital Dream #001",
      collection: "Digital Dreams",
      price: "2.5 ETH",
      image: "/src/assets/background_1.jpg"
    },
    {
      id: 2,
      title: "Abstract Reality #045",
      collection: "Abstract Realities",
      price: "1.8 ETH",
      image: "/src/assets/background_2.jpg"
    },
    {
      id: 3,
      title: "Crypto Landscape #012",
      collection: "Crypto Landscapes",
      price: "3.2 ETH",
      image: "/src/assets/background_3.jpg"
    }
  ];

  return (
    <div className="min-h-screen text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Profile Header */}
        <motion.div 
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold">
              JD
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-gray-400 mb-4">Digital Art Collector & Creator</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <span className="text-green-400 text-sm">●</span>
                <span className="text-sm text-gray-300">0x742d35Cc6643C59532F3D8f...</span>
                <button className="text-purple-400 hover:text-purple-300 text-sm">Copy</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.ownedNFTs}</div>
                  <div className="text-gray-400 text-sm">Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userStats.totalValue}</div>
                  <div className="text-gray-400 text-sm">Portfolio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.sold}</div>
                  <div className="text-gray-400 text-sm">Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{userStats.created}</div>
                  <div className="text-gray-400 text-sm">Created</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                Edit Profile
              </button>
              <button className="px-6 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300">
                Share Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="flex space-x-6 mb-8 border-b border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button className="pb-4 border-b-2 border-purple-500 text-purple-400 font-medium">
            Owned NFTs
          </button>
          <button className="pb-4 text-gray-400 hover:text-white transition-colors">
            Created
          </button>
          <button className="pb-4 text-gray-400 hover:text-white transition-colors">
            Activity
          </button>
          <button className="pb-4 text-gray-400 hover:text-white transition-colors">
            Favorites
          </button>
        </motion.div>

        {/* Owned NFTs Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {ownedNFTs.map((nft) => (
            <motion.div
              key={nft.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: nft.id * 0.1 }}
            >
              <img 
                src={nft.image} 
                alt={nft.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h3 className="font-semibold mb-1">{nft.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{nft.collection}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-bold">{nft.price}</span>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    Sell
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all duration-300">
            Load More NFTs
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
