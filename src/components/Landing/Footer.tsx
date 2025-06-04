import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

const Footer = () => {
  const controls = useAnimation();
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: true, amount: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
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
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        duration: 1.2,
      },
    },
  };

  // Simplified floating effect
  const floatingVariants = {
    animate: {
      y: [-5, 5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
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
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/pattern_2-C7NG-XLf_atgy9c.png')] bg-repeat opacity-15"></div>
      </div>

      {/* Ambient lighting */}
      <motion.div 
        className="absolute -left-24 top-20 w-80 h-80 rounded-full bg-gradient-to-r from-[#c2a792] to-[#d8bca6] opacity-3 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-16 top-40 w-96 h-96 rounded-full bg-gradient-to-l from-[#e8d0b3] to-[#f2e4c7] opacity-2 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '3s' }}
      />

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
              
              <p className="text-[#e8f0eb] font-light leading-relaxed mb-6 max-w-sm">
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
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                variants={itemVariants}
                className="space-y-4"
              >
                <h3 className="text-[#e8f0eb] font-medium text-lg capitalize">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-[#c8d4cc] hover:text-[#e8f0eb] transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter section */}
          <motion.div
            className="mt-16 pt-8 border-t border-white/10"
            variants={itemVariants}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-[#e8f0eb] text-xl font-medium mb-4">
                Subscribe to our newsletter
              </h3>
              <p className="text-[#c8d4cc] mb-6">
                Stay updated with the latest artworks and exclusive offers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-[#e8f0eb] 
                           placeholder-[#c8d4cc] focus:outline-none focus:border-[#c2a792] 
                           transition-colors duration-300 flex-1 max-w-md"
                />
                <motion.button
                  className="px-8 py-3 bg-[#c2a792] text-white rounded-full font-medium 
                           hover:bg-[#d8bca6] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="mt-12 text-center text-[#c8d4cc] text-sm"
            variants={itemVariants}
          >
            <p>© 2024 Smart Market. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;