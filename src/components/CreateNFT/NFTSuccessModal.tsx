import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
  Share2,
  X,
  Eye,
  Heart,
  Coins
} from 'lucide-react';

interface NFTSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftData: {
    id?: string;
    name?: string;
    description?: string;
    tokenId?: string;
    nftId?: string;
    category?: string;
    owner?: string;
    creator?: string;
    contractAddress?: string;
    imageUrl?: string;
    royaltyPercentage?: number;
    createdAt?: string;
    mintedAt?: string;
  };
  imagePreview?: string; // Canvas image as base64
}

const NFTSuccessModal: React.FC<NFTSuccessModalProps> = ({
  isOpen,
  onClose,
  nftData,
  imagePreview
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log(`${label} copied to clipboard:`, text);
    });
  };

  const shareNFT = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out my NFT: ${nftData.name}`,
        text: nftData.description,
        url: window.location.href
      });
    } else {
      copyToClipboard(window.location.href, 'NFT URL');
    }
  };

  const downloadImage = () => {
    if (imagePreview) {
      const link = document.createElement('a');
      link.download = `${nftData.name || 'nft'}.png`;
      link.href = imagePreview;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
          >
            🎉 NFT Created Successfully!
          </motion.h2>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* NFT Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 mx-auto md:mx-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={nftData.name || 'NFT'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Eye className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            {/* NFT Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {nftData.name || 'Untitled NFT'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {nftData.description || 'No description'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Coins className="w-4 h-4" />
                    <span>Token ID</span>
                  </div>
                  <div className="font-mono text-gray-900 dark:text-gray-100 break-all">
                    {nftData.tokenId || 'N/A'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span>Category</span>
                  </div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {nftData.category || 'Art'}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>0 views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>0 likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4" />
                  <span>{nftData.royaltyPercentage || 0}% royalty</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3"
          >
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Technical Details</h4>
            
            <div className="space-y-2 text-sm">
              {nftData.nftId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">NFT ID:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 dark:text-gray-100 break-all">
                      {nftData.nftId.length > 20 ? `${nftData.nftId.slice(0, 20)}...` : nftData.nftId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(nftData.nftId!, 'NFT ID')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {nftData.contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Contract:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {nftData.contractAddress.slice(0, 8)}...{nftData.contractAddress.slice(-6)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(nftData.contractAddress!, 'Contract Address')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {nftData.owner && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {nftData.owner.slice(0, 8)}...{nftData.owner.slice(-6)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(nftData.owner!, 'Owner Address')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {nftData.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Date(nftData.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={shareNFT}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={downloadImage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>

            <button
              onClick={() => {
                // Navigate to NFT detail page or marketplace
                console.log('View on marketplace clicked');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Marketplace</span>
            </button>
          </motion.div>

          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-200"
            >
              Create Another NFT
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NFTSuccessModal;
