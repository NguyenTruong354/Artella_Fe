import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext, StonePatternSpecificOptions } from '../types';
import { generateStonePattern } from '../utils/patternGenerators';

export class StonePatternTool extends BaseTool {
  private isDrawing: boolean = false;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.isDrawing = true;
    this.applyStonePattern(context);
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.isDrawing || !context.canvas) return;

    this.applyStonePattern(context);
  }
  onMouseUp(): void { // Removed _context as it's not used
    this.isDrawing = false;
  }

  private applyStonePattern(context: DrawingContext): void {
    if (!context.canvas) return;
    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8; // Opacity of application

    // Prepare options for stone pattern generation
    const patternScale = (this.props.settings?.patternScale as number) || 1; // Scale of the pattern itself
    const baseColor = this.props.settings?.color as string | undefined; // Base color for the pattern

    const stoneOptions: StonePatternSpecificOptions & { scale: number; baseColor?: string } = {
      scale: patternScale,
      baseColor: baseColor,
      // Specific stone options (e.g., stoneType, roughness) can be added here
      // if they are available in this.props.settings and supported by createStonePattern.
      // For now, they will be undefined and createStonePattern should use defaults.
      stoneType: this.props.settings?.stoneType as StonePatternSpecificOptions['stoneType'] | undefined,
      roughness: this.props.settings?.roughness as number | undefined,
      addCracks: this.props.settings?.addCracks as boolean | undefined,
      weathered: this.props.settings?.weathered as boolean | undefined,
    };
    
    // Generate stone pattern
    const patternCanvas = generateStonePattern(stoneOptions);
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
      <div className="stone-pattern-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Stone Pattern</div>
        <div className="text-xs text-gray-500">
          Click and drag to apply stone texture.
          {/* TODO: Add UI controls for patternScale, baseColor, stoneType, roughness, etc. */}
        </div>
      </div>
    );
  }
}
