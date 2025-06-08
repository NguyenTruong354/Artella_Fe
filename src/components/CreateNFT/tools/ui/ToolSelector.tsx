import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolFactory } from '../ToolFactory';
import { 
  Brush, 
  Eraser, 
  Type, 
  Square, 
  Palette, 
  TreePine, 
  Mountain, 
  Grid3X3, 
  RotateCcw,
  MoreHorizontal, // Added for "More tools" icon
  ChevronUp       // Added for "Show less tools" icon
} from 'lucide-react';

interface ToolSelectorProps {
  selectedToolId: string;
  onToolSelect: (toolId: string) => void;
  className?: string;
  compact?: boolean;
}

interface IconProps {
  size?: number;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  brush: Brush,
  eraser: Eraser,
  type: Type,
  square: Square,
  'linear-gradient': Palette,
  'radial-gradient': Palette,
  'conic-gradient': Palette,
  'tree-pine': TreePine,
  mountain: Mountain,
  'grid-3x3': Grid3X3,
  'rotate-ccw': RotateCcw,
};

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedToolId,
  onToolSelect,
  className = '',
  compact = false 
}) => {
  const tools = ToolFactory.getAllToolDefinitions();
  const categories = ['core', 'gradient', 'pattern', 'symmetry'];
  
  // Internal state to manage if the view is currently compact or expanded
  // Initialize based on the 'compact' prop.
  const [isCurrentlyCompact, setIsCurrentlyCompact] = useState(compact);

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Brush;
  };

  const handleShowMoreTools = () => {
    setIsCurrentlyCompact(false); // Switch to full view
  };

  const handleShowLessTools = () => {
    setIsCurrentlyCompact(true); // Switch back to compact view
  };

  return (
    <div className={`tool-selector ${className}`}>
      {isCurrentlyCompact ? (
        // Compact horizontal layout
        <div className="flex gap-1">
          {tools.filter(tool => tool.category === 'core').map(tool => {
            const IconComponent = getIconComponent(tool.icon);
            const isSelected = selectedToolId === tool.id;

            return (
              <motion.button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`
                  p-2 rounded transition-all
                  ${isSelected 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={tool.name}
              >
                <IconComponent size={16} />
              </motion.button>
            );
          })}
          
          {/* Show more tools button if it was initially compact and there are other categories */}
          {compact && tools.some(tool => tool.category !== 'core') && (
            <motion.button
              className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="More tools"
              onClick={handleShowMoreTools}
            >
              <MoreHorizontal size={16} /> {/* Changed icon */}
            </motion.button>
          )}
        </div>
      ) : (
        // Full layout
        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* "Show less" button if it was initially compact and now expanded */}
          {compact && (
            <motion.button 
              onClick={handleShowLessTools}
              className="self-start mb-2 p-1.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Show less tools"
            >
              <ChevronUp size={14} />
              <span>Less Tools</span>
            </motion.button>
          )}
          {categories.map(category => {
            const categoryTools = tools.filter(tool => tool.category === category);
            
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} className="category-section">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"> {/* Adjusted heading color */}
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"> {/* Made grid responsive */}
                  {categoryTools.map(tool => {
                    const IconComponent = getIconComponent(tool.icon);
                    const isSelected = selectedToolId === tool.id;

                    return (
                      <motion.button
                        key={tool.id}
                        onClick={() => onToolSelect(tool.id)}
                        className={`
                          flex flex-col items-center gap-1 p-3 rounded-lg transition-all
                          ${isSelected 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600' // Adjusted colors for dark mode
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={tool.description}
                      >
                        <IconComponent size={20} />
                        <span className="text-xs text-center leading-tight">
                          {tool.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
