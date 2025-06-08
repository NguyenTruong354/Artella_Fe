import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
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
  onMouseUp(_context: DrawingContext): void {
    this.isDrawing = false;
  }

  private applyStonePattern(context: DrawingContext): void {
    if (!context.canvas) return;    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8;

    // Generate stone pattern
    const patternCanvas = generateStonePattern();
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
          Click and drag to apply stone texture pattern
        </div>
      </div>
    );
  }
}
