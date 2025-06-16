import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  ArrowUpRight,
  Zap,
  Bookmark,
  Download,
} from "lucide-react";
import { ArtworkItem } from "./types";
import SmartImage from "../SmartImage";

interface ArtworkCardProps {
  artwork: ArtworkItem;
  viewMode: "masonry" | "grid" | "list";
  likedItems: Set<number>;
  toggleLike: (id: number) => void;
}

export const ArtworkCard = memo(
  ({ artwork, viewMode, likedItems, toggleLike }: ArtworkCardProps) => {
    const isLiked = useMemo(
      () => likedItems.has(artwork.id),
      [likedItems, artwork.id]
    );

    // Generate dynamic heights for masonry effect based on content
    const masonryHeight = useMemo(() => {
      const baseHeight = 280;
      const heightVariations = [0, 80, 160, 240, 120, 200, 40, 100];
      const variation = heightVariations[artwork.id % heightVariations.length];
      return baseHeight + variation;
    }, [artwork.id]);

    return (
      <motion.div
        className={`group relative pinterest-card masonry-item-load ${
          viewMode === "masonry"
            ? "masonry-item mb-6 break-inside-avoid backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70"
            : viewMode === "grid"
            ? "backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70"
            : "flex gap-6 p-6 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-800/30 bg-white/70 dark:bg-gray-900/70"
        }`}
        style={
          viewMode === "masonry"
            ? { display: "inline-block", width: "100%" }
            : {}
        }
        whileHover={{
          scale: viewMode === "list" ? 1.01 : 1.02,
          y: viewMode === "list" ? -2 : -5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {/* Featured Badge */}
        {artwork.isFeatured && (
          <motion.div
            className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-lg font-bold text-xs shadow-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⭐ Featured
          </motion.div>
        )}

        {/* New Badge */}
        {artwork.isNew && (
          <motion.div
            className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✨ New
          </motion.div>
        )}

        {/* Image with optimized lazy loading */}
        <div
          className={`relative overflow-hidden ${
            viewMode === "masonry"
              ? "w-full rounded-t-2xl"
              : viewMode === "grid"
              ? "aspect-[4/5]"
              : "w-48 h-32 rounded-xl"
          }`}
          style={viewMode === "masonry" ? { height: `${masonryHeight}px` } : {}}
        >          <SmartImage
            imageId={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            fallbackCategory={artwork.category}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover Actions - Pinterest Style */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2">
              <motion.button
                className="p-2 bg-white/95 dark:bg-gray-800/95 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLike(artwork.id)}
                aria-label={`${isLiked ? "Unlike" : "Like"} ${artwork.title}`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </motion.button>
              <motion.button
                className="p-2 bg-white/95 dark:bg-gray-800/95 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Save ${artwork.title}`}
              >
                <Bookmark className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 bg-white/95 dark:bg-gray-800/95 rounded-full text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Download ${artwork.title}`}
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 bg-blue-500 dark:bg-amber-500 rounded-full text-white hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`View details of ${artwork.title}`}
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`${
            viewMode === "masonry"
              ? "p-4"
              : viewMode === "grid"
              ? "p-6"
              : "flex-1"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                {artwork.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                by {artwork.artist}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {artwork.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {artwork.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{artwork.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{artwork.likes.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 dark:text-amber-400">
                {artwork.price}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-amber-500 dark:to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Place bid on ${artwork.title}`}
          >
            <Zap className="w-4 h-4" />
            Place Bid
          </motion.button>
        </div>
      </motion.div>
    );
  }
);
