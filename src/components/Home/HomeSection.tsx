import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

const HomeSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Featured artworks data
  const featuredArtworks = [
    {
      id: 1,
      title: "Digital Dreams",
      artist: "Artist NFT",
      price: "2.5 ETH",
      image: "/src/assets/background_1.jpg",
      isLive: true
    },
    {
      id: 2,
      title: "Abstract Reality",
      artist: "CryptoArt Master",
      price: "1.8 ETH", 
      image: "/src/assets/background_2.jpg",
      isLive: false
    },
    {
      id: 3,
      title: "Starry Blockchain",
      artist: "Digital Picasso",
      price: "3.2 ETH",
      image: "/src/assets/background_3.jpg",
      isLive: true
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // MetaMask connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setConnectedWallet(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet');
    }
  };
  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[#F8F1E9] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-10"></div>
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-amber-200/30 to-orange-200/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gradient-to-l from-yellow-200/30 to-amber-200/30 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.div className="space-y-4">              <motion.div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100/50 to-orange-100/50 border border-amber-300/30"
                variants={itemVariants}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-amber-700 text-sm font-medium">Live Blockchain Network</span>
              </motion.div>
                <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-gray-800 leading-tight"
                variants={itemVariants}
              >
                Digital Art
                <br />
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Marketplace
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                Discover, collect, and trade unique digital artworks on the blockchain. 
                Connect your wallet and join the future of art ownership.
              </motion.p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >              <motion.button
                onClick={connectWallet}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {connectedWallet ? (
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                ) : (
                  "Connect Wallet"
                )}
              </motion.button>
              
              <Link to="/gallery">
                <motion.button
                  className="px-8 py-4 border-2 border-amber-600 text-amber-700 font-semibold rounded-xl hover:bg-amber-100/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Gallery
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-400"
              variants={itemVariants}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">12.5K+</div>
                <div className="text-gray-600 text-sm">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">8.2K+</div>
                <div className="text-gray-600 text-sm">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">95.6K+</div>
                <div className="text-gray-600 text-sm">Collectors</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Featured Artworks */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-8"
              variants={itemVariants}
            >
              Featured Collections
            </motion.h2>
            
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >              {featuredArtworks.map((artwork) => (                <motion.div
                  key={artwork.id}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50 hover:border-orange-400/50 transition-all duration-300 shadow-lg"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      {artwork.isLive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                      <div className="flex-1">
                      <h3 className="text-gray-800 font-semibold">{artwork.title}</h3>
                      <p className="text-gray-600 text-sm">{artwork.artist}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-amber-600 font-bold">{artwork.price}</div>
                      {artwork.isLive && (
                        <div className="text-red-500 text-xs font-medium">LIVE AUCTION</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center pt-6"
              variants={itemVariants}
            >              <Link to="/gallery">
                <motion.button
                  className="text-amber-600 font-medium hover:text-orange-600 transition-colors duration-300"
                  whileHover={{ x: 10 }}
                >
                  View All Collections →
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-4 h-4 bg-amber-400 rounded-full opacity-60"
        animate={{
          y: [-20, 20, -20],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-orange-400 rounded-full opacity-40"
        animate={{
          y: [20, -20, 20],
          x: [-10, 10, -10],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
};

export default HomeSection;
