import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidContentWrapperProps {
  children: React.ReactNode;
  contentKey: string; // Key to trigger transitions when content changes
}

const liquidVariants = {
  initial: {
    opacity: 0,
    y: 20,
    // filter: 'blur(5px)', // Optional: blur effect for more "liquid" feel
  },
  animate: {
    opacity: 1,
    y: 0,
    // filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1], // Bezier curve for smooth, fluid-like motion
      // type: 'spring', // Alternative, can feel more "bouncy"
      // stiffness: 100,
      // damping: 20,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    // filter: 'blur(5px)',
    transition: {
      duration: 0.3,
      ease: [0.5, 0, 0.75, 0], // Different curve for exit
    },
  },
};

const LiquidContentWrapper: React.FC<LiquidContentWrapperProps> = ({ children, contentKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={contentKey}
        variants={liquidVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ position: 'relative' }} // Ensures smooth transition without layout jumps
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default LiquidContentWrapper;
