import React from 'react';
import SmartImage from './SmartImage';

interface SmartImageGridProps {
  imageIds: string[];
  alt: string;
  className?: string;
  fallbackCategory?: string;
  maxImages?: number;
  showCount?: boolean;
}

const SmartImageGrid: React.FC<SmartImageGridProps> = ({
  imageIds,
  alt,
  className = '',
  fallbackCategory,
  maxImages = 4,
  showCount = true
}) => {
  if (!imageIds || imageIds.length === 0) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">No images</span>
      </div>
    );
  }

  const displayImages = imageIds.slice(0, maxImages);
  const remainingCount = Math.max(0, imageIds.length - maxImages);

  if (displayImages.length === 1) {
    return (
      <SmartImage
        imageId={displayImages[0]}
        alt={alt}
        className={className}
        fallbackCategory={fallbackCategory}
      />
    );
  }

  return (
    <div className={`${className} relative`}>
      <div className="grid grid-cols-2 gap-0.5 h-full">
        {displayImages.map((imageId, index) => (
          <div
            key={imageId}
            className={`relative ${
              index === 0 && displayImages.length === 3 ? 'col-span-2' : ''
            } ${
              index === displayImages.length - 1 && remainingCount > 0 ? 'relative' : ''
            }`}
          >
            <SmartImage
              imageId={imageId}
              alt={`${alt} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              fallbackCategory={fallbackCategory}
            />
            {index === displayImages.length - 1 && remainingCount > 0 && showCount && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartImageGrid;
