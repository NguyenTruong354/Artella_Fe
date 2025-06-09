import React, { useEffect, useRef } from 'react';

interface AuctionSoundProps {
  isActive: boolean;
  hasNewBid: boolean;
  hasApplause: boolean;
}

const AuctionSound: React.FC<AuctionSoundProps> = ({ isActive, hasNewBid, hasApplause }) => {
  const chatterRef = useRef<HTMLAudioElement | null>(null);
  const applauseRef = useRef<HTMLAudioElement | null>(null);
  const bidSuccessRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    chatterRef.current = new Audio('/sounds/crowd-chatter.mp3');
    applauseRef.current = new Audio('/sounds/applause.mp3');
    bidSuccessRef.current = new Audio('/sounds/bid-success.mp3');

    // Set audio properties
    if (chatterRef.current) {
      chatterRef.current.loop = true;
      chatterRef.current.volume = 0.3;
    }
    if (applauseRef.current) {
      applauseRef.current.volume = 0.5;
    }
    if (bidSuccessRef.current) {
      bidSuccessRef.current.volume = 0.4;
    }

    return () => {
      // Cleanup audio elements
      if (chatterRef.current) {
        chatterRef.current.pause();
        chatterRef.current = null;
      }
      if (applauseRef.current) {
        applauseRef.current.pause();
        applauseRef.current = null;
      }
      if (bidSuccessRef.current) {
        bidSuccessRef.current.pause();
        bidSuccessRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Handle crowd chatter
    if (chatterRef.current) {
      if (isActive) {
        chatterRef.current.play().catch(error => console.log('Audio play failed:', error));
      } else {
        chatterRef.current.pause();
      }
    }
  }, [isActive]);

  useEffect(() => {
    // Handle applause
    if (applauseRef.current && hasApplause) {
      applauseRef.current.currentTime = 0;
      applauseRef.current.play().catch(error => console.log('Audio play failed:', error));
    }
  }, [hasApplause]);

  useEffect(() => {
    // Handle bid success
    if (bidSuccessRef.current && hasNewBid) {
      bidSuccessRef.current.currentTime = 0;
      bidSuccessRef.current.play().catch(error => console.log('Audio play failed:', error));
    }
  }, [hasNewBid]);

  return null; // This component doesn't render anything
};

export default AuctionSound; 