import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
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
  onMouseUp(_context: DrawingContext): void {
    this.isDrawing = false;
  }

  private applyWoodPattern(context: DrawingContext): void {
    if (!context.canvas) return;    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const brushSize = this.getToolSize();
    const intensity = (this.props.settings?.patternIntensity as number) || 0.8;

    // Generate wood pattern
    const patternCanvas = generateWoodPattern();
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
          Click and drag to apply wood texture pattern
        </div>
      </div>
    );
  }
}
