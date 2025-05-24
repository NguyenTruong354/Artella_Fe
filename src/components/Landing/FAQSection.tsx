import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const FAQSection = () => {
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
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 40, 
      opacity: 0,
      scale: 0.95,
      rotateX: 10
    },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: i * 0.1,
        duration: 1,
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
      y: [-8, 8, -8],
      x: [-3, 3, -3],
      rotate: [-1, 1, -1],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brushStrokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.5,
      transition: {
        pathLength: { duration: 2.5, ease: "easeInOut" },
        opacity: { duration: 1, delay: 0.7 }
      }
    }
  };
  const faqData = [
    {
      question: "How do you guarantee the authenticity of artworks?",
      answer: "Each artwork is authenticated by certified experts and linked to a unique NFT on the blockchain. This technology allows us to create an unalterable digital certificate of authenticity, tracking the complete history of the artwork from its creation.",
      icon: "🎨"
    },
    {
      question: "What are the fees associated with auctions?",
      answer: "Our auction fees are 12% for the buyer and 8% for the seller. These fees include authentication, NFT certification, insurance during transport and our premium customer service. No hidden fees are applied.",
      icon: "💰"
    },
    {
      question: "How does the live auction process work?",
      answer: "Our auctions take place in our immersive virtual salon. You can bid in real-time via our platform, with instant updates and a complete audiovisual experience. Each session is hosted by a professional auctioneer.",
      icon: "🏛️"
    },
    {
      question: "Can I sell my own artworks?",
      answer: "Absolutely! Our consignment process is simple. Submit your artworks for evaluation by our experts, who will determine their eligibility and estimated value. Once accepted, we handle the entire sales and NFT certification process.",
      icon: "🖼️"
    },
    {
      question: "How does blockchain secure my purchases?",
      answer: "Blockchain creates a permanent and transparent ownership record. Each transaction is cryptographically secured and cannot be modified. This ensures that your ownership is protected and the artwork's history is preserved for future generations.",
      icon: "🔒"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept traditional bank transfers, premium credit cards, as well as major cryptocurrencies (Bitcoin, Ethereum). All payments are secured and processed through certified financial partners.",
      icon: "💳"
    }
  ];

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-8 md:py-12 relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-30"></div>
      </div>

      {/* Floating artistic elements */}
      <motion.div 
        className="absolute -left-20 top-40 w-72 h-72 rounded-full bg-gradient-to-r from-[#e8d0b3] to-[#f2e4c7] opacity-12 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-12 bottom-20 w-96 h-96 rounded-full bg-gradient-to-l from-[#d4e1f7] to-[#e8f2ff] opacity-15 blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute left-1/3 top-20 w-56 h-56 rounded-full bg-gradient-to-br from-[#f7e8d4] to-[#fff5e6] opacity-10 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '3s' }}
      />

      {/* Decorative brush strokes */}
      <svg className="absolute top-32 right-16 w-40 h-40 opacity-15" viewBox="0 0 100 100">
        <motion.path
          d="M15,75 Q35,15 85,25 Q95,35 75,85"
          stroke="#c2a792"
          strokeWidth="2.5"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>
      
      <svg className="absolute bottom-40 left-20 w-28 h-28 opacity-12" viewBox="0 0 100 100">
        <motion.path
          d="M25,25 Q55,75 85,35 Q95,45 65,85"
          stroke="#8e5a5a"
          strokeWidth="2"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
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
              Frequently Asked Questions
            </motion.h2>
            
            {/* Artistic underline */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.5, delay: 0.8 } }
              }}
            />
          </div>
            <motion.p
            className="text-lg md:text-xl font-light italic text-[#6d7f75] mt-6 max-w-3xl mx-auto leading-relaxed"
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
            "Everything you need to know about our digital art gallery"
            <br />
            <span className="text-base text-[#8a9690] not-italic mt-2 block">
              Your guide to understanding our blockchain art marketplace
            </span>
          </motion.p>
        </div>
        
        {/* Enhanced FAQ list */}
        <motion.div
          className="space-y-4 md:space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white/75 backdrop-blur-md rounded-2xl border-2 border-[#e2d6c3] 
                        hover:border-opacity-90 transition-all duration-500 group relative overflow-hidden 
                        shadow-[0_8px_32px_rgba(0,0,0,0.06)] transform-gpu"
              variants={itemVariants}
              custom={index}
              whileHover={{
                y: -4,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{ 
                background: `linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 100%)`,
                backdropFilter: 'blur(15px)',
                border: `2px solid rgba(226, 214, 195, 0.7)`
              }}
            >
              {/* Canvas texture background */}
              <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-3"></div>
              
              {/* Question section */}
              <motion.button
                className="w-full text-left p-6 md:p-8 focus:outline-none relative z-10 group/btn"
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.002 }}
                whileTap={{ scale: 0.998 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <motion.div
                      className="text-2xl md:text-3xl p-3 rounded-full bg-gradient-to-br from-[#f7efd9] to-[#fff8e7] 
                                shadow-md group-hover/btn:shadow-lg transition-all duration-300"
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {faq.icon}
                    </motion.div>
                    
                    <h3 className="text-lg md:text-xl font-serif text-[#46594f] group-hover/btn:text-[#3a4a42] 
                                  transition-colors duration-300 flex-1 leading-relaxed">
                      {faq.question}
                    </h3>
                  </div>
                  
                  <motion.div
                    className="text-[#c2a792] text-2xl font-light ml-4"
                    animate={{ 
                      rotate: openFAQ === index ? 45 : 0,
                      scale: openFAQ === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    +
                  </motion.div>
                </div>
              </motion.button>
              
              {/* Answer section */}
              <motion.div
                initial={false}
                animate={{
                  height: openFAQ === index ? "auto" : 0,
                  opacity: openFAQ === index ? 1 : 0,
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeInOut",
                  opacity: { duration: 0.3, delay: openFAQ === index ? 0.1 : 0 }
                }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 relative z-10">
                  <motion.div
                    className="pl-16 md:pl-20"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{
                      y: openFAQ === index ? 0 : -10,
                      opacity: openFAQ === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, delay: openFAQ === index ? 0.2 : 0 }}
                  >
                    <div className="w-full h-px bg-gradient-to-r from-[#c2a792] via-transparent to-[#c2a792] mb-4 opacity-30"></div>
                    <p className="text-sm md:text-base font-light text-[#62737e] leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#f7efd9]/20 to-[#fff8e7]/20 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                whileHover={{ 
                  scale: 1.01,
                  transition: { duration: 0.5 }
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Contact section */}
        <motion.div 
          className="mt-16 text-center relative"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 1.5, delay: 2.5 } 
            }
          }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-2 border-[#e2d6c3] 
                         shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-5"></div>
              <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif text-[#46594f] mb-4">
                Have a specific question?
              </h3>
              <p className="text-base md:text-lg font-light text-[#6d7f75] mb-6 leading-relaxed">
                Our team of experts is available to answer all your questions about digital art and NFTs.
              </p>
              
              <motion.button
                className="bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                          px-8 py-4 text-sm rounded-full font-medium shadow-lg hover:shadow-2xl 
                          uppercase tracking-wider border border-white/20 overflow-hidden group/contact"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 35px rgba(194, 167, 146, 0.4)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 
                            group-hover/contact:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <span className="relative z-10">Contact Us</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Artistic footer element */}
        <motion.div 
          className="mt-12 relative"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 1.5, delay: 3 } 
            }
          }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block w-32 h-1 bg-gradient-to-r from-transparent via-[#c2a792] to-transparent rounded-full"
              animate={{
                scaleX: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced atmospheric lighting */}
      <motion.div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[#f0e6d8] 
                   via-[#f8ede3] to-transparent opacity-15 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-bl from-[#e8d0b3] 
                   to-[#f2e4c7] opacity-10 blur-3xl"
        animate={{
          x: [-20, 20, -20],
          y: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
};

export default FAQSection;