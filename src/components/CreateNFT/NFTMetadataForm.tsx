import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Minus,
  Tag,
  FileText,
  User,
  Percent,
  DollarSign,
  Hash,
  Image,
  Palette,
  Camera,
  Music,
  Video,
  Gamepad2,
} from "lucide-react";

import { NFTMetadata, NFTAttribute } from "./types";

interface NFTMetadataFormProps {
  metadata: NFTMetadata;
  onMetadataChange: (metadata: NFTMetadata) => void;
}

const NFTMetadataForm: React.FC<NFTMetadataFormProps> = ({
  metadata,
  onMetadataChange,
}) => {
  const [newAttribute, setNewAttribute] = useState<NFTAttribute>({
    trait_type: "",
    value: "",
  });

  const categories = [
    {
      value: "Art",
      icon: <Palette className="w-4 h-4" />,
      label: "Digital Art",
    },
    {
      value: "Photography",
      icon: <Camera className="w-4 h-4" />,
      label: "Photography",
    },
    { value: "Music", icon: <Music className="w-4 h-4" />, label: "Music" },
    { value: "Video", icon: <Video className="w-4 h-4" />, label: "Video" },
    {
      value: "Gaming",
      icon: <Gamepad2 className="w-4 h-4" />,
      label: "Gaming",
    },
    {
      value: "Collectible",
      icon: <Hash className="w-4 h-4" />,
      label: "Collectible",
    },
  ];
  const handleInputChange = (
    field: keyof NFTMetadata,
    value: string | number
  ) => {
    onMetadataChange({
      ...metadata,
      [field]: value,
    });
  };

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      onMetadataChange({
        ...metadata,
        attributes: [...metadata.attributes, { ...newAttribute }],
      });
      setNewAttribute({ trait_type: "", value: "" });
    }
  };

  const removeAttribute = (index: number) => {
    onMetadataChange({
      ...metadata,
      attributes: metadata.attributes.filter((_, i) => i !== index),
    });
  };
  const updateAttribute = (
    index: number,
    field: keyof NFTAttribute,
    value: string | number
  ) => {
    const updatedAttributes = metadata.attributes.map((attr, i) =>
      i === index ? { ...attr, [field]: value } : attr
    );
    onMetadataChange({
      ...metadata,
      attributes: updatedAttributes,
    });
  };

  return (
    <motion.div
      className="backdrop-blur-sm rounded-2xl p-6 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
        NFT Metadata
      </h3>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NFT Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Tag className="w-4 h-4" />
              <span>NFT Name</span>
            </label>
            <input
              type="text"
              value={metadata.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter NFT name..."
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Hash className="w-4 h-4" />
              <span>Category</span>
            </label>
            <div className="relative">
              <select
                value={metadata.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200 appearance-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Creator */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <User className="w-4 h-4" />
              <span>Creator</span>
            </label>
            <input
              type="text"
              value={metadata.creator}
              onChange={(e) => handleInputChange("creator", e.target.value)}
              placeholder="Creator name..."
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Royalty */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium mb-2">
              <Percent className="w-4 h-4" />
              <span>Royalty Percentage</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={metadata.royalty}
                onChange={(e) =>
                  handleInputChange("royalty", parseFloat(e.target.value) || 0)
                }
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price (Optional) */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Price (Optional)</span>
          </label>
          <input
            type="text"
            value={metadata.price || ""}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="e.g., 0.5 ETH, $100, etc..."
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium mb-2">
            <FileText className="w-4 h-4" />
            <span>Description</span>
          </label>
          <textarea
            value={metadata.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your NFT..."
            rows={4}
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200 resize-none"
          />
        </div>

        {/* Collection (Optional) */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium mb-2">
            <Image className="w-4 h-4" />
            <span>Collection (Optional)</span>
          </label>
          <input
            type="text"
            value={metadata.collection || ""}
            onChange={(e) => handleInputChange("collection", e.target.value)}
            placeholder="Collection name..."
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-amber-400/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Attributes/Properties */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium mb-4">
            <Tag className="w-4 h-4" />
            <span>Properties & Attributes</span>
          </label>

          {/* Existing Attributes */}
          {metadata.attributes.length > 0 && (
            <div className="space-y-3 mb-4">
              {metadata.attributes.map((attribute, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <input
                    type="text"
                    value={attribute.trait_type}
                    onChange={(e) =>
                      updateAttribute(index, "trait_type", e.target.value)
                    }
                    placeholder="Property name"
                    className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-amber-400 outline-none transition-all duration-200"
                  />
                  <input
                    type="text"
                    value={attribute.value}
                    onChange={(e) =>
                      updateAttribute(index, "value", e.target.value)
                    }
                    placeholder="Value"
                    className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-amber-400 outline-none transition-all duration-200"
                  />
                  <button
                    onClick={() => removeAttribute(index)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add New Attribute */}
          <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <input
              type="text"
              value={newAttribute.trait_type}
              onChange={(e) =>
                setNewAttribute((prev) => ({
                  ...prev,
                  trait_type: e.target.value,
                }))
              }
              placeholder="Property name (e.g., Color, Rarity)"
              className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-amber-400 outline-none transition-all duration-200"
            />
            <input
              type="text"
              value={newAttribute.value}
              onChange={(e) =>
                setNewAttribute((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Value (e.g., Blue, Rare)"
              className="flex-1 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-amber-400 outline-none transition-all duration-200"
            />
            <button
              onClick={addAttribute}
              disabled={!newAttribute.trait_type || !newAttribute.value}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Save Draft
          </button>
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Preview NFT
          </button>
          <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            Mint NFT
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NFTMetadataForm;
