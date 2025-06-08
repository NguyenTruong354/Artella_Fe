import { BrushTool } from './core/BrushTool';
import { EraserTool } from './core/EraserTool';
import { TextTool } from './core/TextTool';
import { ShapeTool } from './core/ShapeTool';
import { LinearGradientTool } from './gradient/LinearGradientTool';
import { RadialGradientTool } from './gradient/RadialGradientTool';
import { ConicGradientTool } from './gradient/ConicGradientTool';
import { WoodPatternTool } from './pattern/WoodPatternTool';
import { StonePatternTool } from './pattern/StonePatternTool';
import { FabricPatternTool } from './pattern/FabricPatternTool';
import { SymmetryTool } from './symmetry/SymmetryTool';
import { ToolProps, ToolHandler } from './types';

export interface ToolDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'core' | 'gradient' | 'pattern' | 'symmetry';
  description: string;
  component: new (props: ToolProps) => ToolHandler;
  defaultSettings?: Record<string, unknown>;
}

export class ToolRegistry {
  private static tools: Map<string, ToolDefinition> = new Map();

  static registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  static getTool(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  static getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  static getToolsByCategory(category: string): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  static initialize(): void {
    // Register Core Tools
    this.registerTool({
      id: 'brush',
      name: 'Brush',
      icon: 'brush',
      category: 'core',
      description: 'Draw freehand with various brush settings',
      component: BrushTool,
      defaultSettings: {
        opacity: 1,
        hardness: 1
      }
    });

    this.registerTool({
      id: 'eraser',
      name: 'Eraser',
      icon: 'eraser',
      category: 'core',
      description: 'Erase parts of your drawing',
      component: EraserTool,
      defaultSettings: {
        hardness: 0.8
      }
    });

    this.registerTool({
      id: 'text',
      name: 'Text',
      icon: 'type',
      category: 'core',
      description: 'Add text to your artwork',
      component: TextTool,
      defaultSettings: {
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'left'
      }
    });

    this.registerTool({
      id: 'shape',
      name: 'Shape',
      icon: 'square',
      category: 'core',
      description: 'Draw rectangles, circles and other shapes',
      component: ShapeTool,
      defaultSettings: {
        shapeType: 'rectangle',
        filled: false
      }
    });

    // Register Gradient Tools
    this.registerTool({
      id: 'linear-gradient',
      name: 'Linear Gradient',
      icon: 'linear-gradient',
      category: 'gradient',
      description: 'Apply linear gradients',
      component: LinearGradientTool,
      defaultSettings: {
        gradientColors: [
          { position: 0, color: '#000000' },
          { position: 1, color: '#ffffff' }
        ],
        gradientArea: 'canvas'
      }
    });

    this.registerTool({
      id: 'radial-gradient',
      name: 'Radial Gradient',
      icon: 'radial-gradient',
      category: 'gradient',
      description: 'Apply radial gradients',
      component: RadialGradientTool,
      defaultSettings: {
        gradientColors: [
          { position: 0, color: '#000000' },
          { position: 1, color: '#ffffff' }
        ],
        gradientArea: 'canvas'
      }
    });

    this.registerTool({
      id: 'conic-gradient',
      name: 'Conic Gradient',
      icon: 'conic-gradient',
      category: 'gradient',
      description: 'Apply conic (conical) gradients',
      component: ConicGradientTool,
      defaultSettings: {
        gradientColors: [
          { position: 0, color: '#000000' },
          { position: 1, color: '#ffffff' }
        ],
        startAngle: 0
      }
    });

    // Register Pattern Tools
    this.registerTool({
      id: 'wood-pattern',
      name: 'Wood Pattern',
      icon: 'tree-pine',
      category: 'pattern',
      description: 'Apply wood texture patterns',
      component: WoodPatternTool,
      defaultSettings: {
        woodType: 'oak',
        patternScale: 1,
        patternIntensity: 0.8,
        grainDirection: 'horizontal'
      }
    });

    this.registerTool({
      id: 'stone-pattern',
      name: 'Stone Pattern',
      icon: 'mountain',
      category: 'pattern',
      description: 'Apply stone and rock texture patterns',
      component: StonePatternTool,
      defaultSettings: {
        stoneType: 'granite',
        patternScale: 1,
        patternIntensity: 0.8,
        roughness: 0.5,
        addCracks: false,
        weathered: false
      }
    });

    this.registerTool({
      id: 'fabric-pattern',
      name: 'Fabric Pattern',
      icon: 'grid-3x3',
      category: 'pattern',
      description: 'Apply fabric and textile patterns',
      component: FabricPatternTool,
      defaultSettings: {
        fabricType: 'cotton',
        patternScale: 1,
        patternIntensity: 0.8,
        weaveDensity: 1,
        colorVariation: 0.3,
        showWarp: true,
        showWeft: true
      }
    });

    // Register Symmetry Tool
    this.registerTool({
      id: 'symmetry',
      name: 'Symmetry',
      icon: 'rotate-ccw',
      category: 'symmetry',
      description: 'Draw with symmetry effects',
      component: SymmetryTool,
      defaultSettings: {
        symmetryMode: 'horizontal',
        radialSegments: 8,
        showAxis: true,
        axisColor: '#ff0000'
      }
    });
  }
}

// Initialize the registry
ToolRegistry.initialize();
