import { motion } from "framer-motion";
import PartnersBanner from "./PartnersBanner";

const AboutSection: React.FC = () => {
  return (
    <section className="h-screen w-full bg-[#F8F1E9] flex flex-col">
      {/* Banner đặt ở đầu section */}
      <div className="pt-6">
        <PartnersBanner />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <motion.div 
          className="container mx-auto px-6 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            About Us
          </motion.h2>
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-gray-700 text-lg md:text-xl text-center mb-8">
              We are a platform dedicated to bringing art and emotion together. Our mission is to help you discover, experience, and own art that speaks to your soul.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
