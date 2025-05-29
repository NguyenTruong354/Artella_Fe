import { motion } from "framer-motion";
import PartnersBanner from "./PartnersBanner";

const AboutSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full bg-[#F8F1E9] flex flex-col">
      {/* Banner đặt ở đầu section */}
      <div className="pt-6">
        <PartnersBanner />
      </div>
      <div className="absolute top-1/2 right-80 transform translate-x-1/2 -translate-y-1/2 max-w-xs md:max-w-sm text-center" style={{ fontFamily: 'Segoe Print' }}>
        <h1 className="text-4xl md:text-4xl font-bold text-gray-800">
          Where Art Meets Technology
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4">
          Artella is a smart digital marketplace where art comes to life through technology. We connect artists, collectors, and enthusiasts in a space where creativity, ownership, and emotion are valued — powered by blockchain innovation. Discover, bid, and own art that speaks to your soul.
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="container mx-auto px-6 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        ></motion.div>
      </div>
      {/* Hình trang trí góc dưới bên trái */}
      <img
        src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png"
        alt="decoration"
        className="absolute bottom-0 left-0 w-[700px] h-[450px] object-cover opacity-70 pointer-events-none select-none z-0 -translate-y-5 -translate-x-40"
        draggable="false"
      />
      <img
        src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/Tuong_1_ki5uhx.png"
        alt="overlay decoration"
        className="absolute bottom-0 left-0 w-[300px] md:w-[400px] object-cover opacity-80 pointer-events-none select-none z-10 -translate-y-28 translate-x-20"
        draggable="false"
      />
    </section>
  );
};

export default AboutSection;
