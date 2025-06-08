// Brush tool implementation
import React from 'react';
import { BaseTool } from '../BaseTool';
import { DrawingContext, ToolProps } from '../types';
import { drawingUtils } from '../utils/canvasUtils';
import { symmetryUtils } from '../utils/symmetryUtils';

export class BrushTool extends BaseTool {
  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    const { ctx, x, y } = context;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  onMouseMove(context: DrawingContext): void {
    if (!context.isDrawing) return;

    const { ctx, x, y, lastPos } = context;
    const size = this.getToolSize();
    const color = this.getToolColor();
    const symmetryOptions = this.getSymmetryOptions();

    if (symmetryOptions.enabled) {
      const center = symmetryUtils.getSymmetryCenter(context.canvas, symmetryOptions.axis);
      
      symmetryUtils.drawWithSymmetry(
        center.x,
        center.y,
        x,
        y,
        symmetryOptions,
        (px: number, py: number) => {
          drawingUtils.drawSmoothLine(ctx, lastPos.x, lastPos.y, px, py, size, color);
        }
      );
    } else {      drawingUtils.drawSmoothLine(ctx, lastPos.x, lastPos.y, x, y, size, color);
    }
  }

  onMouseUp(_context: DrawingContext): void {
    // Brush doesn't need special cleanup on mouse up
  }

  renderSettings(): React.ReactNode {
    return (
      <div className="brush-settings">
        {/* Settings will be rendered by parent component */}
      </div>
    );
  }
}
