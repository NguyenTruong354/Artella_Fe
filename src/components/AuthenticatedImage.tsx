import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    const loadImage = async () => {
      try {        // Multiple endpoints to try (based on your new backend controller)
        const endpoints = [
          `http://localhost:8080/api/public/nft-images/${imageId}`, // New public NFT endpoint (preferred)
          `http://localhost:8080/api/files/${imageId}`,            // Primary GridFS endpoint
          `http://localhost:8080/api/images/${imageId}`,           // Alternative endpoint
          `http://localhost:8080/api/gridfs/${imageId}`,           // GridFS specific endpoint
        ];

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            const testResponse = await fetch(endpoint, { method: 'HEAD' });
            
            if (testResponse.ok) {
              console.log(`✅ Found image at: ${endpoint}`);
              
              if (isMounted) {
                setImageSrc(endpoint);
                setIsLoading(false);
                onLoad?.();
              }
              return;
            }
          } catch (endpointError) {
            console.log(`❌ Failed endpoint: ${endpoint}`, endpointError);
            continue; // Try next endpoint
          }
        }

        // If all endpoints fail, use fallback image
        throw new Error('No valid endpoint found for image');

      } catch (error) {
        console.error('Failed to load image from all endpoints:', error);
        
        if (isMounted) {
          setImageSrc(getFallbackImage(fallbackCategory));
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }
      }
    };    loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [imageId, fallbackCategory, onLoad, onError]);

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
      onError={() => {
        if (!hasError) {
          setImageSrc(getFallbackImage(fallbackCategory));
          setHasError(true);
          onError?.();
        }
      }}
    />
  );
};

export default SmartImage;
