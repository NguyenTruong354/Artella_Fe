import { motion } from "framer-motion";
import GridGalleryRectangle from "./GridGalleryRectangle";
import CountdownTimer from "./CountdownTimer";
import { GridItem } from "./types";

const PricingSection: React.FC = () => {
  // Tạo 24 items cho grid 4x6 - không có text
  const pricingItems: GridItem[] = [
    // Row 1
    { id: "", area: "item-1", animationType: "fade", animationDelay: 0 },
    { id: "", area: "item-2", animationType: "zoom", animationDelay: 0.1 },
    { id: "", area: "item-3", animationType: "fade", animationDelay: 0.2 },
    { id: "", area: "item-4", animationType: "zoom", animationDelay: 0.3 },
    { id: "", area: "item-5", animationType: "fade", animationDelay: 0.4 },
    { id: "", area: "item-6", animationType: "zoom", animationDelay: 0.5 },

    // Row 2
    { id: "", area: "item-7", animationType: "fade", animationDelay: 0.6 },
    { id: "", area: "item-8", animationType: "zoom", animationDelay: 0.7 },
    { id: "", area: "item-9", animationType: "fade", animationDelay: 0.8 },
    { id: "", area: "item-10", animationType: "zoom", animationDelay: 0.9 },
    { id: "", area: "item-11", animationType: "fade", animationDelay: 1.0 },
    { id: "", area: "item-12", animationType: "zoom", animationDelay: 1.1 },

    // Row 3
    { id: "", area: "item-13", animationType: "fade", animationDelay: 1.2 },
    { id: "", area: "item-14", animationType: "zoom", animationDelay: 1.3 },
    { id: "", area: "item-15", animationType: "fade", animationDelay: 1.4 },
    { id: "", area: "item-16", animationType: "zoom", animationDelay: 1.5 },
    { id: "", area: "item-17", animationType: "fade", animationDelay: 1.6 },
    { id: "", area: "item-18", animationType: "zoom", animationDelay: 1.7 },

    // Row 4
    { id: "", area: "item-19", animationType: "fade", animationDelay: 1.8 },
    { id: "", area: "item-20", animationType: "zoom", animationDelay: 1.9 },
    { id: "", area: "item-21", animationType: "fade", animationDelay: 2.0 },
    { id: "", area: "item-22", animationType: "zoom", animationDelay: 2.1 },
    { id: "", area: "item-23", animationType: "fade", animationDelay: 2.2 },
    { id: "", area: "item-24", animationType: "zoom", animationDelay: 2.3 },
  ];

  // Animation variants cho toàn bộ section
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#F8F1E9] via-[#F5EDE3] to-[#F2E8DC] flex flex-col justify-center py-4 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Texture overlay */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#c2a792]/20 to-[#d8bca6]/20"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-32 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#d8bca6]/30 to-[#c2a792]/30"
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center justify-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Content Section - Title, Description & Countdown at the top */}
        <motion.div
          className="text-center relative z-20 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-3 relative z-30"
            variants={titleVariants}
            style={{ fontFamily: "Segoe Print, cursive" }}
          >
            Unlock the Experience –{" "}
            <span className="text-[#c2a792]">NFT Art Like Never Before</span>
          </motion.h2>
          <motion.p
            className="text-sm md:text-base text-gray-600 max-w-xl mx-auto font-light relative z-30"
            variants={subtitleVariants}
            style={{ fontFamily: "Segoe Print, cursive" }}
          >
            Join an exclusive digital art exhibition. Limited tickets available
            — step into blockchain art.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="w-12 h-0.5 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] mx-auto mt-2 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />

          {/* Countdown Timer */}
          <CountdownTimer />
        </motion.div>

        {/* GridGalleryRectangle Component - Positioned at the bottom */}
        <motion.div
          className="flex justify-center items-center relative z-10 mt-4 w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 0.85 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <GridGalleryRectangle
            items={pricingItems}
            backgroundColor="#F8F1E9"
            imageUrl="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/Room_qyc47f.png"
            isTemplateChanging={false}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PricingSection;