import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext, FabricPatternSpecificOptions } from '../types';
import { generateFabricPattern } from '../utils/patternGenerators';

export class FabricPatternTool extends BaseTool {
  private isDrawing: boolean = false;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.isDrawing = true;
    this.applyFabricPattern(context);
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.isDrawing || !context.canvas) return;

    this.applyFabricPattern(context);
  }
  onMouseUp(): void { // Removed _context as it's not used
    this.isDrawing = false;
  }
  private applyFabricPattern(context: DrawingContext): void {
    if (!context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8; // Opacity of application

    // Prepare options for fabric pattern generation
    const patternScale = (this.props.settings?.patternScale as number) || 1; // Scale of the pattern itself
    const baseColor = this.props.settings?.color as string | undefined; // Base color for the pattern

    const fabricOptions: FabricPatternSpecificOptions & { scale: number; baseColor?: string } = {
      scale: patternScale,
      baseColor: baseColor,
      // Specific fabric options (e.g., fabricType, weaveStyle) can be added here
      // if they are available in this.props.settings and supported by createFabricPattern.
      // For now, they will be undefined and createFabricPattern should use defaults.
    };

    // Generate fabric pattern
    const patternCanvas = generateFabricPattern(fabricOptions);
    const pattern = ctx.createPattern(patternCanvas, 'repeat');

    if (pattern) {
      ctx.save();
      ctx.globalAlpha = intensity;
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
      <div className="fabric-pattern-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Fabric Pattern Tool</div>
        <div className="text-xs text-gray-500">
          Click and drag to apply fabric texture. 
          {/* TODO: Add UI controls for patternScale, baseColor (if different from main), and other fabric-specific options. */}
        </div>
      </div>
    );
  }
}
