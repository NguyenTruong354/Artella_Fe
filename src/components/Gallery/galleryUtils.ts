import { useMemo } from "react";
import { ArtworkItem, AdvancedFilters } from "./types";

// Utility function to parse price from string (e.g., "3.2 ETH" -> 3.2)
export const parsePrice = (priceString: string): number => {
  const match = priceString.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
};

// Utility function to get all unique artists
export const useAllArtists = (artworks: ArtworkItem[]): string[] => {
  return useMemo(() => {
    const artistSet = new Set(artworks.map((artwork) => artwork.artist));
    return Array.from(artistSet).sort();
  }, [artworks]);
};

// Utility function to get all unique tags
export const useAllTags = (artworks: ArtworkItem[]): string[] => {
  return useMemo(() => {
    const tagSet = new Set(artworks.flatMap((artwork) => artwork.tags));
    return Array.from(tagSet).sort();
  }, [artworks]);
};

// Enhanced filter function with advanced filters
export const useFilteredArtworks = (
  artworks: ArtworkItem[],
  displayedArtworks: ArtworkItem[],
  selectedCategory: string,
  searchQuery: string,
  advancedFilters: AdvancedFilters
): ArtworkItem[] => {
  return useMemo(() => {
    const baseArtworks = artworks.filter((artwork) => {
      // Basic filters
      const matchesCategory =
        selectedCategory === "All" || artwork.category === selectedCategory;
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());

      // Advanced filters
      const artworkPrice = parsePrice(artwork.price);
      const matchesPriceRange =
        artworkPrice >= advancedFilters.priceRange.min &&
        artworkPrice <= advancedFilters.priceRange.max;

      const matchesTags =
        advancedFilters.selectedTags.length === 0 ||
        advancedFilters.selectedTags.some((tag) =>
          artwork.tags.some((artworkTag) =>
            artworkTag.toLowerCase().includes(tag.toLowerCase())
          )
        );

      const matchesArtist =
        !advancedFilters.selectedArtist ||
        artwork.artist
          .toLowerCase()
          .includes(advancedFilters.selectedArtist.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPriceRange &&
        matchesTags &&
        matchesArtist
      );
    });

    // Sort the filtered results
    const sortedArtworks = [...baseArtworks].sort((a, b) => {
      switch (advancedFilters.sortBy) {
        case "price-low":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-high":
          return parsePrice(b.price) - parsePrice(a.price);
        case "most-liked":
          return b.likes - a.likes;
        case "most-viewed":
          return b.views - a.views;
        case "oldest":
          return a.id - b.id;
        case "newest":
        default:
          return b.id - a.id;
      }
    });

    // Combine base artworks with displayed artworks for infinite scroll
    const additionalFilteredArtworks = displayedArtworks.filter((artwork) => {
      const matchesCategory =
        selectedCategory === "All" || artwork.category === selectedCategory;
      const matchesSearch =
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());

      const artworkPrice = parsePrice(artwork.price);
      const matchesPriceRange =
        artworkPrice >= advancedFilters.priceRange.min &&
        artworkPrice <= advancedFilters.priceRange.max;

      const matchesTags =
        advancedFilters.selectedTags.length === 0 ||
        advancedFilters.selectedTags.some((tag) =>
          artwork.tags.some((artworkTag) =>
            artworkTag.toLowerCase().includes(tag.toLowerCase())
          )
        );

      const matchesArtist =
        !advancedFilters.selectedArtist ||
        artwork.artist
          .toLowerCase()
          .includes(advancedFilters.selectedArtist.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPriceRange &&
        matchesTags &&
        matchesArtist
      );
    });

    return [...sortedArtworks, ...additionalFilteredArtworks];
  }, [
    artworks,
    displayedArtworks,
    selectedCategory,
    searchQuery,
    advancedFilters,
  ]);
};
