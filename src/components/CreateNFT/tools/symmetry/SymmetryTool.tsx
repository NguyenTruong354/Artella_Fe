import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
import { calculateSymmetryPoints, drawSymmetryAxis, symmetryUtils } from '../utils/symmetryUtils';

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

  onMouseUp(): void { // Removed _context as it's not used
    this.isDrawing = false;
    this.lastPos = null;
  }

  private drawWithSymmetry(context: DrawingContext, from: { x: number; y: number } | null, to: { x: number; y: number }): void {
    if (!context.canvas) return;
    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    const symmetryOptions = this.getSymmetryOptions();
    // Use symmetryUtils.getSymmetryCenter to respect custom axis from settings
    const effectiveCenter = symmetryUtils.getSymmetryCenter(context.canvas, symmetryOptions.axis);

    // Get all symmetry points for the 'to' position
    const pointsTo = calculateSymmetryPoints(effectiveCenter.x, effectiveCenter.y, to.x, to.y, symmetryOptions);
    
    ctx.save();
    ctx.strokeStyle = this.getToolColor();
    ctx.lineWidth = this.getToolSize();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw on all symmetry points
    pointsTo.forEach((pointTo, index) => { // Added index for correct 'from' point mapping
      if (from) {
        // Calculate 'from' points based on the same effectiveCenter
        const pointsFrom = calculateSymmetryPoints(effectiveCenter.x, effectiveCenter.y, from.x, from.y, symmetryOptions);
        const correspondingFrom = pointsFrom[index]; // Correctly map using index
        
        if (correspondingFrom) {
          ctx.beginPath();
          ctx.moveTo(correspondingFrom.x, correspondingFrom.y);
          ctx.lineTo(pointTo.x, pointTo.y);
          ctx.stroke();
        }
      } else {
        // Draw dot for initial point
        ctx.fillStyle = this.getToolColor(); // Set fillStyle for the dot
        ctx.beginPath();
        ctx.arc(pointTo.x, pointTo.y, this.getToolSize() / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.restore();
    // Draw symmetry axis if enabled
    if (symmetryOptions.enabled && (this.props.settings?.showAxis as boolean) !== false) {
      // Pass effectiveCenter to drawSymmetryAxis
      drawSymmetryAxis(ctx, context.canvas, symmetryOptions, effectiveCenter.x, effectiveCenter.y);
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
