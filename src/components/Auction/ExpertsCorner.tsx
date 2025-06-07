import React from 'react';
import { motion, AnimationControls, Variants } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';

interface ExpertsCornerProps {
  itemVariants: Variants;
  controls: AnimationControls;
}

const ExpertsCorner: React.FC<ExpertsCornerProps> = ({
  itemVariants,
  controls
}) => {
  return (
    <motion.aside
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
          <Star className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Expert's Corner
        </h3>
      </div>
      <div className="space-y-4">
        <div className="border-l-4 border-purple-500 pl-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
            "The digital art market is experiencing unprecedented
            growth. I predict we'll see 300% increase in institutional
            investments this quarter."
          </p>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
              alt="Expert"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                Dr. Sarah Chen
              </p>
              <p className="text-xs text-gray-500">
                Art Market Analyst
              </p>
            </div>
          </div>
        </div>
        <motion.button
          className="w-full text-left text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center"
          whileHover={{ x: 5 }}
        >
          Read full analysis <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default ExpertsCorner;
