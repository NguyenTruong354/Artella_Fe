import { memo } from "react";
import { motion } from "framer-motion";

// Skeleton loading component
export const SkeletonCard = memo(() => (
  <div className="animate-pulse backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70">
    <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800"></div>
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
      </div>
      <div className="flex gap-1">
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
    </div>
  </div>
));

// Fallback component for loading states
export const ComponentFallback = memo(() => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg w-full h-8"></div>
));

// Loading More Component for infinite scroll
export const LoadingMore = memo(() => (
  <motion.div
    className="flex items-center justify-center py-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-3 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        Loading more artworks...
      </span>
    </div>
  </motion.div>
));
