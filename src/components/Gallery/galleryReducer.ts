import { GalleryPageState, GalleryPageAction } from "./types";

// Function to get initial liked items from localStorage
const getInitialLikedItems = (): Set<number> => {
  const storedLikes = localStorage.getItem("likedArtworks");
  if (storedLikes) {
    try {
      const parsedLikes = JSON.parse(storedLikes);
      if (Array.isArray(parsedLikes)) {
        return new Set(
          parsedLikes.filter((item) => typeof item === "number")
        ) as Set<number>;
      }
    } catch (error) {
      console.error("Error parsing liked items from localStorage:", error);
      return new Set();
    }
  }
  return new Set();
};

// Initial state for the reducer
export const initialGalleryPageState: GalleryPageState = {
  selectedCategory: "All",
  viewMode: "masonry",
  searchQuery: "",
  likedItems: getInitialLikedItems(),
  isLoading: true,
  displayedArtworks: [],
  hasMoreArtworks: true,
  page: 1,
  isLoadingMore: false,
  isFilteringTransition: false,
  advancedFilters: {
    priceRange: { min: 0, max: 10 },
    selectedTags: [],
    selectedArtist: "",
    sortBy: "newest",
  },
  showAdvancedSearch: false,
};

export const galleryPageReducer = (
  state: GalleryPageState,
  action: GalleryPageAction
): GalleryPageState => {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.payload,
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    case "TOGGLE_LIKE": {
      const newLikedItems = new Set(state.likedItems);
      if (newLikedItems.has(action.payload)) {
        newLikedItems.delete(action.payload);
      } else {
        newLikedItems.add(action.payload);
      }
      // Persist liked items to localStorage
      localStorage.setItem(
        "likedArtworks",
        JSON.stringify(Array.from(newLikedItems))
      );
      return { ...state, likedItems: newLikedItems };
    }
    case "FINISH_INITIAL_LOADING":
      return { ...state, isLoading: false };
    case "LOAD_MORE_ARTWORKS":
      return {
        ...state,
        displayedArtworks: [...state.displayedArtworks, ...action.payload],
        page: state.page + 1,
        isLoadingMore: false,
        hasMoreArtworks: action.payload.length > 0,
      };
    case "SET_LOADING_MORE":
      return { ...state, isLoadingMore: action.payload };
    case "RESET_ARTWORKS":
      return {
        ...state,
        displayedArtworks: action.payload,
        page: 1,
        hasMoreArtworks: true,
      };
    case "START_FILTERING_TRANSITION":
      return { ...state, isFilteringTransition: true };
    case "FINISH_FILTERING_TRANSITION":
      return { ...state, isFilteringTransition: false };
    case "SET_PRICE_RANGE":
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          priceRange: action.payload,
        },
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    case "TOGGLE_TAG": {
      const currentTags = state.advancedFilters.selectedTags;
      const newTags = currentTags.includes(action.payload)
        ? currentTags.filter((tag) => tag !== action.payload)
        : [...currentTags, action.payload];
      return {
        ...state,
        advancedFilters: { ...state.advancedFilters, selectedTags: newTags },
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    }
    case "SET_ARTIST":
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          selectedArtist: action.payload,
        },
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    case "SET_SORT_BY":
      return {
        ...state,
        advancedFilters: { ...state.advancedFilters, sortBy: action.payload },
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    case "TOGGLE_ADVANCED_SEARCH":
      return { ...state, showAdvancedSearch: !state.showAdvancedSearch };
    case "RESET_ADVANCED_FILTERS":
      return {
        ...state,
        advancedFilters: {
          priceRange: { min: 0, max: 10 },
          selectedTags: [],
          selectedArtist: "",
          sortBy: "newest",
        },
        page: 1,
        displayedArtworks: [],
        isFilteringTransition: true,
      };
    default:
      return state;
  }
};
