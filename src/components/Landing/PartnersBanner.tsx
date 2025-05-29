import { motion } from 'framer-motion';
import React from 'react';

// Dữ liệu các đối tác
const partners = [
  {
    name: "Hardhat",
    logo: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png" // Thay thế bằng logo thật sau
  },
  {
    name: "MetaMask",
    logo: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png" // Thay thế bằng logo thật sau
  },
  {
    name: "Artella",
    logo: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png" // Thay thế bằng logo thật sau
  },
  {
    name: "Binance",
    logo: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png" // Thay thế bằng logo thật sau
  }
];

// Clone mảng để tạo hiệu ứng vô hạn
const allPartners = [...partners, ...partners, ...partners];

const PartnersBanner: React.FC = () => {
  return (
    <div className="relative h-20 w-full overflow-hidden bg-[#F8F1E9]">
      <div className="absolute top-0 left-0 w-full h-full transform rotate-3 origin-center">
        <motion.div 
          className="absolute flex items-center space-x-16 px-4 py-2 will-change-transform h-full"
          animate={{ 
            x: [0, -2000]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {allPartners.map((partner, index) => (
            <div key={`${partner.name}-${index}`} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <img src={partner.logo} alt={`${partner.name} logo`} className="h-6 w-6 object-contain" />
              </div>
              <span className="text-sm font-medium text-gray-800">{partner.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersBanner;
