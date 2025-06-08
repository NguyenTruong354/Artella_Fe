import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
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
  onMouseUp(_context: DrawingContext): void {
    this.isDrawing = false;
  }
  private applyFabricPattern(context: DrawingContext): void {
    if (!context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8;

    // Generate fabric pattern
    const patternCanvas = generateFabricPattern();
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
          Click and drag to apply fabric texture pattern to your drawing.
        </div>
      </div>
    );
  }
}
