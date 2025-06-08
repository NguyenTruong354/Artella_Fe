import React from 'react';

interface SizeSliderProps {
  size: number;
  onSizeChange: (size: number) => void;
  min?: number;
  max?: number;
  className?: string;
  compact?: boolean;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({
  size,
  onSizeChange,
  min = 1,
  max = 100,
  className = '',
  compact = false
}) => {  return (
    <div className={`size-slider ${className}`}>
      {compact ? (
        // Compact inline layout
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-8 text-right">{size}</span>
        </div>
      ) : (
        // Full layout
        <div className="p-3 bg-white rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-700 w-8">Size</span>
            <div className="flex-1">
              <input
                type="range"
                min={min}
                max={max}
                value={size}
                onChange={(e) => onSizeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span className="text-sm text-gray-600 w-8 text-right">{size}</span>
          </div>
          
          {/* Visual Size Preview */}
          <div className="flex justify-center mt-2">
            <div
              className="bg-gray-700 rounded-full"
              style={{
                width: `${Math.min(size, 50)}px`,
                height: `${Math.min(size, 50)}px`
              }}
            />
          </div>

          {/* Preset Sizes */}
          <div className="mt-3">
            <div className="text-xs text-gray-600 mb-2">Quick Sizes</div>
            <div className="flex gap-2 justify-center">
              {[2, 5, 10, 20, 30, 50].map(presetSize => (
                <button
                  key={presetSize}
                  onClick={() => onSizeChange(presetSize)}
                  className={`
                    px-2 py-1 text-xs rounded border transition-colors
                    ${size === presetSize 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {presetSize}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
