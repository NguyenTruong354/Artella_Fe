import React from 'react';
import { motion, Variants, AnimationControls } from 'framer-motion';
import { Mail } from 'lucide-react';

interface NewsletterSignupProps {
  onToggleNewsletter: () => void;
  itemVariants: Variants;
  controls: AnimationControls;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onToggleNewsletter,
  itemVariants,
  controls
}) => {
  return (
    <motion.aside
      className="bg-gradient-to-br from-red-500/10 to-pink-500/10 dark:from-amber-500/10 dark:to-orange-500/10 backdrop-blur-xl rounded-xl p-6 border border-red-200/50 dark:border-amber-200/20"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          Auction Alerts
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get notified about hot auctions, market trends, and
          exclusive previews.
        </p>
        <motion.button
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 dark:from-amber-500 dark:to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          onClick={onToggleNewsletter}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Subscribe Now
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default NewsletterSignup;
