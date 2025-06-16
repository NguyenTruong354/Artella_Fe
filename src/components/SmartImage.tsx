import React, { useState, useEffect, useRef } from 'react';
import { getFallbackImage } from '../utils/imageUtils';

interface SmartImageProps {
  imageId: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  imageId,
  alt,
  className = '',
  fallbackCategory,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const currentBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }

    const loadImage = async () => {
      if (!isMounted) return;

      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const endpoints = [
        `http://localhost:8080/api/public/nft-images/${imageId}`,
        `http://localhost:8080/api/files/${imageId}`,
        `http://localhost:8080/api/images/${imageId}`,
        `http://localhost:8080/api/gridfs/${imageId}`,
      ];

      let chosenEndpoint: string | null = null;

      // 1. Find the first viable endpoint via HEAD
      for (const endpoint of endpoints) {
        if (!isMounted) return;
        try {
          console.log(`🔄 Trying HEAD for endpoint: ${endpoint} ${token ? 'with token' : 'without token'}`);
          const headResponse = await fetch(endpoint, { method: 'HEAD', headers });
          if (headResponse.ok) {
            console.log(`✅ HEAD OK for ${endpoint}. This is our candidate.`);
            chosenEndpoint = endpoint;
            break; // Found a viable endpoint
          } else {
            console.log(`❌ HEAD failed for ${endpoint} (status: ${headResponse.status})`);
          }
        } catch (headError) {
          console.log(`❌ Error during HEAD for ${endpoint}:`, headError);
        }
      }

      if (!isMounted) return;

      // 2. If a viable endpoint was found, try to GET the full image from it
      if (chosenEndpoint) {
        try {
          console.log(`Attempting to GET full image from ${chosenEndpoint}`);
          const imageResponse = await fetch(chosenEndpoint, { headers }); // Use same headers
          
          if (!imageResponse.ok) {
            throw new Error(`Failed to GET image data (status: ${imageResponse.status}) from ${chosenEndpoint}`);
          }
          
          if (!isMounted) return; // Check again before async blob operation

          const blob = await imageResponse.blob();
          const newBlobUrl = URL.createObjectURL(blob);

          if (currentBlobUrlRef.current) { // Should be null due to start-of-effect cleanup, but double-check
              URL.revokeObjectURL(currentBlobUrlRef.current);
          }
          currentBlobUrlRef.current = newBlobUrl;

          setImageSrc(newBlobUrl);
          setIsLoading(false);
          setHasError(false);
          onLoad?.();
          // Successfully loaded. loadImage implicitly ends.
        } catch (getFullImageError) {
          // Failed to GET from the chosen endpoint. This is a definitive failure.
          if (!isMounted) return;
          console.error(`❌ Failed to GET full image from chosen endpoint ${chosenEndpoint}:`, getFullImageError);
          setImageSrc(getFallbackImage(fallbackCategory));
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }
      } else {
        // No endpoint had a successful HEAD request.
        if (!isMounted) return;
        console.error('No endpoint had a successful HEAD request for imageId:', imageId);
        setImageSrc(getFallbackImage(fallbackCategory));
        setIsLoading(false);
        setHasError(true);
        onError?.();
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, [imageId, fallbackCategory, onLoad, onError]); // Dependencies are stable

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      crossOrigin="anonymous"
      onError={() => {
        // This onError on the img tag is a final fallback, 
        // but ideally our loadImage logic should handle errors before this.
        if (!hasError && imageSrc !== getFallbackImage(fallbackCategory)) { // Avoid loop if fallback itself fails
          console.log('❌ Native img onError triggered for:', imageSrc);
          setImageSrc(getFallbackImage(fallbackCategory));
          setHasError(true); // Ensure hasError is set
        }
      }}
    />
  );
};

export default SmartImage;
