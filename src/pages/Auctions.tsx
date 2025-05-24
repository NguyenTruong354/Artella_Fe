import React from 'react';
import { motion } from 'framer-motion';

const Auctions: React.FC = () => {
  const liveAuctions = [
    {
      id: 1,
      title: "Digital Dreams Collection",
      artist: "CryptoArtist",
      currentBid: "5.2 ETH",
      timeLeft: "2h 45m",
      image: "/src/assets/background_1.jpg",
      bidders: 23
    },
    {
      id: 2,
      title: "Abstract Reality",
      artist: "DigitalPicasso",
      currentBid: "3.8 ETH",
      timeLeft: "1h 12m",
      image: "/src/assets/background_2.jpg",
      bidders: 18
    },
    {
      id: 3,
      title: "Blockchain Starry Night",
      artist: "NFTMaster",
      currentBid: "7.1 ETH",
      timeLeft: "4h 33m",
      image: "/src/assets/background_3.jpg",
      bidders: 41
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
            Live Auctions
          </h1>
          <p className="text-xl text-gray-600">
            Participate in live bidding for exclusive digital artworks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {liveAuctions.map((auction) => (
            <motion.div
              key={auction.id}
              className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-200/50 hover:border-amber-400/50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: auction.id * 0.1 }}
            >
              <div className="relative">
                <img 
                  src={auction.image} 
                  alt={auction.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                  {auction.timeLeft} left
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{auction.title}</h3>
                <p className="text-gray-600 mb-4">by {auction.artist}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Current Bid</p>
                    <p className="text-2xl font-bold text-amber-600">{auction.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Bidders</p>
                    <p className="text-lg font-semibold">{auction.bidders}</p>
                  </div>
                </div>
                
                <motion.button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Place Bid
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
            View All Auctions
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auctions;
