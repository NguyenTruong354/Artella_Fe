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
  onSettingsChange: onFlatSettingsChange, // Renamed for clarity: this expects FLAT Partial<ToolSettings>
  className = '',
  compact = false
}) => {
  // Settings transformation and change handling system is now implemented:
  const {
    // Basic settings
    size,
    color,
    opacity,

    // Text-specific settings
    fontFamily,
    fontSize,

    // Shape-specific settings
    shapeType,
    strokeWidth,
    filled,

    // Gradient-specific (flat representation)
    gradientType,
    gradientColors,
    gradientAngle,

    // Pattern-specific (flat representation)
    patternType,
    patternScale,
    // Wood pattern specific
    woodType,
    grainDirection,
    woodPatternIntensity,
    // Stone pattern specific
    stoneType,
    roughness,
    addCracks,
    weathered,
    stonePatternIntensity,
    // Fabric pattern specific
    fabricType,
    weaveDensity,
    colorVariation,
    showWarp,
    showWeft,
    fabricPatternIntensity,

    // Symmetry-specific (flat representation)
    symmetryType,
    symmetryPoints,
    symmetryAxis,

  } = settings;
  // Transform flat settings to the structured format expected by ToolProps['settings']
  const structuredSettings: ToolProps['settings'] = {
    size,
    color,
    opacity,

    // Text settings
    ...(fontFamily && { fontFamily }),
    ...(fontSize !== undefined && { fontSize }),

    // Shape settings
    ...(shapeType && { shapeType }),
    ...(strokeWidth !== undefined && { strokeWidth }),
    ...(filled !== undefined && { filled }),

    gradientOptions: (gradientType || gradientColors || gradientAngle !== undefined)
      ? {
          type: gradientType || 'linear',
          colors: gradientColors || [],
          angle: gradientAngle,
          opacity: opacity !== undefined ? opacity : 1,
        }
      : undefined,

    patternOptions: (patternType || patternScale !== undefined)
      ? {
          type: patternType || 'wood',
          scale: patternScale || 1,
          opacity: opacity !== undefined ? opacity : 1,
          color: color,
          // Wood pattern specific options
          wood: (woodType || grainDirection || woodPatternIntensity !== undefined) 
            ? {
                woodType: woodType || 'oak',
                grainDirection: grainDirection || 'horizontal',
                patternIntensity: woodPatternIntensity || 0.8,
              }
            : undefined,
          // Stone pattern specific options
          stone: (stoneType || roughness !== undefined || addCracks !== undefined || weathered !== undefined || stonePatternIntensity !== undefined)
            ? {
                stoneType: stoneType || 'granite',
                roughness: roughness !== undefined ? roughness : 0.5,
                addCracks: addCracks !== undefined ? addCracks : false,
                weathered: weathered !== undefined ? weathered : false,
                patternIntensity: stonePatternIntensity || 0.8,
              }
            : undefined,
          // Fabric pattern specific options
          fabric: (fabricType || weaveDensity !== undefined || colorVariation !== undefined || showWarp !== undefined || showWeft !== undefined || fabricPatternIntensity !== undefined)
            ? {
                fabricType: fabricType || 'cotton',
                weaveDensity: weaveDensity !== undefined ? weaveDensity : 1,
                colorVariation: colorVariation !== undefined ? colorVariation : 0.3,
                showWarp: showWarp !== undefined ? showWarp : true,
                showWeft: showWeft !== undefined ? showWeft : true,
                patternIntensity: fabricPatternIntensity || 0.8,
              }
            : undefined,
        }
      : undefined,

    symmetryOptions: (symmetryType || symmetryPoints !== undefined || symmetryAxis)
      ? {
          type: symmetryType || 'bilateral',
          points: symmetryPoints,
          axis: symmetryAxis,
          enabled: true,
        }
      : undefined,
  };  // Handle structured settings changes from tool instances
  const handleStructuredSettingsChange = (structuredUpdate: Partial<ToolProps['settings']>) => {
    if (!structuredUpdate) return;
    
    const flatUpdate: Partial<ToolSettings> = {};

    // Map basic settings
    if (structuredUpdate.size !== undefined) flatUpdate.size = structuredUpdate.size;
    if (structuredUpdate.color !== undefined) flatUpdate.color = structuredUpdate.color;
    if (structuredUpdate.opacity !== undefined) flatUpdate.opacity = structuredUpdate.opacity;
    
    // Map text settings
    if (structuredUpdate.fontFamily !== undefined) flatUpdate.fontFamily = structuredUpdate.fontFamily;
    if (structuredUpdate.fontSize !== undefined) flatUpdate.fontSize = structuredUpdate.fontSize;
    
    // Map shape settings
    if (structuredUpdate.shapeType !== undefined) flatUpdate.shapeType = structuredUpdate.shapeType;
    if (structuredUpdate.strokeWidth !== undefined) flatUpdate.strokeWidth = structuredUpdate.strokeWidth;
    if (structuredUpdate.filled !== undefined) flatUpdate.filled = structuredUpdate.filled;

    // Map gradient settings
    if (structuredUpdate.gradientOptions) {
      const gradOpts = structuredUpdate.gradientOptions;
      if (gradOpts.type !== undefined) flatUpdate.gradientType = gradOpts.type;
      if (gradOpts.colors !== undefined) flatUpdate.gradientColors = gradOpts.colors;
      if (gradOpts.angle !== undefined) flatUpdate.gradientAngle = gradOpts.angle;
    }

    // Map pattern settings
    if (structuredUpdate.patternOptions) {
      const patOpts = structuredUpdate.patternOptions;
      if (patOpts.type !== undefined) flatUpdate.patternType = patOpts.type;
      if (patOpts.scale !== undefined) flatUpdate.patternScale = patOpts.scale;
      
      // Map wood pattern specific settings
      if (patOpts.wood) {
        if (patOpts.wood.woodType !== undefined) flatUpdate.woodType = patOpts.wood.woodType;
        if (patOpts.wood.grainDirection !== undefined) flatUpdate.grainDirection = patOpts.wood.grainDirection;
        if (patOpts.wood.patternIntensity !== undefined) flatUpdate.woodPatternIntensity = patOpts.wood.patternIntensity;
      }
      
      // Map stone pattern specific settings
      if (patOpts.stone) {
        if (patOpts.stone.stoneType !== undefined) flatUpdate.stoneType = patOpts.stone.stoneType;
        if (patOpts.stone.roughness !== undefined) flatUpdate.roughness = patOpts.stone.roughness;
        if (patOpts.stone.addCracks !== undefined) flatUpdate.addCracks = patOpts.stone.addCracks;
        if (patOpts.stone.weathered !== undefined) flatUpdate.weathered = patOpts.stone.weathered;
        if (patOpts.stone.patternIntensity !== undefined) flatUpdate.stonePatternIntensity = patOpts.stone.patternIntensity;
      }
      
      // Map fabric pattern specific settings
      if (patOpts.fabric) {
        if (patOpts.fabric.fabricType !== undefined) flatUpdate.fabricType = patOpts.fabric.fabricType;
        if (patOpts.fabric.weaveDensity !== undefined) flatUpdate.weaveDensity = patOpts.fabric.weaveDensity;
        if (patOpts.fabric.colorVariation !== undefined) flatUpdate.colorVariation = patOpts.fabric.colorVariation;
        if (patOpts.fabric.showWarp !== undefined) flatUpdate.showWarp = patOpts.fabric.showWarp;
        if (patOpts.fabric.showWeft !== undefined) flatUpdate.showWeft = patOpts.fabric.showWeft;
        if (patOpts.fabric.patternIntensity !== undefined) flatUpdate.fabricPatternIntensity = patOpts.fabric.patternIntensity;
      }
    }

    // Map symmetry settings
    if (structuredUpdate.symmetryOptions) {
      const symOpts = structuredUpdate.symmetryOptions;
      if (symOpts.type !== undefined) flatUpdate.symmetryType = symOpts.type;
      if (symOpts.points !== undefined) flatUpdate.symmetryPoints = symOpts.points;
      if (symOpts.axis !== undefined) flatUpdate.symmetryAxis = symOpts.axis;
    }

    // Call the parent's flat settings change handler
    onFlatSettingsChange(flatUpdate);
  };
  const toolInstance = ToolFactory.createToolInstance(toolId, {
    creationState: {} as CreationState, // Mocked for UI rendering
    onStateUpdate: () => {},          // Mocked
    canvasRef: { current: document.createElement('canvas') }, // Mocked
    settings: structuredSettings, // Pass the transformed settings
    onSettingsChange: handleStructuredSettingsChange, // Pass the settings change handler
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
