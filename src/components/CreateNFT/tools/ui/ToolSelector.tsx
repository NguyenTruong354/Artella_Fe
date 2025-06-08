import React from 'react';
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
  RotateCcw 
} from 'lucide-react';

interface ToolSelectorProps {
  selectedToolId: string;
  onToolSelect: (toolId: string) => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
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
  className = ''
}) => {
  const tools = ToolFactory.getAllToolDefinitions();
  const categories = ['core', 'gradient', 'pattern', 'symmetry'];

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Brush;
  };

  return (
    <div className={`tool-selector ${className}`}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
        {categories.map(category => {
          const categoryTools = tools.filter(tool => tool.category === category);
          
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
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
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
    </div>
  );
};
