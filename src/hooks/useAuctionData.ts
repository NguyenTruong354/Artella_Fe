import { useState, useEffect } from 'react';
import { AuctionDTO, ScheduledAuctionDetailDTO } from '../types/auction';
import { auctionService } from '../api/services/auctionService';
import { auctionScheduleService } from '../api/services/auctionScheduleService';

interface UseAuctionDataReturn {
  // Live auctions data
  liveAuctions: AuctionDTO[];
  liveAuctionsLoading: boolean;
  liveAuctionsError: string | null;
  
  // Scheduled auctions data  
  scheduledAuctions: ScheduledAuctionDetailDTO[];
  scheduledAuctionsLoading: boolean;
  scheduledAuctionsError: string | null;
  
  // Combined loading state
  isLoading: boolean;
  hasError: boolean;
  
  // Refetch functions
  refetchLiveAuctions: () => void;
  refetchScheduledAuctions: () => void;
  refetchAll: () => void;
}

export const useAuctionData = (): UseAuctionDataReturn => {
  // Live auctions state
  const [liveAuctions, setLiveAuctions] = useState<AuctionDTO[]>([]);
  const [liveAuctionsLoading, setLiveAuctionsLoading] = useState(true);
  const [liveAuctionsError, setLiveAuctionsError] = useState<string | null>(null);
  
  // Scheduled auctions state
  const [scheduledAuctions, setScheduledAuctions] = useState<ScheduledAuctionDetailDTO[]>([]);
  const [scheduledAuctionsLoading, setScheduledAuctionsLoading] = useState(true);
  const [scheduledAuctionsError, setScheduledAuctionsError] = useState<string | null>(null);

  // Fetch live auctions
  const fetchLiveAuctions = async () => {
    try {
      setLiveAuctionsLoading(true);
      setLiveAuctionsError(null);
      
      const auctions = await auctionService.getAllAuctions();
      setLiveAuctions(auctions);
      
      console.log('✅ Live auctions fetched:', auctions);
    } catch (error) {
      console.error('❌ Error fetching live auctions:', error);
      setLiveAuctionsError('Failed to load live auctions');
    } finally {
      setLiveAuctionsLoading(false);
    }
  };

  // Fetch scheduled auctions
  const fetchScheduledAuctions = async () => {
    try {
      setScheduledAuctionsLoading(true);
      setScheduledAuctionsError(null);
      
      const scheduled = await auctionScheduleService.getUpcomingScheduledAuctions();
      setScheduledAuctions(scheduled);
      
      console.log('✅ Scheduled auctions fetched:', scheduled);
    } catch (error) {
      console.error('❌ Error fetching scheduled auctions:', error);
      setScheduledAuctionsError('Failed to load scheduled auctions');
    } finally {
      setScheduledAuctionsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiveAuctions();
    fetchScheduledAuctions();
  }, []);

  // Refetch functions
  const refetchLiveAuctions = () => {
    fetchLiveAuctions();
  };

  const refetchScheduledAuctions = () => {
    fetchScheduledAuctions();
  };

  const refetchAll = () => {
    fetchLiveAuctions();
    fetchScheduledAuctions();
  };

  // Combined states
  const isLoading = liveAuctionsLoading || scheduledAuctionsLoading;
  const hasError = Boolean(liveAuctionsError || scheduledAuctionsError);

  return {
    liveAuctions,
    liveAuctionsLoading,
    liveAuctionsError,
    scheduledAuctions,
    scheduledAuctionsLoading,
    scheduledAuctionsError,
    isLoading,
    hasError,
    refetchLiveAuctions,
    refetchScheduledAuctions,
    refetchAll
  };
};
