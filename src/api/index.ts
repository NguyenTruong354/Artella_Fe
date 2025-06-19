// Main API module exports
export * from './client';
export * from './auth';
export * from './utils';

// Export all types, then export services, renaming conflicting exports
export * from './types';
export {
  authService,
  nftService,
  auctionService,
  auctionScheduleService,
  productService,
} from './services';
