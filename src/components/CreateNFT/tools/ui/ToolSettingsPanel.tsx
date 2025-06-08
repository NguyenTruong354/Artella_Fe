import React from 'react';
import { ToolFactory } from '../ToolFactory';
import { CreationState, ToolSettings } from '../../types';
import { ToolProps } from '../types'; // Import ToolProps for its settings definition

interface ToolSettingsPanelProps {
  toolId: string;
  settings: ToolSettings; // This is the flat structure from ../../types
  onSettingsChange: (newSettings: Partial<ToolSettings>) => void;
  className?: string;
  compact?: boolean;
}

export const ToolSettingsPanel: React.FC<ToolSettingsPanelProps> = ({
  toolId,
  settings, // These are the FLAT settings from the parent component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSettingsChange: onFlatSettingsChange, // Renamed for clarity: this expects FLAT Partial<ToolSettings>
  className = '',
  compact = false
}) => {
  // TODO: CRITICAL - To make settings updates functional, the following are needed:
  // 1. `ToolProps` (in `../types.ts`) needs an `onSettingsChange?: (structuredUpdate: Partial<ToolProps['settings']>) => void;` callback.
  // 2. `ToolFactory.createToolInstance` must accept this callback and pass it to tool instances.
  //    (e.g., toolInstance = ToolFactory.createToolInstance(toolId, { ..., onSettingsChange: handleStructuredSettingsChange }) )
  // 3. Individual tools' settings UI (e.g., SizeSlider, ColorPicker used within a tool's render method)
  //    must call `this.props.onSettingsChange(structuredUpdate)` when a setting changes.
  // 4. This panel then needs a handler function, `handleStructuredSettingsChange`, which will:
  //    a. Accept `structuredUpdate: Partial<ToolProps['settings']>`.
  //    b. Transform this `structuredUpdate` back into a `flatUpdate: Partial<ToolSettings>`.
  //       This involves mapping all fields, including flattening nested options like
  //       `gradientOptions`, `patternOptions` (and its sub-objects like `wood`, `stone`), etc.
  //    c. Call `onFlatSettingsChange(flatUpdate)` to notify the parent.
  // 5. The destructuring below and the `structuredSettings` object need to be comprehensive
  //    to include ALL specific tool options (e.g., patternOptions.wood.woodType, stoneType, roughness, etc.)
  //    This requires that the flat `settings` prop (type ToolSettings from `../../types`)
  //    actually contains these fields, and they are destructured here.

  const {
    // Basic settings
    size,
    color,
    opacity, // General opacity for brush, text, shapes, and can be a default for gradients/patterns

    // Text-specific (example, if they were flat)
    // textValue,
    fontFamily,
    fontSize,

    // Shape-specific (example, if they were flat)
    // shapeType,
    strokeWidth,
    // fillType, // (e.g., 'solid', 'gradient', 'pattern')

    // Gradient-specific (flat representation)
    gradientType,
    gradientColors, // Array of { color: string, position: number }
    gradientAngle,
    // gradientOpacity is covered by general opacity for now in structuredSettings

    // Pattern-specific (flat representation)
    patternType,
    patternScale,
    // patternOpacity is covered by general opacity for now in structuredSettings
    // Detailed flat pattern props (examples, assuming they exist in ToolSettings from ../../types)
    // woodType, grainDirection, woodPatternIntensity,
    // stoneType, roughness, addCracks, stonePatternIntensity,
    // fabricType, weaveDensity, fabricPatternIntensity,

    // Symmetry-specific (flat representation)
    symmetryType,
    symmetryPoints, // For radial
    symmetryAxis,   // For custom axis {x, y}
    // showSymmetryAxis, // UI toggle, not a core setting for the tool logic itself usually

  } = settings;

  // Transform flat settings to the structured format expected by ToolProps['settings']
  const structuredSettings: ToolProps['settings'] = {
    size,
    color,
    opacity, // General opacity

    // Text settings
    ...(fontFamily && { fontFamily }),
    ...(fontSize !== undefined && { fontSize }),
    // ...(textValue && { textValue }), // if applicable

    // Shape settings
    // ...(shapeType && { shapeType }), // if applicable
    ...(strokeWidth !== undefined && { strokeWidth }),

    gradientOptions: (gradientType || gradientColors || gradientAngle !== undefined)
      ? {
          type: gradientType || 'linear',
          colors: gradientColors || [],
          angle: gradientAngle,
          opacity: opacity !== undefined ? opacity : 1, // Default to general opacity
        }
      : undefined,

    patternOptions: (patternType || patternScale !== undefined)
      ? {
          type: patternType || 'wood', // Default type
          scale: patternScale || 1,
          opacity: opacity !== undefined ? opacity : 1, // Default to general opacity
          color: color, // Pass main color as a base/tint for the pattern
          // TODO: Map specific flat pattern settings (woodType, stoneType, etc.) to nested structured options
          // e.g., wood: { woodType: settings.woodType, grainDirection: settings.grainDirection }
          // This requires `settings` (flat) to have these properties and for them to be destructured above.
          // Example (assuming flat settings like settings.woodType exist):
          // wood: settings.woodType ? { woodType: settings.woodType, grainDirection: settings.grainDirection, patternIntensity: settings.woodPatternIntensity } : undefined,
          // stone: settings.stoneType ? { stoneType: settings.stoneType, roughness: settings.roughness, addCracks: settings.addCracks, patternIntensity: settings.stonePatternIntensity } : undefined,
          // fabric: settings.fabricType ? { fabricType: settings.fabricType, weaveDensity: settings.weaveDensity, patternIntensity: settings.fabricPatternIntensity } : undefined,
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
  };

  // Placeholder for the function that would handle updates from the tool's UI
  // const handleStructuredSettingsChange = (structuredUpdate: Partial<ToolProps['settings']>) => {
  //   // TODO: Implement transformation from structuredUpdate to flatUpdate
  //   // const flatUpdate: Partial<ToolSettings> = {};
  //   // ... map fields ...
  //   // e.g., if (structuredUpdate.size !== undefined) flatUpdate.size = structuredUpdate.size;
  //   // if (structuredUpdate.patternOptions) {
  //   //   flatUpdate.patternType = structuredUpdate.patternOptions.type;
  //   //   flatUpdate.patternScale = structuredUpdate.patternOptions.scale;
  //   //   if (structuredUpdate.patternOptions.wood) {
  //   //      flatUpdate.woodType = structuredUpdate.patternOptions.wood.woodType;
  //   //      ...
  //   //   }
  //   // }
  //   // onFlatSettingsChange(flatUpdate);
  // };

  const toolInstance = ToolFactory.createToolInstance(toolId, {
    creationState: {} as CreationState, // Mocked for UI rendering
    onStateUpdate: () => {},          // Mocked
    canvasRef: { current: document.createElement('canvas') }, // Mocked
    settings: structuredSettings, // Pass the transformed settings
    // onSettingsChange: handleStructuredSettingsChange, // This would be passed if the system was complete
  });

  if (!toolInstance) {
    return (
      <div className={`tool-settings-panel ${className}`}>
        <div className={`${compact ? 'p-2' : 'p-4'} bg-white rounded-lg shadow-lg`}>
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
            No settings available for this tool.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`tool-settings-panel ${className}`}>
      <div className={`bg-white rounded-lg shadow-lg ${compact ? 'max-h-40 p-2' : 'max-h-80'} overflow-y-auto`}>
        {/* The tool's own settings UI should call its props.onSettingsChange when a value changes */}
        {toolInstance.render?.() || <div className="p-2 text-xs text-gray-500">No specific settings UI for this tool.</div>}
      </div>
    </div>
  );
};
