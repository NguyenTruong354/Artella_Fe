import React from 'react';
import { ToolFactory } from '../ToolFactory';
import { CreationState, ToolSettings } from '../../types';
import { ToolProps } from '../types'; // Import ToolProps for its settings definition

interface ToolSettingsPanelProps {
  toolId: string;
  settings: ToolSettings; // This is the flat structure from ../../types
  onSettingsChange: (newSettings: Partial<ToolSettings>) => void; // Make onSettingsChange more specific
  className?: string;
}

export const ToolSettingsPanel: React.FC<ToolSettingsPanelProps> = ({
  toolId,
  settings,
  // onSettingsChange, // onSettingsChange is passed down, not used directly here for this fix
  className = ''
}) => {
  const {
    size,
    color,
    opacity,
    strokeWidth,
    fontFamily,
    fontSize,
    gradientType,
    gradientColors,
    gradientAngle,
    patternType,
    patternScale,
    symmetryType,
    symmetryPoints,
    symmetryAxis,
  } = settings;

  const structuredSettings: ToolProps['settings'] = {
    size,
    color,
    opacity, // General opacity

    gradientOptions: (gradientType || gradientColors || gradientAngle !== undefined)
      ? {
          type: gradientType || 'linear',
          colors: gradientColors || [],
          angle: gradientAngle,
          opacity: opacity !== undefined ? opacity : 1, // Use global opacity or default
        }
      : undefined,

    patternOptions: (patternType || patternScale !== undefined)
      ? {
          type: patternType || 'wood',
          scale: patternScale || 1,
          opacity: opacity !== undefined ? opacity : 1, // Use global opacity or default
          // color: color, // Optional: pass main color to pattern if needed by tools
        }
      : undefined,

    symmetryOptions: (symmetryType || symmetryPoints !== undefined || symmetryAxis)
      ? {
          type: symmetryType || 'bilateral',
          points: symmetryPoints,
          axis: symmetryAxis,
          enabled: true, // If any symmetry setting is present, assume enabled for panel display
        }
      : undefined,
    
    // Include other top-level settings from ToolSettings if they are expected in ToolProps['settings']
    // For example, if shapeType were part of the flat ToolSettings, it would be mapped here.
    // The index signature in ToolProps['settings'] allows for additional properties.
    ...(strokeWidth !== undefined && { strokeWidth }),
    ...(fontFamily && { fontFamily }),
    ...(fontSize !== undefined && { fontSize }),
  };

  // Create a tool instance to get its settings UI
  const toolInstance = ToolFactory.createToolInstance(toolId, {
    creationState: {} as CreationState, // Mocked for UI rendering
    onStateUpdate: () => {},          // Mocked
    canvasRef: { current: document.createElement('canvas') }, // Mocked
    settings: structuredSettings, // Pass the transformed settings
  });

  if (!toolInstance) {
    return (
      <div className={`tool-settings-panel ${className}`}>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <div className="text-sm text-gray-500">
            No settings available for this tool
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`tool-settings-panel ${className}`}>
      <div className="bg-white rounded-lg shadow-lg max-h-80 overflow-y-auto">
        {toolInstance.render?.() || <div>No settings available</div>}
      </div>
    </div>
  );
};
