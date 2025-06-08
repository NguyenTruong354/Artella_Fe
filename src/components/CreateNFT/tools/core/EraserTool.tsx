// Eraser tool implementation
import React from 'react';
import { BaseTool } from '../BaseTool';
import { DrawingContext, ToolProps } from '../types';
import { drawingUtils } from '../utils/canvasUtils';

export class EraserTool extends BaseTool {
  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    const { ctx, x, y } = context;
    const size = this.getToolSize();
    
    // Start erasing immediately on click
    drawingUtils.erase(ctx, x, y, size);
  }

  onMouseMove(context: DrawingContext): void {
    if (!context.isDrawing) return;

    const { ctx, x, y, lastPos } = context;
    const size = this.getToolSize();

    // Erase along the path
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw eraser line from last position to current position
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Also draw circles at each point for smoother erasing
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  onMouseUp(_context: DrawingContext): void {
    // Eraser doesn't need special cleanup on mouse up
  }

  renderSettings(): React.ReactNode {
    return (
      <div className="eraser-settings">
        {/* Settings will be rendered by parent component */}
      </div>
    );
  }
}
