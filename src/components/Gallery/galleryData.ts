/**
 * Gallery Data - Contains categories for filtering products and NFTs
 * 
 * This file only defines the categories that are used for filtering in the Gallery UI.
 * Actual data is fetched from API endpoints.
 */

/**
 * Categories to use for filtering in the Gallery.
 * - "All": Shows all items
 * - NFT Categories: "Digital Art" (primary NFT category)
 * - NFT Tags: "Abstract", "Portrait", "Nature", "Cyberpunk", "Art", "Futuristic", "Neon", "Color", "Festive"
 * - Product Categories: "Painting" (primary product category)
 */
export const categories = [
  "All",
  "Digital Art", // NFT category
  "Painting",    // Product category
  "Abstract",    // NFT tag & Product category
  "Portrait",    // NFT tag
  "Nature",      // NFT tag
  "Cyberpunk",   // NFT tag
  "Art",         // NFT tag
  "Futuristic",  // NFT tag
  "Neon",        // NFT tag
  "Color",       // NFT tag
  "Festive"      // NFT tag - no comma for last item
];

