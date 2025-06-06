import { motion } from "framer-motion";

const ServiceSection = () => {
  const services = [
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527208/icon_1_p0wx61.png",
      title: "Atelier Collection",
      subtitle: "Curated Masterpieces",
      description: "Discover authentic artworks with NFT provenance — each piece a window into the artist's soul, preserved eternally on blockchain.",
      buttonText: "Enter Gallery",
      bgColor: "from-[#e2eff7] to-[#f0f7ff]",
      textColor: "text-[#3a5269]",
    },
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527209/icon_2_e5hotf.png", 
      title: "Auction House",
      subtitle: "Live Auction Experience",
      description: "Immerse in the theatrical dance of live bidding — where passion meets art in moments of breathtaking anticipation.",
      buttonText: "Join Auction",
      bgColor: "from-[#f7efd9] to-[#fff8e7]",
      textColor: "text-[#6c6344]",
    },
    {
      icon: "https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527213/icon_3_nhggmt.webp",
      title: "Heritage Exchange",
      subtitle: "Provenance & Legacy",
      description: "Transfer art with its complete story — each transaction a new chapter in the artwork's immortal journey through time.",
      buttonText: "Explore Legacy",
      bgColor: "from-[#f7e5e5] to-[#fff0f0]",
      textColor: "text-[#8e5a5a]",
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-8 md:py-12 relative overflow-hidden min-h-screen flex items-center">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-40"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-serif text-[#46594f] relative z-10 tracking-wider mb-2"
                style={{ 
                  textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                  fontFamily: "'Playfair Display', serif",
                  letterSpacing: '0.02em'
                }}>
              Our Services
            </h2>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full" />
          </div>
          <p className="text-lg md:text-xl font-light italic text-[#6d7f75] mt-6 max-w-2xl mx-auto leading-relaxed">
            "Where artistic expression merges with blockchain innovation"
            <br />
            <span className="text-base text-[#8a9690] not-italic mt-2 block">
              Bridging traditional art with digital transformation
            </span>
          </p>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 text-center 
                        border-2 border-[#e2d6c3] relative overflow-hidden shadow-lg
                        group transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
                            translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out" />

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
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;