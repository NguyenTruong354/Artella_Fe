import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
import { calculateSymmetryPoints, drawSymmetryAxis } from '../utils/symmetryUtils';

export class SymmetryTool extends BaseTool {
  private isDrawing: boolean = false;
  private lastPos: { x: number; y: number } | null = null;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.isDrawing = true;
    this.lastPos = { x: context.x, y: context.y };
    
    // Draw initial point with symmetry
    this.drawWithSymmetry(context, null, { x: context.x, y: context.y });
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.isDrawing || !this.lastPos || !context.canvas) return;

    this.drawWithSymmetry(context, this.lastPos, { x: context.x, y: context.y });
    this.lastPos = { x: context.x, y: context.y };
  }

  onMouseUp(_context: DrawingContext): void {
    this.isDrawing = false;
    this.lastPos = null;
  }

  private drawWithSymmetry(context: DrawingContext, from: { x: number; y: number } | null, to: { x: number; y: number }): void {
    if (!context.canvas) return;    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const canvasCenter = {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2
    };

    // Get all symmetry points
    const symmetryOptions = this.getSymmetryOptions();
    const points = calculateSymmetryPoints(canvasCenter.x, canvasCenter.y, to.x, to.y, symmetryOptions);ctx.save();
    ctx.strokeStyle = this.getToolColor();
    ctx.lineWidth = this.getToolSize();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw on all symmetry points
    points.forEach(point => {
      if (from) {
        const fromPoints = calculateSymmetryPoints(canvasCenter.x, canvasCenter.y, from.x, from.y, symmetryOptions);
        const correspondingFrom = fromPoints.find((_, index) => index === points.indexOf(point));
        
        if (correspondingFrom) {
          ctx.beginPath();
          ctx.moveTo(correspondingFrom.x, correspondingFrom.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      } else {        // Draw dot for initial point
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.getToolSize() / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.restore();    // Draw symmetry axis if enabled
    if ((this.props.settings?.showAxis as boolean) !== false) {
      const symmetryOptions = this.getSymmetryOptions();
      drawSymmetryAxis(ctx, context.canvas, symmetryOptions, canvasCenter.x, canvasCenter.y);
    }
  }
  render(): React.ReactElement {
    return (
      <div className="symmetry-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Symmetry Drawing Tool</div>
        <div className="text-xs text-gray-500">
          Draw normally - strokes will be mirrored automatically based on symmetry mode.
        </div>
      </div>
    );
  }
}
