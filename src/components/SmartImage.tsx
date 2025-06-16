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
    setHasError(false);    const loadImage = async () => {
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
          `http://localhost:8080/api/public/nft-images/${imageId}`, // New public NFT endpoint (preferred)
          `http://localhost:8080/api/files/${imageId}`,            // Primary GridFS endpoint
          `http://localhost:8080/api/images/${imageId}`,           // Alternative endpoint
          `http://localhost:8080/api/gridfs/${imageId}`,           // GridFS specific endpoint
        ];

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint} ${token ? 'with token' : 'without token'}`);
            
            // Make authenticated HEAD request
            const testResponse = await fetch(endpoint, { 
              method: 'HEAD',
              headers: headers
            });
            
            if (testResponse.ok) {
              console.log(`✅ Found image at: ${endpoint}`);
              
              if (isMounted) {
                // Add token as query parameter for img src
                const finalUrl = token 
                  ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
                  : endpoint;
                
                setImageSrc(finalUrl);
                setIsLoading(false);
                onLoad?.();
                return; // Successfully found an image, exit the loop
              }
            } else {
              console.log(`❌ Endpoint returned status ${testResponse.status}: ${endpoint}`);
            }
          } catch (endpointError) {
            console.log(`❌ Endpoint failed: ${endpoint}`, endpointError);
            // Continue to next endpoint
          }
        }
        
        // If we get here, none of the endpoints worked
        throw new Error('No valid endpoints found for image');
        
      } catch (error) {
        console.error('All image endpoints failed:', error);
        
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
    };
  }, [imageId, fallbackCategory, onLoad, onError]);
  // Add token to URL if we have one and it's not already in the URL
  useEffect(() => {
    if (!imageSrc || imageSrc.includes('token=') || imageSrc.startsWith('data:') || hasError) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (token && !imageSrc.includes('?token=') && !imageSrc.includes('&token=')) {
      const separator = imageSrc.includes('?') ? '&' : '?';
      setImageSrc(`${imageSrc}${separator}token=${encodeURIComponent(token)}`);
    }
  }, [imageSrc, hasError]);

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
      crossOrigin="anonymous" // Add crossOrigin to handle CORS
      onError={() => {
        if (!hasError) {
          console.log('❌ Image failed to load:', imageSrc);
          setImageSrc(getFallbackImage(fallbackCategory));
          setHasError(true);
          onError?.();
        }
      }}
    />
  );
};

export default SmartImage;
