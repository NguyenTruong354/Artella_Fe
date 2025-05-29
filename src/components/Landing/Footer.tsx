import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const Footer = () => {  const controls = useAnimation();
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: false, amount: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  // Animation variants
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
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8,
      },
    }),
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        duration: 1.2,
        ease: "easeOut"
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-6, 6, -6],
      x: [-3, 3, -3],
      rotate: [-1, 1, -1],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brushStrokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.4,
      transition: {
        pathLength: { duration: 3, ease: "easeInOut" },
        opacity: { duration: 1.5, delay: 0.5 }
      }
    }
  };

  const footerLinks = {
    explore: [
      { name: "Browse Gallery", href: "#gallery" },
      { name: "Featured Artists", href: "#artists" },
      { name: "New Arrivals", href: "#new" },
      { name: "Live Auctions", href: "#auctions" }
    ],
    services: [
      { name: "Atelier Collection", href: "#collection" },
      { name: "Auction House", href: "#auction" },
      { name: "Heritage Exchange", href: "#exchange" },
      { name: "NFT Certification", href: "#nft" }
    ],
    support: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#faq" },
      { name: "Community", href: "#community" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Legal Notice", href: "#legal" }
    ]
  };

  const socialLinks = [
    { name: "Instagram", icon: "📷", href: "#instagram" },
    { name: "Twitter", icon: "🐦", href: "#twitter" },
    { name: "Discord", icon: "💬", href: "#discord" },
    { name: "LinkedIn", icon: "💼", href: "#linkedin" }
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-t from-[#2a3b2e] via-[#3a4f42] to-[#46594f] relative overflow-hidden"
    >
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-40"></div>
      </div>

      {/* Floating artistic elements */}
      <motion.div 
        className="absolute -left-24 top-20 w-80 h-80 rounded-full bg-gradient-to-r from-[#c2a792] to-[#d8bca6] opacity-8 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-16 top-40 w-96 h-96 rounded-full bg-gradient-to-l from-[#e8d0b3] to-[#f2e4c7] opacity-6 blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute left-1/3 bottom-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#f7e8d4] to-[#fff5e6] opacity-5 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '4s' }}
      />

      {/* Decorative brush strokes */}
      <svg className="absolute top-16 right-20 w-48 h-48 opacity-10" viewBox="0 0 100 100">
        <motion.path
          d="M10,80 Q30,10 80,20 Q90,30 70,90"
          stroke="#c2a792"
          strokeWidth="2"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>
      
      <svg className="absolute bottom-32 left-12 w-32 h-32 opacity-8" viewBox="0 0 100 100">
        <motion.path
          d="M20,20 Q50,80 80,30 Q90,40 60,80"
          stroke="#8e5a5a"
          strokeWidth="1.5"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <motion.div
          className="pt-16 pb-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Logo and description section */}
            <motion.div
              className="lg:col-span-2"
              variants={itemVariants}
              custom={0}
            >
              <motion.div
                className="mb-6"
                variants={logoVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <img 
                  src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png" 
                  alt="Smart Market"
                  className="h-12 md:h-16 w-auto brightness-0 invert opacity-90"
                />
              </motion.div>
              
              <p className="text-[#c8d4cc] font-light leading-relaxed mb-6 max-w-sm">
                Where artistic expression merges with blockchain innovation. 
                Discover, collect, and trade authenticated digital art in our immersive marketplace.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center 
                              text-lg hover:bg-white/20 transition-all duration-300 group border border-white/10"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderColor: "rgba(194, 167, 146, 0.5)",
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                    custom={index + 1}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={itemVariants}
              custom={1}
            >
              <h3 className="text-white font-serif text-xl mb-6 relative">
                Explore
                <motion.div
                  className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#c2a792] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={controls}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 1, delay: 1.5 } }
                  }}
                />
              </h3>
              <ul className="space-y-3">
                {footerLinks.explore.map((link, index) => (
                  <motion.li
                    key={link.name}
                    variants={itemVariants}
                    custom={index + 2}
                  >
                    <motion.a
                      href={link.href}
                      className="text-[#b8c5bc] hover:text-[#c2a792] transition-colors duration-300 
                                text-sm font-light block py-1"
                      whileHover={{
                        x: 5,
                        color: "#c2a792",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              variants={itemVariants}
              custom={2}
            >
              <h3 className="text-white font-serif text-xl mb-6 relative">
                Services
                <motion.div
                  className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#c2a792] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={controls}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 1, delay: 1.7 } }
                  }}
                />
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <motion.li
                    key={link.name}
                    variants={itemVariants}
                    custom={index + 3}
                  >
                    <motion.a
                      href={link.href}
                      className="text-[#b8c5bc] hover:text-[#c2a792] transition-colors duration-300 
                                text-sm font-light block py-1"
                      whileHover={{
                        x: 5,
                        color: "#c2a792",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              variants={itemVariants}
              custom={3}
            >
              <h3 className="text-white font-serif text-xl mb-6 relative">
                Support
                <motion.div
                  className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#c2a792] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={controls}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 1, delay: 1.9 } }
                  }}
                />
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <motion.li
                    key={link.name}
                    variants={itemVariants}
                    custom={index + 4}
                  >
                    <motion.a
                      href={link.href}
                      className="text-[#b8c5bc] hover:text-[#c2a792] transition-colors duration-300 
                                text-sm font-light block py-1"
                      whileHover={{
                        x: 5,
                        color: "#c2a792",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              variants={itemVariants}
              custom={4}
            >
              <h3 className="text-white font-serif text-xl mb-6 relative">
                Legal
                <motion.div
                  className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#c2a792] to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={controls}
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: { scaleX: 1, transition: { duration: 1, delay: 2.1 } }
                  }}
                />
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <motion.li
                    key={link.name}
                    variants={itemVariants}
                    custom={index + 5}
                  >
                    <motion.a
                      href={link.href}
                      className="text-[#b8c5bc] hover:text-[#c2a792] transition-colors duration-300 
                                text-sm font-light block py-1"
                      whileHover={{
                        x: 5,
                        color: "#c2a792",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter section */}
          <motion.div
            className="mt-16 pt-8 border-t border-white/10"
            variants={itemVariants}
            custom={6}
          >
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-white font-serif text-2xl mb-4">
                Stay Connected
              </h3>
              <p className="text-[#b8c5bc] font-light mb-6 leading-relaxed">
                Subscribe to our newsletter for exclusive art drops, auction alerts, and blockchain insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
                            rounded-full text-white placeholder-[#b8c5bc] focus:outline-none focus:border-[#c2a792] 
                            focus:bg-white/15 transition-all duration-300"
                  whileFocus={{
                    borderColor: "#c2a792",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    transition: { duration: 0.3 }
                  }}
                />
                <motion.button
                  className="bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                            px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl 
                            uppercase tracking-wider text-sm border border-white/20 overflow-hidden group/subscribe"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(194, 167, 146, 0.4)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 
                              group-hover/subscribe:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">Subscribe</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="py-6 border-t border-white/10"
          variants={itemVariants}
          custom={7}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              className="text-[#b8c5bc] text-sm font-light"
              variants={itemVariants}
              custom={8}
            >
              © 2024 Smart Market. All rights reserved. Built with passion for digital art.
            </motion.p>
            
            <motion.div
              className="flex items-center space-x-6"
              variants={itemVariants}
              custom={9}
            >
              <span className="text-[#b8c5bc] text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <span className="text-[#c2a792] font-medium text-sm">Blockchain</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎨</span>
                <span className="text-[#c2a792] font-medium text-sm">NFT</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced atmospheric lighting */}
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tl from-[#c2a792] 
                   via-[#d8bca6] to-transparent opacity-5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#e8d0b3] 
                   to-[#f2e4c7] opacity-4 blur-3xl"
        animate={{
          x: [-30, 30, -30],
          y: [-15, 15, -15],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </footer>
  );
};

export default Footer;