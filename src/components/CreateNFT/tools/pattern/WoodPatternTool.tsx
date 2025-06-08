import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext, WoodPatternSpecificOptions } from '../types';
import { generateWoodPattern } from '../utils/patternGenerators';

export class WoodPatternTool extends BaseTool {
  private isDrawing: boolean = false;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.isDrawing = true;
    this.applyWoodPattern(context);
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.isDrawing || !context.canvas) return;

    this.applyWoodPattern(context);
  }
  onMouseUp(): void { // Removed _context as it's not used
    this.isDrawing = false;
  }

  private applyWoodPattern(context: DrawingContext): void {
    if (!context.canvas) return;
    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8; // Opacity of application

    // Prepare options for wood pattern generation
    const patternScale = (this.props.settings?.patternScale as number) || 1; // Scale of the pattern itself
    const baseColor = this.props.settings?.color as string | undefined; // Base color for the pattern

    const woodOptions: WoodPatternSpecificOptions & { scale: number; baseColor?: string } = {
      scale: patternScale,
      baseColor: baseColor,
      // Specific wood options (e.g., woodType, grainDirection) can be added here
      // if they are available in this.props.settings and supported by createWoodPattern.
      woodType: this.props.settings?.woodType as WoodPatternSpecificOptions['woodType'] | undefined,
      grainDirection: this.props.settings?.grainDirection as WoodPatternSpecificOptions['grainDirection'] | undefined,
      // patternIntensity for the generator is different from the brush application intensity
      // Pass it if available from settings, otherwise generator uses its default
      patternIntensity: this.props.settings?.generatorPatternIntensity as number | undefined, 
    };
    
    // Generate wood pattern
    const patternCanvas = generateWoodPattern(woodOptions);
    const pattern = ctx.createPattern(patternCanvas, 'repeat');

    if (pattern) {
      ctx.save();
      ctx.globalAlpha = intensity as number;
      ctx.fillStyle = pattern;
      
      // Apply pattern with brush size
      ctx.beginPath();
      ctx.arc(context.x, context.y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.restore();
    }
  }
  render(): React.ReactElement {
    return (
      <div className="wood-pattern-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Wood Pattern</div>
        <div className="text-xs text-gray-500">
          Click and drag to apply wood texture.
          {/* TODO: Add UI controls for patternScale, baseColor, woodType, grainDirection, etc. */}
        </div>
      </div>
    );
  }
}
