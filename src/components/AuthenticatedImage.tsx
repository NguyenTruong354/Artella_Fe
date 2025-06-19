import React, { useState, useEffect } from 'react';
import { getFallbackImage } from '../utils/imageUtils';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    const loadImage = async () => {
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {};
        
        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Multiple endpoints to try (based on your new backend controller)
        const endpoints = [
          `${baseUrl}/api/public/nft-images/${imageId}`, 
          `${baseUrl}/api/files/${imageId}`,           
          `${baseUrl}/api/images/${imageId}`,         
          `${baseUrl}/api/gridfs/${imageId}`,           
        ];

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            
            // Make authenticated HEAD request with proper Authorization header
            const testResponse = await fetch(endpoint, { 
              method: 'HEAD',
              headers: headers
            });
            
            if (testResponse.ok) {
              console.log(`✅ Found image at: ${endpoint}`);
              
              if (isMounted) {
                // For authenticated images, use the fetch API with proper Authorization header
                if (token) {
                  try {
                    const response = await fetch(endpoint, { headers });
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    setBlobUrl(objectUrl);
                    setImageSrc(objectUrl);
                    setIsLoading(false);
                    onLoad?.();
                    return;
                  } catch (error) {
                    console.error('Error fetching image with authentication:', error);
                    // If fetching with auth fails, continue to next approach
                  }
                } else {
                  // No auth token, set direct URL
                  setImageSrc(endpoint);
                  setIsLoading(false);
                  onLoad?.();
                  return;
                }
              }
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
    };
      loadImage();

    // Cleanup function
    return () => {
      isMounted = false;
      // Revoke blob URL to prevent memory leaks
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imageId, fallbackCategory, onLoad, onError, blobUrl]);

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
