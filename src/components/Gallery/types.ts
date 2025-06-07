// Gallery Types
export interface ArtworkItem {
  id: number;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
  likes: number;
  views: number;
  isNew: boolean;
  isFeatured: boolean;
  description: string;
  tags: string[];
}

export interface AdvancedFilters {
  priceRange: { min: number; max: number };
  selectedTags: string[];
  selectedArtist: string;
  sortBy:
    | "newest"
    | "oldest"
    | "price-low"
    | "price-high"
    | "most-liked"
    | "most-viewed";
}

export interface GalleryPageState {
  selectedCategory: string;
  viewMode: "masonry" | "grid" | "list";
  searchQuery: string;
  likedItems: Set<number>;
  isLoading: boolean;
  displayedArtworks: ArtworkItem[];
  hasMoreArtworks: boolean;
  page: number;
  isLoadingMore: boolean;
  isFilteringTransition: boolean;
  advancedFilters: AdvancedFilters;
  showAdvancedSearch: boolean;
}

export type GalleryPageAction =
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "masonry" | "grid" | "list" }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_LIKE"; payload: number }
  | { type: "FINISH_INITIAL_LOADING" }
  | { type: "LOAD_MORE_ARTWORKS"; payload: ArtworkItem[] }
  | { type: "SET_LOADING_MORE"; payload: boolean }
  | { type: "RESET_ARTWORKS"; payload: ArtworkItem[] }
  | { type: "START_FILTERING_TRANSITION" }
  | { type: "FINISH_FILTERING_TRANSITION" }
  | { type: "SET_PRICE_RANGE"; payload: { min: number; max: number } }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_ARTIST"; payload: string }
  | { type: "SET_SORT_BY"; payload: AdvancedFilters["sortBy"] }
  | { type: "TOGGLE_ADVANCED_SEARCH" }
  | { type: "RESET_ADVANCED_FILTERS" };
