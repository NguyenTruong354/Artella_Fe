import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const ServiceSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
        duration: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 60, 
      opacity: 0,
      scale: 0.9,
      rotateX: 15
    },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: i * 0.3,
        duration: 1.2,
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        duration: 1.5,
        ease: "easeOut"
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brushStrokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 1, delay: 0.5 }
      }
    }
  };
  const services = [
    {
      icon: "/src/assets/icon_1.png",
      title: "Atelier Collection",
      subtitle: "Curated Masterpieces",
      description: "Discover authentic artworks with NFT provenance — each piece a window into the artist's soul, preserved eternally on blockchain.",
      buttonText: "Enter Gallery",
      bgColor: "from-[#e2eff7] to-[#f0f7ff]",
      hoverColor: "border-[#a9c1d9]",
      textColor: "text-[#3a5269]",
      hue: "hue-rotate(190deg)",
      rotation: "rotate-45"
    },
    {
      icon: "/src/assets/icon_2.png", 
      title: "Auction House",
      subtitle: "Live Auction Experience",
      description: "Immerse in the theatrical dance of live bidding — where passion meets art in moments of breathtaking anticipation.",
      buttonText: "Join Auction",
      bgColor: "from-[#f7efd9] to-[#fff8e7]",
      hoverColor: "border-[#d3c49a]",
      textColor: "text-[#6c6344]",
      hue: "hue-rotate(45deg)",
      rotation: "rotate-[30deg]"
    },
    {
      icon: "/src/assets/icon_3.png",
      title: "Heritage Exchange",
      subtitle: "Provenance & Legacy",
      description: "Transfer art with its complete story — each transaction a new chapter in the artwork's immortal journey through time.",
      buttonText: "Explore Legacy",
      bgColor: "from-[#f7e5e5] to-[#fff0f0]",
      hoverColor: "border-[#d9a9a9]", 
      textColor: "text-[#8e5a5a]",
      hue: "hue-rotate(320deg)",
      rotation: "rotate-[150deg]"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-8 md:py-12 relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-40"></div>
      </div>

      {/* Floating artistic elements */}
      <motion.div 
        className="absolute -left-16 top-32 w-64 h-64 rounded-full bg-gradient-to-r from-[#e8d0b3] to-[#f2e4c7] opacity-15 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-16 bottom-32 w-80 h-80 rounded-full bg-gradient-to-l from-[#d4e1f7] to-[#e8f2ff] opacity-20 blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute left-1/4 top-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#f7e8d4] to-[#fff5e6] opacity-15 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />

      {/* Decorative brush strokes */}
      <svg className="absolute top-20 right-20 w-32 h-32 opacity-20" viewBox="0 0 100 100">
        <motion.path
          d="M10,80 Q30,10 80,20 Q90,30 70,90"
          stroke="#c2a792"
          strokeWidth="3"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>
      
      <svg className="absolute bottom-32 left-16 w-24 h-24 opacity-15" viewBox="0 0 100 100">
        <motion.path
          d="M20,20 Q50,80 80,30 Q90,40 60,80"
          stroke="#8e5a5a"
          strokeWidth="2"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced header section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block">            <motion.h2
              className="text-4xl md:text-6xl font-serif text-[#46594f] relative z-10 tracking-wider mb-2"
              initial="hidden"
              animate={controls}
              variants={titleVariants}
              style={{ 
                textShadow: "2px 2px 6px rgba(0,0,0,0.1)",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '0.02em'
              }}
            >
              Our Services
            </motion.h2>
            
            {/* Artistic underline */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.5, delay: 0.8 } }
              }}
            />
          </div>
            <motion.p
            className="text-lg md:text-xl font-light italic text-[#6d7f75] mt-6 max-w-2xl mx-auto leading-relaxed"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 1.2, delay: 1 } 
              }
            }}
          >
            "Where artistic expression merges with blockchain innovation"
            <br />
            <span className="text-base text-[#8a9690] not-italic mt-2 block">
              Bridging traditional art with digital transformation
            </span>
          </motion.p>
        </div>
        
        {/* Enhanced services grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 text-center 
                        border-2 border-[#e2d6c3] hover:border-opacity-80 transition-all duration-700 
                        group relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                        transform-gpu perspective-1000"
              variants={itemVariants}
              custom={index}
              whileHover={{
                y: -12,
                rotateY: 2,
                rotateX: -2,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)`,
                backdropFilter: 'blur(20px)',
                border: `2px solid rgba(226, 214, 195, 0.6)`
              }}
            >
              {/* Canvas texture background */}
              <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-5"></div>
              
              {/* Dynamic background blend */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-60 transition-opacity duration-700 ease-in-out rounded-3xl`}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.7 }
                }}
              />
              
              {/* Artistic texture overlay */}
              <motion.div
                className={`absolute -bottom-16 -right-16 w-72 h-72 z-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700 ${service.rotation} transform`}
                whileHover={{
                  scale: 1.1,
                  rotate: index * 30,
                  transition: { duration: 1.2, ease: "easeOut" }
                }}
              >
                <img 
                  src="/src/assets/textxure_2.png" 
                  alt="Brush texture" 
                  className="w-full h-full object-cover" 
                  style={{ filter: `${service.hue} saturate(0.8) brightness(1.1)` }}
                />
              </motion.div>
              
              {/* Icon with enhanced animation */}
              <div className="flex justify-center relative mb-6">
                <motion.div
                  className="relative z-10"
                  whileHover={{
                    scale: 1.15,
                    rotate: 5,
                    filter: "brightness(1.2) contrast(1.1)",
                    transition: { duration: 0.5, type: "spring", stiffness: 200 },
                  }}
                >
                  <motion.div
                    className={`p-5 rounded-full bg-gradient-to-br ${service.bgColor} shadow-lg group-hover:shadow-xl transition-all duration-500`}
                    animate={{
                      boxShadow: [
                        "0 4px 20px rgba(0,0,0,0.1)",
                        "0 8px 30px rgba(0,0,0,0.15)", 
                        "0 4px 20px rgba(0,0,0,0.1)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <img 
                      src={service.icon}
                      alt={service.title}
                      className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    />
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Enhanced typography */}
              <div className="relative z-10 space-y-2 mb-6">
                <h3 className={`text-xl md:text-2xl font-serif ${service.textColor} group-hover:scale-105 transition-transform duration-500`}>
                  {service.title}
                </h3>
                <p className="text-sm font-medium text-[#8a9690] uppercase tracking-widest">
                  {service.subtitle}
                </p>
              </div>
              
              <p className="text-sm md:text-base font-light text-[#62737e] mb-8 relative z-10 max-w-xs mx-auto leading-relaxed">
                {service.description}
              </p>
              
              {/* Enhanced button */}
              <motion.button
                className="bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white px-8 py-3 
                          text-sm rounded-full font-medium shadow-lg hover:shadow-2xl relative z-10 
                          uppercase tracking-wider border border-white/20 overflow-hidden group/btn"
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 10px 30px rgba(194, 167, 146, 0.4)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <span className="relative z-10">{service.buttonText}</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Artistic footer element */}
        <motion.div 
          className="mt-16 relative"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 1.5, delay: 2 } 
            }
          }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block w-24 h-1 bg-gradient-to-r from-transparent via-[#c2a792] to-transparent rounded-full"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced atmospheric lighting */}
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-[#f0e6d8] via-[#f8ede3] to-transparent opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
};

export default ServiceSection;