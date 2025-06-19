import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { nftService } from '../../api/services/nftService';
import { DigitalArtNFT } from '../../api/types';

const NFTSearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DigitalArtNFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword || keyword.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await nftService.searchDigitalArtNFTs(keyword);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching NFTs:', err);
        setError('Failed to search NFTs. Please try again later.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Search NFTs
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for NFTs by name, description, or tags..."
            className="w-full p-4 pr-12 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-t-2 border-blue-500 border-r-2 rounded-full"
              />
            ) : (
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded dark:bg-red-900 dark:text-red-100"
        >
          {error}
        </motion.div>
      )}

      <div>
        {searchResults.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {searchResults.map((nft) => (
              <motion.div
                key={nft.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={nft.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
                    alt={nft.name}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 truncate dark:text-white">
                    {nft.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2 dark:text-gray-300">
                    {nft.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-blue-600 font-medium dark:text-blue-400">
                      {nft.price ? `${nft.price} ETH` : 'Price not available'}
                    </div>
                    <div className="text-gray-500 text-sm dark:text-gray-400">
                      {nft.creator ? `By ${nft.creator.substring(0, 6)}...${nft.creator.substring(nft.creator.length - 4)}` : 'Unknown creator'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : searchTerm && !isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10 dark:text-gray-400"
          >
            No NFTs found for "{searchTerm}"
          </motion.div>
        ) : !searchTerm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10 dark:text-gray-400"
          >
            Enter a search term to find NFTs
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default NFTSearchComponent;
