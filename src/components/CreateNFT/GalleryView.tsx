import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  Share2,
  Award,
  Palette,
  Image,
  Sun,
  Moon,
  Lightbulb,
  Camera,
  Home,
  Building2,
  Monitor,
} from "lucide-react";

import { NFTMetadata, GalleryPreviewSettings } from "./types";

interface GalleryViewProps {
  nftMetadata: NFTMetadata;
  gallerySettings: GalleryPreviewSettings;
  onSettingsChange: (settings: GalleryPreviewSettings) => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({
  nftMetadata,
  gallerySettings,
  onSettingsChange,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount] = useState(1247);
  const [likeCount, setLikeCount] = useState(89);

  const backgroundOptions = [
    { key: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { key: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    {
      key: "gradient",
      label: "Gradient",
      icon: <Palette className="w-4 h-4" />,
    },
    { key: "museum", label: "Museum", icon: <Building2 className="w-4 h-4" /> },
  ];

  const frameOptions = [
    { key: "none", label: "No Frame" },
    { key: "classic", label: "Classic" },
    { key: "modern", label: "Modern" },
    { key: "digital", label: "Digital" },
  ];

  const lightingOptions = [
    { key: "natural", label: "Natural", icon: <Sun className="w-4 h-4" /> },
    {
      key: "spotlight",
      label: "Spotlight",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    { key: "ambient", label: "Ambient", icon: <Camera className="w-4 h-4" /> },
  ];

  const environmentOptions = [
    {
      key: "gallery",
      label: "Gallery",
      icon: <Building2 className="w-4 h-4" />,
    },
    { key: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { key: "museum", label: "Museum", icon: <Award className="w-4 h-4" /> },
    { key: "digital", label: "Digital", icon: <Monitor className="w-4 h-4" /> },
  ];

  const getBackgroundClass = () => {
    switch (gallerySettings.background) {
      case "dark":
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-black";
      case "light":
        return "bg-gradient-to-br from-white via-gray-50 to-gray-100";
      case "gradient":
        return "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900";
      case "museum":
        return "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50";
      default:
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-black";
    }
  };

  const getFrameClass = () => {
    switch (gallerySettings.frame) {
      case "classic":
        return "border-8 border-amber-600 shadow-2xl rounded-sm";
      case "modern":
        return "border-4 border-white shadow-2xl rounded-lg";
      case "digital":
        return "border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)] rounded-xl";
      default:
        return "shadow-2xl rounded-xl";
    }
  };

  const getLightingEffect = () => {
    switch (gallerySettings.lighting) {
      case "spotlight":
        return "relative before:absolute before:inset-0 before:bg-gradient-radial before:from-transparent before:via-transparent before:to-black/30 before:rounded-xl";
      case "ambient":
        return "relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/20 before:to-transparent before:rounded-xl";
      default:
        return "";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };
  const updateSetting = (key: keyof GalleryPreviewSettings, value: string) => {
    onSettingsChange({
      ...gallerySettings,
      [key]: value,
    });
  };

  return (
    <div className="h-full space-y-6">
      {/* Gallery Settings Panel */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-4 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
          Gallery Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Background */}
          <div>
            <label className="block text-sm font-medium mb-2">Background</label>
            <div className="flex space-x-2">
              {backgroundOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => updateSetting("background", option.key)}
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    gallerySettings.background === option.key
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title={option.label}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Frame */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Frame Style
            </label>
            <select
              value={gallerySettings.frame}
              onChange={(e) => updateSetting("frame", e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            >
              {frameOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lighting */}
          <div>
            <label className="block text-sm font-medium mb-2">Lighting</label>
            <div className="flex space-x-2">
              {lightingOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => updateSetting("lighting", option.key)}
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    gallerySettings.lighting === option.key
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title={option.label}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Environment
            </label>
            <div className="flex space-x-2">
              {environmentOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => updateSetting("environment", option.key)}
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    gallerySettings.environment === option.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title={option.label}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Preview */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-6 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
          Live Preview
        </h3>

        <div
          className={`rounded-2xl p-8 min-h-[400px] ${getBackgroundClass()} relative overflow-hidden`}
        >
          {/* Gallery Environment Effects */}
          {gallerySettings.environment === "gallery" && (
            <>
              <div className="absolute top-4 left-4 w-16 h-1 bg-white/20 rounded-full"></div>
              <div className="absolute top-4 right-4 w-12 h-1 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/10 rounded-full"></div>
            </>
          )}

          {gallerySettings.environment === "museum" && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/10 pointer-events-none"></div>
          )}

          {/* Artwork Display */}
          <div className="flex items-center justify-center h-full">
            <div
              className={`relative ${getFrameClass()} ${getLightingEffect()} max-w-md`}
            >
              {nftMetadata.image ? (
                <img
                  src={nftMetadata.image}
                  alt={nftMetadata.name || "Untitled Artwork"}
                  className="w-full h-auto rounded-xl"
                />
              ) : (
                <div className="w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Your Artwork</p>
                    <p className="text-sm">Will appear here</p>
                  </div>
                </div>
              )}

              {/* Artwork Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                <div className="text-white">
                  <h4 className="font-bold text-lg mb-1">
                    {nftMetadata.name || "Untitled Artwork"}
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    by {nftMetadata.creator}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{viewCount.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 transition-colors hover:text-red-400"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLiked ? "fill-current text-red-500" : ""
                          }`}
                        />
                        <span>{likeCount}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Wall Elements */}
          {gallerySettings.environment === "gallery" && (
            <>
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-32 h-24 bg-white/5 rounded-lg border border-white/10"></div>
              <div className="absolute right-8 top-1/3 transform -translate-y-1/2 w-28 h-20 bg-white/5 rounded-lg border border-white/10"></div>
            </>
          )}
        </div>
      </motion.div>

      {/* NFT Details Preview */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-4 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
          NFT Details
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Name
            </span>
            <span className="text-sm font-semibold">
              {nftMetadata.name || "Untitled"}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Creator
            </span>
            <span className="text-sm font-semibold">{nftMetadata.creator}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Category
            </span>
            <span className="text-sm font-semibold">
              {nftMetadata.category}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Royalty
            </span>
            <span className="text-sm font-semibold">
              {nftMetadata.royalty}%
            </span>
          </div>

          {nftMetadata.price && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Price
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {nftMetadata.price}
              </span>
            </div>
          )}

          {nftMetadata.description && (
            <div className="py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Description
              </span>
              <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
                {nftMetadata.description}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GalleryView;
