// Utility functions for handling MongoDB GridFS images

/**
 * Get the correct image URL based on the imageUrl format
 * @param imageUrl - The image identifier
 * @param baseUrl - Base URL for the API
 * @param includeAuth - Whether to include auth token as query param for authenticated endpoints
 */
export const getImageUrl = (imageUrl: string, baseUrl: string = 'http://localhost:8080', includeAuth: boolean = true): string => {
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  let url = '';
  
  // If it's a MongoDB ObjectId (24 hex characters), use GridFS endpoint
  if (imageUrl.match(/^[0-9a-fA-F]{24}$/)) {
    url = `${baseUrl}/api/files/${imageUrl}`;
  }
  // If it looks like a UUID or other ID format
  else if (imageUrl.includes('-')) {
    url = `${baseUrl}/api/images/${imageUrl}`;
  }
  // Default to files endpoint
  else {
    url = `${baseUrl}/api/files/${imageUrl}`;
  }
  
  // Add auth token if needed and available
  if (includeAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}token=${encodeURIComponent(token)}`;
    }
  }
  
  return url;
};

/**
 * Try multiple endpoints to load image
 */
export const tryImageEndpoints = async (imageId: string, baseUrl: string = 'http://localhost:8080'): Promise<string> => {
  const endpoints = [
    `${baseUrl}/api/files/${imageId}`,
    `${baseUrl}/api/images/${imageId}`,
    `${baseUrl}/api/gridfs/${imageId}`,
    `${baseUrl}/files/${imageId}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ Found image at: ${endpoint}`);
        return endpoint;
      }    } catch {
      console.log(`❌ Failed to load image from: ${endpoint}`);
    }
  }

  console.warn(`⚠️ No valid endpoint found for image: ${imageId}`);
  return 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop'; // Fallback
};

/**
 * Check if an image URL is accessible
 */
export const isImageAccessible = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get fallback image based on NFT category
 */
export const getFallbackImage = (category?: string): string => {
  const fallbacks = {
    'Digital Art': 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=500&fit=crop',
    'Abstract': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop',
    '3D Art': 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=500&fit=crop',
    'Cyberpunk': 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400&h=500&fit=crop',
    'Contemporary': 'https://images.unsplash.com/photo-1579965342575-15475c126358?w=400&h=500&fit=crop',
    'Surreal': 'https://images.unsplash.com/photo-1544967882-2d4d2cb2c97c?w=400&h=500&fit=crop',
  };

  return fallbacks[category as keyof typeof fallbacks] || fallbacks['Digital Art'];
};

/**
 * Get authenticated image URL with proper headers
 */
export const getAuthenticatedImageUrl = (imageId: string, baseUrl: string = 'http://localhost:8080'): string => {
  return getImageUrl(imageId, baseUrl, true);
};

/**
 * Get public image URL without authentication
 */
export const getPublicImageUrl = (imageId: string, baseUrl: string = 'http://localhost:8080'): string => {
  return getImageUrl(imageId, baseUrl, false);
};

/**
 * Create image element with proper authentication
 */
export const createAuthenticatedImage = (imageId: string, onLoad?: () => void, onError?: () => void): HTMLImageElement => {
  const img = new Image();
  const token = localStorage.getItem('auth_token');
  
  // If we have a token, use fetch with Authorization header instead of direct img src
  if (token) {
    fetch(getPublicImageUrl(imageId), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error(`HTTP ${response.status}`);
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      img.src = objectURL;
      if (onLoad) onLoad();
    })
    .catch(error => {
      console.error('Failed to load authenticated image:', error);
      if (onError) onError();
    });
  } else {
    // No token, try public access
    img.src = getPublicImageUrl(imageId);
    if (onLoad) img.onload = onLoad;
    if (onError) img.onerror = onError;
  }
  
  return img;
};
