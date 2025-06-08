import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

const initialBorderRadius = "60% 40% 70% 30% / 50% 70% 30% 50%";
const hoverBorderRadius = "40% 60% 50% 50% / 70% 40% 60% 30%";

interface Service {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const mouseXInCard = event.clientX - rect.left;
      const mouseYInCard = event.clientY - rect.top;
      const cardCenterX = rect.width / 2;
      const cardCenterY = rect.height / 2;
      const deltaX = mouseXInCard - cardCenterX;
      const deltaY = mouseYInCard - cardCenterY;
      x.set(deltaX * 0.08); // Adjust multiplier for sensitivity
      y.set(deltaY * 0.08); // Adjust multiplier for sensitivity
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="bg-white/70 backdrop-blur-md p-8 text-center 
                border-2 border-[#e2d6c3] relative overflow-hidden shadow-lg group"
      initial={{ opacity: 0, y: 20, borderRadius: initialBorderRadius }}
      animate={{ borderRadius: initialBorderRadius }} // Default non-hover state
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.2,
        borderRadius: { duration: 0.4, ease: "circOut" }
      }}
      style={{
        translateX: springX,
        translateY: springY,
      }}
      whileHover={{ 
        borderRadius: hoverBorderRadius,
        // scale: 1.02, // Optional: slight scale up
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background color overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${service.bgColor} 
                    translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out`} />
      
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out delay-200" />
      {/* Icon */}
      <div className="flex justify-center relative mb-6">
        <motion.div 
          className="relative z-10"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
        >
          <div className={`p-5 rounded-full bg-gradient-to-br ${service.bgColor} shadow-lg 
                        group-hover:shadow-xl transition-all duration-300`}>
            <img 
              src={service.icon}
              alt={service.title}
              className="w-16 h-16 md:w-20 md:h-20 object-contain transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </motion.div>
      </div>
      {/* Content */}
      <div className="relative z-10 space-y-2 mb-6">
        <motion.h3 
          className={`text-xl md:text-2xl font-serif ${service.textColor}`}
        >
          {service.title}
        </motion.h3>
        <motion.p 
          className="text-sm font-medium text-[#8a9690] uppercase tracking-widest"
        >
          {service.subtitle}
        </motion.p>
      </div>
      
      <p className="text-sm md:text-base font-light text-[#62737e] mb-8 relative z-10 max-w-xs mx-auto leading-relaxed">
        {service.description}
      </p>
      {/* Button */}
      <motion.button
        className="bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white px-8 py-3 
                  text-sm rounded-full font-medium shadow-lg relative z-10 
                  uppercase tracking-wider border border-white/20
                  hover:shadow-xl hover:from-[#d8bca6] hover:to-[#c2a792] transition-all duration-300"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 10px 20px rgba(194, 167, 146, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {service.buttonText}
      </motion.button>
    </motion.div>
  );
};

export default ServiceCard;
