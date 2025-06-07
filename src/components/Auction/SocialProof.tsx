import React from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface SocialProofProps {
  itemVariants: Variants;
  controls: AnimationControls;
}

const SocialProof: React.FC<SocialProofProps> = ({
  itemVariants,
  controls
}) => {
  const testimonials = [
    {
      text: "Best auction platform for discovering emerging artists!",
      author: "@artcollector2024"
    },
    {
      text: "The market insights here are invaluable for my investments.",
      author: "@cryptoinvestor"
    }
  ];

  return (
    <motion.aside
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          What Collectors Say
        </h3>
      </div>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              "{testimonial.text}"
            </p>
            <p className="text-xs text-gray-500">{testimonial.author}</p>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};

export default SocialProof;
