import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const FAQSection = () => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Simplified animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  // Simplified floating effect
  const floatingVariants = {
    animate: {
      y: [-5, 5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
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

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#f8ede3] to-[#f0e6d8] py-8 md:py-12 relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Simplified background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-30"></div>
      </div>

      {/* Reduced floating elements */}
      <motion.div 
        className="absolute -left-20 top-40 w-72 h-72 rounded-full bg-gradient-to-r from-[#e8d0b3] to-[#f2e4c7] opacity-12 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-12 bottom-20 w-96 h-96 rounded-full bg-gradient-to-l from-[#d4e1f7] to-[#e8f2ff] opacity-15 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        {/* Header section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="relative inline-block">
            <motion.h2
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
            
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 0.8 } }
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
                transition: { duration: 0.8 } 
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
        
        {/* FAQ list */}
        <motion.div
          className="space-y-4 md:space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-[#e2d6c3]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{faq.icon}</span>
                  <h3 className="text-lg md:text-xl font-medium text-[#46594f]">
                    {faq.question}
                  </h3>
                </div>
                <motion.span
                  animate={{ rotate: openFAQ === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#8a9690]"
                >
                  ▼
                </motion.span>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openFAQ === index ? "auto" : 0,
                  opacity: openFAQ === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-4 text-[#62737e] leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;