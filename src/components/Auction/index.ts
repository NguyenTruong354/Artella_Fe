export { default as AuctionHeader } from './AuctionHeader';
export { default as BreakingNewsTicker } from './BreakingNewsTicker';
export { default as FeaturedAuctionHero } from './FeaturedAuctionHero';
export { default as FilterTabs } from './FilterTabs';
export { default as AuctionGrid } from './AuctionGrid';
export { default as TrendingTopics } from './TrendingTopics';
export { default as MostWatched } from './MostWatched';
export { default as NewsletterSignup } from './NewsletterSignup';
export { default as SocialProof } from './SocialProof';
export { default as EditorsPick } from './EditorsPick';
export { default as ExpertsCorner } from './ExpertsCorner';

// Export types
export interface AuctionData {
  id: string; // Changed to string to match API data
  title: string;
  artist: string;
  currentBid: string;
  timeLeft: string;
  image: string;
  bidders: number;
  category: string;
  isHot: boolean;
  estimatedValue: string;
  totalBids: number;
  highestBidder: string;
  storyType: string;
  readingTime: string;
  tags: string[];
  status: string;
  lastUpdate: string;
  storyPreview: string;
  location: string;
}

export interface Filter {
  id: string;
  label: string;
  count: number;
}
