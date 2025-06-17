import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  Eye,
  Heart,
  MoreVertical,
  Plus,
  RefreshCw,
  AlertCircle,
  Palette,
  ShoppingCart,
  Share2,
  ExternalLink,
  Copy,
  ChevronDown,
  DollarSign,
  X,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { nftService, authService } from "../api/services";
import { DigitalArtNFT } from "../api/types";
import SmartImage from "../components/SmartImage";
import SEOHead from "../components/SEO/SEOHead";
import { generateSEOTitle, generateSEODescription } from "../utils/seo";

interface NFTCardProps {
  nft: DigitalArtNFT;
  onAction: (action: string, nft: DigitalArtNFT) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice > 0 ? `${numPrice} ETH` : 'Not for sale';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isHovered ? 'shadow-2xl ring-2 ring-blue-500/20' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">        <SmartImage
          imageId={nft.imageUrl || nft.tokenId}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          fallbackCategory={nft.category}
        />
        
        {/* Overlay Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-3"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction('view', nft)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </motion.button>              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction('detail', nft)}
                className="bg-purple-500/80 backdrop-blur-sm border border-purple-400/30 text-white p-2 rounded-lg hover:bg-purple-500 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAction('sell', nft)}
                className="bg-blue-500/80 backdrop-blur-sm border border-blue-400/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-500 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Sell</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Badge */}
        {nft.price && parseFloat(nft.price.toString()) > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Listed
            </span>
          </div>
        )}

        {/* More Actions */}
        <div className="absolute top-3 right-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowActions(!showActions)}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
          
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 w-48 z-10"
              >
                <button
                  onClick={() => onAction('share', nft)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => onAction('copy-link', nft)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => onAction('external', nft)}
                  className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {nft.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {nft.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{nft.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{nft.likeCount || 0}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(nft.price || 0)}
            </p>
          </div>
        </div>

        {/* Token Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Token #{nft.tokenId}</span>
          <span>{nft.category}</span>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC<{ onCreateNFT: () => void }> = ({ onCreateNFT }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4"
  >
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <Palette className="w-12 h-12 text-gray-400 dark:text-gray-600" />
    </div>
    
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
      No NFTs Created Yet
    </h3>
    
    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
      Start creating your digital art NFTs! Your masterpieces will appear here once you mint them.
    </p>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onCreateNFT}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 font-medium transition-colors"
    >
      <Plus className="w-5 h-5" />
      <span>Create Your First NFT</span>
    </motion.button>
  </motion.div>
);

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: DigitalArtNFT | null;
  onSell: (nftId: string, price: number) => Promise<void>;
  onRemoveFromSale: (nftId: string) => Promise<void>;
}

const SellModal: React.FC<SellModalProps> = ({ isOpen, onClose, nft, onSell, onRemoveFromSale }) => {
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isListed = nft?.price && parseFloat(nft.price.toString()) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nft) return;

    try {
      setIsLoading(true);
      setError(null);

      if (isListed) {
        // Remove from sale
        await onRemoveFromSale(nft.id);
      } else {
        // Put on sale
        const priceValue = parseFloat(price);
        if (!priceValue || priceValue <= 0) {
          setError("Please enter a valid price");
          return;
        }
        await onSell(nft.id, priceValue);
      }

      onClose();
      setPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !nft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isListed ? "Remove from Sale" : "Put NFT on Sale"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* NFT Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <Palette className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{nft.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Token #{nft.tokenId}</p>
              {isListed && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Currently listed for {nft.price} ETH
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {!isListed && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sale Price (ETH)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isListed}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || (!isListed && !price)}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  isListed
                    ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isListed ? "Removing..." : "Listing..."}
                  </div>
                ) : (
                  isListed ? "Remove from Sale" : "Put on Sale"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// EditNFTModal component
interface EditNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: DigitalArtNFT | null;
  onUpdate: (id: string, data: { name?: string; description?: string; category?: string; tags?: string; }) => Promise<void>;
}

const EditNFTModal: React.FC<EditNFTModalProps> = ({ isOpen, onClose, nft, onUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when NFT changes
  useEffect(() => {
    if (nft) {
      setName(nft.name || "");
      setDescription(nft.description || "");
      setCategory(nft.category || "");
      setTags(nft.tags ? nft.tags.join(", ") : "");
      setError(null);
    }
  }, [nft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nft) return;

    setLoading(true);
    setError(null);

    try {
      const updateData: { name?: string; description?: string; category?: string; tags?: string; } = {};
      
      if (name.trim() && name !== nft.name) updateData.name = name.trim();
      if (description.trim() && description !== nft.description) updateData.description = description.trim();
      if (category.trim() && category !== nft.category) updateData.category = category.trim();
      
      const newTags = tags.trim();
      const currentTags = nft.tags ? nft.tags.join(", ") : "";
      if (newTags !== currentTags) updateData.tags = newTags;

      if (Object.keys(updateData).length === 0) {
        setError("No changes detected");
        return;
      }

      await onUpdate(nft.id, updateData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update NFT");
    } finally {
      setLoading(false);
    }
  };

  if (!nft) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit NFT Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* NFT Info */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <Palette className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{nft.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Token #{nft.tokenId}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter NFT name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter NFT description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Digital Art, Photography"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Separate tags with commas (e.g., art, digital, creative)
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update NFT"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SellArt: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });  // State
  const [nfts, setNfts] = useState<DigitalArtNFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<DigitalArtNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-high" | "price-low" | "popular">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Modal state
  const [showSellModal, setShowSellModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<DigitalArtNFT | null>(null);

  // Categories
  const categories = ["all", "art", "gaming", "music", "photography", "sports", "collectibles"];

  // Animation
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Load user NFTs
  const loadUserNFTs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);      // Get user profile to get wallet address
      const userProfile = await authService.getUserProfile();
      const wallet = userProfile.data.walletAddress || userProfile.data.fullName || userProfile.data.email;      if (!wallet) {
        throw new Error("No wallet address found. Please connect your wallet.");
      }      // Get user's NFTs using new owner API endpoint: /api/v1/digital-arts/owner/{ownerAddress}
      const userNFTs = await nftService.getDigitalArtNFTsByOwner(wallet);
      setNfts(userNFTs);
      setFilteredNfts(userNFTs);
    } catch (err) {
      console.error("Error loading user NFTs:", err);
      setError(err instanceof Error ? err.message : "Failed to load your NFTs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserNFTs();
  }, [loadUserNFTs]);

  // Filter and sort NFTs
  useEffect(() => {
    let filtered = [...nfts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(nft => 
        nft.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-high":
        filtered.sort((a, b) => (parseFloat(b.price?.toString() || "0")) - (parseFloat(a.price?.toString() || "0")));
        break;
      case "price-low":
        filtered.sort((a, b) => (parseFloat(a.price?.toString() || "0")) - (parseFloat(b.price?.toString() || "0")));
        break;      case "popular":
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }
    
    setFilteredNfts(filtered);
  }, [nfts, searchQuery, selectedCategory, sortBy]);  // Handle NFT actions
  const handleNFTAction = useCallback((action: string, nft: DigitalArtNFT) => {
    switch (action) {
      case 'view':
        navigate(`/Home/nft/${nft.id}`);
        break;
      case 'detail':
        setSelectedNFT(nft);
        setShowEditModal(true);
        break;
      case 'sell':
        setSelectedNFT(nft);
        setShowSellModal(true);
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: nft.name,
            text: nft.description,
            url: window.location.origin + `/Home/nft/${nft.id}`,
          });
        }
        break;
      case 'copy-link':
        navigator.clipboard.writeText(window.location.origin + `/Home/nft/${nft.id}`);
        // TODO: Show toast notification
        break;
      case 'external':
        // TODO: Open in NFT explorer
        console.log('View on explorer:', nft);
        break;
    }
  }, [navigate]);

  // Handle sell NFT
  const handleSellNFT = useCallback(async (nftId: string, price: number) => {
    try {
      const updatedNFT = await nftService.putDigitalArtNFTOnSale(nftId, price);
      
      // Update local state
      setNfts(prevNfts => 
        prevNfts.map(nft => nft.id === nftId ? updatedNFT : nft)
      );
      setFilteredNfts(prevFiltered => 
        prevFiltered.map(nft => nft.id === nftId ? updatedNFT : nft)
      );
    } catch (error) {
      console.error('Error putting NFT on sale:', error);
      throw error;
    }
  }, []);

  // Handle remove NFT from sale
  const handleRemoveFromSale = useCallback(async (nftId: string) => {
    try {
      const updatedNFT = await nftService.removeDigitalArtNFTFromSale(nftId);
      
      // Update local state
      setNfts(prevNfts => 
        prevNfts.map(nft => nft.id === nftId ? updatedNFT : nft)
      );
      setFilteredNfts(prevFiltered => 
        prevFiltered.map(nft => nft.id === nftId ? updatedNFT : nft)
      );
    } catch (error) {
      console.error('Error removing NFT from sale:', error);
      throw error;
    }
  }, []);
  // Handle update NFT
  const handleUpdateNFT = useCallback(async (id: string, data: { name?: string; description?: string; category?: string; tags?: string; }) => {
    try {
      const updatedNFT = await nftService.updateDigitalArtNFTSimple(id, data);
      
      // Update local state
      setNfts(prevNfts => 
        prevNfts.map(nft => nft.id === id ? updatedNFT : nft)
      );
      setFilteredNfts(prevFiltered => 
        prevFiltered.map(nft => nft.id === id ? updatedNFT : nft)
      );
    } catch (error) {
      console.error('Error updating NFT:', error);
      throw error;
    }
  }, []);

  const totalValue = nfts.reduce((sum, nft) => sum + parseFloat(nft.price?.toString() || "0"), 0);
  const listedCount = nfts.filter(nft => nft.price && parseFloat(nft.price.toString()) > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SEOHead
          title={generateSEOTitle("My Art Collection")}
          description={generateSEODescription("Manage and sell your digital art NFT collection")}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <SEOHead
          title={generateSEOTitle("My Art Collection - Error")}
          description={generateSEODescription("Error loading your digital art collection")}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadUserNFTs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative z-0">
      <SEOHead
        title={generateSEOTitle("My Art Collection")}
        description={generateSEODescription("Manage and sell your digital art NFT collection")}
      />
        <div
        ref={sectionRef}
        className="relative z-10 container mx-auto px-4 py-8"
      >{/* Header */}
        <div className="mb-8 relative z-20">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My Art Collection
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Manage and showcase your digital art NFTs
            </p>
          </div>          {/* Stats */}
          {nfts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-20">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total NFTs
                </h3>
                <p className="text-3xl font-bold text-blue-600">{nfts.length}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Listed for Sale
                </h3>
                <p className="text-3xl font-bold text-green-600">{listedCount}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total Value
                </h3>                <p className="text-3xl font-bold text-purple-600">{totalValue.toFixed(3)} ETH</p>
              </div>
            </div>
          )}
        </div>

        {nfts.length === 0 ? (
          <EmptyState onCreateNFT={() => navigate('/create-nft')} />
        ) : (
          <>            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8 relative z-20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search your NFTs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "price-high" | "price-low" | "popular")}
                      className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* View Mode */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" 
                        ? "bg-white dark:bg-gray-600 shadow text-blue-600" 
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" 
                        ? "bg-white dark:bg-gray-600 shadow text-blue-600" 
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Refresh */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadUserNFTs}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredNfts.length} of {nfts.length} NFTs
              </div>
            </div>            {/* NFT Grid */}
            <div
              className={`grid gap-6 relative z-20 ${viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredNfts.map((nft) => (                  <NFTCard
                    key={nft.tokenId}
                    nft={nft}
                    onAction={handleNFTAction}
                  />                ))}
              </AnimatePresence>
            </div>            {filteredNfts.length === 0 && nfts.length > 0 && (
              <div className="text-center py-16 relative z-20">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No NFTs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}          </>        )}
      </div>

      {/* Sell Modal */}
      <SellModal
        isOpen={showSellModal}
        onClose={() => {
          setShowSellModal(false);
          setSelectedNFT(null);
        }}
        nft={selectedNFT}
        onSell={handleSellNFT}
        onRemoveFromSale={handleRemoveFromSale}
      />

      {/* Edit NFT Modal */}
      <EditNFTModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedNFT(null);
        }}
        nft={selectedNFT}
        onUpdate={handleUpdateNFT}
      />
    </div>
  );
};

export default SellArt;
