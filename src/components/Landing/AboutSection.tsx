import { motion } from "framer-motion";
import PartnersBanner from "./PartnersBanner";

const AboutSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F8F1E9] flex flex-col">
      {/* Banner đặt ở đầu section */}
      <div className="pt-6">
        <PartnersBanner />
      </div>

      {/* Container chính cho nội dung */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-12 relative z-20 mt-16">
        {/* Phần hình ảnh bên trái */}
        <motion.div 
          className="w-full md:w-1/2 relative h-[300px] md:h-[500px]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          {/* Texture background */}
          <img
            src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png"
            alt="decoration"
            className="absolute bottom-0 left-0 w-[400px] h-[300px] md:w-[500px] md:h-[400px] object-cover opacity-70 select-none"
            draggable="false"
          />
          {/* Tượng overlay */}
          <img
            src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/Tuong_1_ki5uhx.png"
            alt="overlay decoration"
            className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] md:w-[400px] object-contain select-none
              translate-y-0 translate-x-0
              sm:translate-y-[-2rem] sm:translate-x-[1rem]
              md:translate-y-[-4rem] md:translate-x-[2rem]
              lg:translate-y-[-7rem] lg:translate-x-[5rem]"
            draggable="false"
          />
        </motion.div>

        {/* Phần text bên phải */}
        <motion.div 
          className="w-full md:w-1/2 text-center px-4 md:px-8 lg:px-12 mt-8 md:mt-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontFamily: 'Segoe Print' }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
            Where Art Meets Technology
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed text-center">
            Artella is a smart digital marketplace where art comes to life through technology. We connect artists, collectors, and enthusiasts in a space where creativity, ownership, and emotion are valued — powered by blockchain innovation. Discover, bid, and own art that speaks to your soul.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

