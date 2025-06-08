import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
  compact?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  className = '',
  compact = false
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const basicColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
    '#90EE90', '#FFB6C1', '#20B2AA', '#87CEEB', '#DDA0DD'
  ];

  const recentColors = JSON.parse(localStorage.getItem('recentColors') || '[]').slice(0, 10);

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    
    // Add to recent colors
    const recent = JSON.parse(localStorage.getItem('recentColors') || '[]');
    const newRecent = [color, ...recent.filter((c: string) => c !== color)].slice(0, 10);
    localStorage.setItem('recentColors', JSON.stringify(newRecent));
  };
  return (
    <div className={`color-picker ${className}`}>
      {compact ? (
        // Compact inline layout
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {basicColors.slice(0, 8).map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorSelect(color)}
                className={`
                  w-6 h-6 rounded border-2 cursor-pointer
                  ${selectedColor === color ? 'border-purple-500' : 'border-gray-300'}
                `}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="w-8 h-6 rounded border cursor-pointer"
            title="Custom color"
          />
        </div>
      ) : (
        // Full layout
        <div className="p-3 bg-white rounded-lg shadow-lg">
          {/* Current Color Display */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedColor.toUpperCase()}
            </span>
          </div>

          {/* Custom Color Input */}
          <div className="mb-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 rounded border cursor-pointer"
            />
          </div>

          {/* Basic Colors Grid */}
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Basic Colors</h4>
            <div className="grid grid-cols-5 gap-1">
              {basicColors.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`
                    w-8 h-8 rounded border-2 cursor-pointer
                    ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}
                  `}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">Recent Colors</h4>
              <div className="flex gap-1 flex-wrap">
                {recentColors.map((color: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => handleColorSelect(color)}
                    className={`
                      w-6 h-6 rounded border-2 cursor-pointer
                      ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}
                    `}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Advanced Color Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {/* Advanced Color Options */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200"
            >
              <div className="space-y-3">
                {/* HSL Sliders */}
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Hue</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    className="w-full"
                    onChange={(e) => {
                      const hue = parseInt(e.target.value);
                      const color = `hsl(${hue}, 70%, 50%)`;
                      // Convert HSL to hex and update
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.fillStyle = color;
                        handleColorSelect(ctx.fillStyle as string);
                      }
                    }}
                  />
                </div>

                {/* Opacity Slider */}
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="100"
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
