import { motion } from "framer-motion";

interface ArtCardProps {
  title: string;
  quote: string;
  imageUrl: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ArtCard({ title, quote, imageUrl, onPrev, onNext }: ArtCardProps) {
  return (
    <div className="relative w-[280px] md:w-[350px] h-[180px] md:h-[220px] rounded-lg overflow-hidden shadow-xl flex items-center justify-center mx-auto">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent bg-opacity-30" />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{title}</h2>
        <p className="text-base text-white drop-shadow-md">{quote}</p>
      </div>      {/* Navigation Controls Container - ensures buttons are always on top */}      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* Left Arrow */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg focus:outline-none pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation(); 
            if (onPrev) onPrev();
          }}
          aria-label="Previous"
          type="button"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        {/* Right Arrow */}        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg focus:outline-none pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện lan tỏa
            if (onNext) onNext();
          }}
          aria-label="Next"
          type="button"
        >        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
      </div>
    </div>
  );
}
