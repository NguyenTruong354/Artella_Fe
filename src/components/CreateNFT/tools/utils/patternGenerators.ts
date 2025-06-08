// Pattern generation utilities
import { PatternOptions, WoodPatternSpecificOptions, StonePatternSpecificOptions, FabricPatternSpecificOptions } from '../types';

// Helper type for combined options passed to generators
type FullWoodOptions = WoodPatternSpecificOptions & { scale: number; baseColor?: string; };
type FullStoneOptions = StonePatternSpecificOptions & { scale: number; baseColor?: string; };
type FullFabricOptions = FabricPatternSpecificOptions & { scale: number; baseColor?: string; };
// Marble and Metal might just use scale and baseColor from PatternOptions directly for now.

export const patternGenerators = {
  createWoodPattern: (options: FullWoodOptions): HTMLCanvasElement => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) throw new Error('Cannot create pattern context');

    const size = 50 * options.scale; // Use options.scale
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Wood grain pattern
    // TODO: Implement usage of options.woodType, options.grainDirection, options.patternIntensity for more varied wood patterns.
    patternCtx.fillStyle = options.baseColor || '#8B4513'; 
    patternCtx.fillRect(0, 0, size, size);
    patternCtx.strokeStyle = '#654321'; // Detail color, consider making this configurable via options
    patternCtx.lineWidth = 2;
    
    for (let i = 0; i < size; i += 8) {
      patternCtx.beginPath();
      patternCtx.moveTo(0, i);
      patternCtx.quadraticCurveTo(size / 2, i + 5, size, i);
      patternCtx.stroke();
    }

    return patternCanvas;
  },

  createStonePattern: (options: FullStoneOptions): HTMLCanvasElement => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) throw new Error('Cannot create pattern context');

    const size = 50 * options.scale; // Use options.scale
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Stone texture pattern
    // TODO: Implement usage of options.stoneType, options.roughness, options.addCracks, options.weathered, options.patternIntensity for more varied stone textures.
    patternCtx.fillStyle = options.baseColor || '#696969'; 
    patternCtx.fillRect(0, 0, size, size);
    
    // Add random stone-like shapes
    for (let i = 0; i < 10; i++) {
      patternCtx.fillStyle = `hsl(0, 0%, ${40 + Math.random() * 20}%)`;
      patternCtx.beginPath();
      patternCtx.arc(
        Math.random() * size,
        Math.random() * size,
        Math.random() * 10 + 5,
        0,
        Math.PI * 2
      );
      patternCtx.fill();
    }

    return patternCanvas;
  },

  createFabricPattern: (options: FullFabricOptions): HTMLCanvasElement => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) throw new Error('Cannot create pattern context');

    const size = 50 * options.scale;
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Fabric weave pattern
    // TODO: Implement usage of options.fabricType, options.weaveStyle, options.threadThickness, options.patternIntensity for more varied fabric patterns.
    patternCtx.fillStyle = options.baseColor || '#F5F5DC'; // Use options.baseColor
    patternCtx.fillRect(0, 0, size, size);
    patternCtx.strokeStyle = '#DEB887'; // Detail color, consider making this configurable via options
    patternCtx.lineWidth = 1;
    
    const spacing = size / 10;
    for (let i = 0; i <= size; i += spacing) {
      patternCtx.beginPath();
      patternCtx.moveTo(i, 0);
      patternCtx.lineTo(i, size);
      patternCtx.moveTo(0, i);
      patternCtx.lineTo(size, i);
      patternCtx.stroke();
    }

    return patternCanvas;
  },

  createMarblePattern: (scale: number = 1): HTMLCanvasElement => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) throw new Error('Cannot create pattern context');

    const size = 50 * scale;
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Marble pattern with veins
    patternCtx.fillStyle = '#F8F8FF';
    patternCtx.fillRect(0, 0, size, size);
    
    // Add marble veins
    patternCtx.strokeStyle = '#C0C0C0';
    patternCtx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      patternCtx.beginPath();
      patternCtx.moveTo(Math.random() * size, 0);
      patternCtx.quadraticCurveTo(
        Math.random() * size,
        size / 2,
        Math.random() * size,
        size
      );
      patternCtx.stroke();
    }

    return patternCanvas;
  },

  createMetalPattern: (scale: number = 1): HTMLCanvasElement => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) throw new Error('Cannot create pattern context');

    const size = 50 * scale;
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Metal brushed pattern
    const gradient = patternCtx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#A0A0A0');
    gradient.addColorStop(1, '#C0C0C0');
    
    patternCtx.fillStyle = gradient;
    patternCtx.fillRect(0, 0, size, size);

    return patternCanvas;
  },

  createPattern: (
    ctx: CanvasRenderingContext2D,
    options: PatternOptions
  ): CanvasPattern | null => {
    let patternCanvas: HTMLCanvasElement;

    // Assuming PatternOptions is a discriminated union, TypeScript will narrow down 'options' type in each case.
    switch (options.type) {
      case 'wood':
        patternCanvas = patternGenerators.createWoodPattern(options as WoodPatternSpecificOptions & { scale: number; baseColor?: string; });
        break;
      case 'stone':
        patternCanvas = patternGenerators.createStonePattern(options as StonePatternSpecificOptions & { scale: number; baseColor?: string; });
        break;
      case 'fabric':
        patternCanvas = patternGenerators.createFabricPattern(options as FabricPatternSpecificOptions & { scale: number; baseColor?: string; });
        break;
      case 'marble':
        // For marble and metal, if PatternOptions for these types also include baseColor,
        // their respective generator functions could be updated to accept an options object.
        // For now, they only accept scale.
        patternCanvas = patternGenerators.createMarblePattern(options.scale);
        break;
      case 'metal':
        patternCanvas = patternGenerators.createMetalPattern(options.scale);
        break;
      default:
        return null;
    }

    return ctx.createPattern(patternCanvas, 'repeat');
  },
};

// Named exports for backward compatibility
export const generateWoodPattern = patternGenerators.createWoodPattern;
export const generateStonePattern = patternGenerators.createStonePattern;  
export const generateFabricPattern = patternGenerators.createFabricPattern;
