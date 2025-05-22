import { motion } from "framer-motion";
import GridGalleryRectangle from './GridGalleryRectangle';
import { GridItem } from './types';

const PricingSection: React.FC = () => {
  const items: GridItem[] = [
    { id: "Pricing Plan 1", area: "area-1" },
    { id: "Pricing Plan 2", area: "area-2" },
    { id: "Pricing Plan 3", area: "area-3" },
    { id: "Pricing Plan 4", area: "area-4" }
  ];

  return (
    <section className="relative h-screen w-full bg-[#F8F1E9] flex flex-col">
      <div className="py-12 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Pricing Plans
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Choose the perfect plan for your business needs
        </motion.p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <GridGalleryRectangle items={items} />
      </div>
    </section>
  );
};

export default PricingSection;