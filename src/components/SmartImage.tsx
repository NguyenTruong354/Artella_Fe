import React, { useState, useEffect, useRef } from 'react';
import { getFallbackImage } from '../utils/imageUtils';

// Global cache for storing successful endpoint patterns by image ID prefix
// This will help avoid redundant HEAD requests for similar image IDs
const endpointPatternCache: Record<string, string> = {};

// Image source URL cache to avoid redundant fetches
const imageSrcCache: Record<string, string> = {};

interface SmartImageProps {
  imageId: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // Add priority flag for critical images
  lazyLoad?: boolean; // Add option to lazy load images
}

const SmartImage: React.FC<SmartImageProps> = ({
  imageId,
  alt,
  className = '',
  fallbackCategory,
  onLoad,
  onError,
  priority = false,
  lazyLoad = true
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const currentBlobUrlRef = useRef<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    // Check cache first
    if (imageSrcCache[imageId]) {
      setImageSrc(imageSrcCache[imageId]);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
      return;
    }

    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }

    // Use IntersectionObserver for lazy loading
    if (lazyLoad && !priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadImage();
            if (imgRef.current) observer.unobserve(imgRef.current);
          }
        },
        { rootMargin: '200px' } // Start loading when image is 200px from viewport
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => {
        if (imgRef.current) observer.unobserve(imgRef.current);
      };
    } else {
      // Load immediately for priority images
      loadImage();
    }

    async function loadImage() {
      if (!isMounted) return;

      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Check if we've previously found a successful pattern for this type of ID
      // Extract first 8 chars as a pattern identifier since MongoDB ObjectIds often share prefixes
      const idPrefix = imageId.substring(0, 8);
      
      let chosenEndpoint: string | null = null;
      
      // If we know which endpoint pattern works for this ID prefix, try it directly
      if (endpointPatternCache[idPrefix]) {
        const patternUrl = endpointPatternCache[idPrefix].replace('{id}', imageId);
        try {
          const response = await fetch(patternUrl, { headers });
          if (response.ok) {
            chosenEndpoint = patternUrl;
          }
        } catch (error) {
          // If the cached pattern fails, fall back to trying all endpoints
        }
      }
      
      // If no cached pattern or pattern failed, try all endpoints
      if (!chosenEndpoint) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const endpoints = [
          `${baseUrl}/api/public/nft-images/${imageId}`,
          `${baseUrl}/api/files/${imageId}`,
          `${baseUrl}/api/images/${imageId}`,
          `${baseUrl}/api/gridfs/${imageId}`,
        ];

        // Try HEAD requests in parallel instead of sequentially
        try {
          const headPromises = endpoints.map(endpoint => 
            fetch(endpoint, { method: 'HEAD', headers })
              .then(response => ({ endpoint, ok: response.ok }))
              .catch(() => ({ endpoint, ok: false }))
          );
          
          const results = await Promise.all(headPromises);
          const successfulEndpoint = results.find(result => result.ok);
          
          if (successfulEndpoint) {
            chosenEndpoint = successfulEndpoint.endpoint;
            // Save this successful pattern for future use
            const pattern = chosenEndpoint.replace(imageId, '{id}');
            endpointPatternCache[idPrefix] = pattern;
          }
        } catch (error) {
          console.error('Error checking endpoints:', error);
        }
      }

      if (!isMounted) return;

      // If a viable endpoint was found, try to GET the full image from it
      if (chosenEndpoint) {
        try {
          const imageResponse = await fetch(chosenEndpoint, { headers });
          
          if (!imageResponse.ok) {
            throw new Error(`Failed to GET image data (status: ${imageResponse.status})`);
          }
          
          if (!isMounted) return;

          const blob = await imageResponse.blob();
          const newBlobUrl = URL.createObjectURL(blob);

          if (currentBlobUrlRef.current) {
              URL.revokeObjectURL(currentBlobUrlRef.current);
          }
          currentBlobUrlRef.current = newBlobUrl;

          // Store in cache for future use
          imageSrcCache[imageId] = newBlobUrl;

          setImageSrc(newBlobUrl);
          setIsLoading(false);
          setHasError(false);
          onLoad?.();
        } catch (error) {
          if (!isMounted) return;
          setImageSrc(getFallbackImage(fallbackCategory));
          setIsLoading(false);
          setHasError(true);
          onError?.();
        }
      } else {
        if (!isMounted) return;
        setImageSrc(getFallbackImage(fallbackCategory));
        setIsLoading(false);
        setHasError(true);
        onError?.();
      }
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (currentBlobUrlRef.current && !imageSrcCache[imageId]) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, [imageId, fallbackCategory, onLoad, onError, priority, lazyLoad]);

  if (isLoading) {
    return (
      <div 
        ref={imgRef as React.RefObject<HTMLDivElement>}
        className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center`}
      >
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      crossOrigin="anonymous"
      loading={lazyLoad && !priority ? "lazy" : "eager"}
      onError={() => {
        if (!hasError && imageSrc !== getFallbackImage(fallbackCategory)) {
          setImageSrc(getFallbackImage(fallbackCategory));
          setHasError(true);
        }
      }}
    />
  );
};

export default SmartImage;
