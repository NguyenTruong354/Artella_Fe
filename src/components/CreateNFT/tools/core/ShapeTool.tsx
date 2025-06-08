import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';

export class ShapeTool extends BaseTool {
  private startPos: { x: number; y: number } | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.startPos = { x: context.x, y: context.y };
    this.createPreviewCanvas(context.canvas);
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.startPos || !this.previewCanvas || !context.canvas) return;

    // Clear preview canvas
    const previewCtx = this.previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    // Draw shape preview
    this.drawShapePreview(previewCtx, this.startPos, { x: context.x, y: context.y });
  }

  onMouseUp(context: DrawingContext): void {
    if (!this.startPos || !context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    // Draw final shape
    this.drawShape(ctx, this.startPos, { x: context.x, y: context.y });

    // Cleanup
    this.cleanup();
  }

  private createPreviewCanvas(canvas: HTMLCanvasElement): void {
    if (this.previewCanvas) return;

    this.previewCanvas = document.createElement('canvas');
    this.previewCanvas.width = canvas.width;
    this.previewCanvas.height = canvas.height;
    this.previewCanvas.style.position = 'absolute';
    this.previewCanvas.style.top = '0';
    this.previewCanvas.style.left = '0';
    this.previewCanvas.style.pointerEvents = 'none';
    this.previewCanvas.style.zIndex = '999';

    const canvasContainer = canvas.parentElement;
    if (canvasContainer) {
      canvasContainer.appendChild(this.previewCanvas);
    }
  }
  private drawShapePreview(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }): void {
    ctx.strokeStyle = this.getToolColor();
    ctx.lineWidth = this.getToolSize();
    ctx.setLineDash([5, 5]); // Dashed line for preview

    const shapeType = this.props.settings?.shapeType || 'rectangle';

    if (shapeType === 'rectangle') {
      this.drawRectangle(ctx, start, end);
    } else if (shapeType === 'circle') {
      this.drawCircle(ctx, start, end);
    }
  }

  private drawShape(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }): void {
    ctx.save();
    ctx.strokeStyle = this.getToolColor();
    ctx.lineWidth = this.getToolSize();
    ctx.setLineDash([]); // Solid line for final shape

    const shapeType = this.props.settings?.shapeType || 'rectangle';
    const filled = this.props.settings?.filled || false;

    if (filled) {
      ctx.fillStyle = this.getToolColor();
    }

    if (shapeType === 'rectangle') {
      this.drawRectangle(ctx, start, end, filled as boolean);
    } else if (shapeType === 'circle') {
      this.drawCircle(ctx, start, end, filled as boolean);
    }

    ctx.restore();
  }

  private drawRectangle(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, filled: boolean = false): void {
    const width = end.x - start.x;
    const height = end.y - start.y;

    if (filled) {
      ctx.fillRect(start.x, start.y, width, height);
    } else {
      ctx.strokeRect(start.x, start.y, width, height);
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }, filled: boolean = false): void {
    const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    
    if (filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.closePath();
  }

  private cleanup(): void {
    if (this.previewCanvas && this.previewCanvas.parentElement) {
      this.previewCanvas.parentElement.removeChild(this.previewCanvas);
    }
    this.previewCanvas = null;
    this.startPos = null;
  }
  render(): React.ReactElement {
    const shapeType = this.props.settings?.shapeType || 'rectangle';
    const filled = this.props.settings?.filled || false;

    return (
      <div className="shape-tool-settings flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-xs rounded ${
              shapeType === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Rectangle
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              shapeType === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Circle
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={filled as boolean}
            readOnly
          />
          Filled
        </label>
      </div>
    );
  }
}
