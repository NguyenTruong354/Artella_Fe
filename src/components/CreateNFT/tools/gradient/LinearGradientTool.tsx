import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
import { gradientUtils } from '../utils/gradientUtils';

export class LinearGradientTool extends BaseTool {
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

    const previewCtx = this.previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    // Draw gradient preview
    this.drawGradientPreview(previewCtx, this.startPos, { x: context.x, y: context.y });
  }

  onMouseUp(context: DrawingContext): void {
    if (!this.startPos || !context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    // Draw final gradient
    this.drawGradient(ctx, this.startPos, { x: context.x, y: context.y });

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
  private drawGradientPreview(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    const gradient = gradientUtils.createLinearGradient(ctx, start.x, start.y, end.x, end.y, gradientColors);
    
    // Draw gradient preview with opacity
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw direction indicator
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    ctx.restore();
  }
  private drawGradient(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    const gradient = gradientUtils.createLinearGradient(ctx, start.x, start.y, end.x, end.y, gradientColors);
    
    ctx.save();
    ctx.fillStyle = gradient;
      // Apply gradient to entire canvas or specific area based on settings
    const area = this.props.settings?.gradientArea || 'canvas';
    if (area === 'canvas') {
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      // Apply to selection area (if implemented)
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      ctx.fillRect(Math.min(start.x, end.x), Math.min(start.y, end.y), width, height);
    }
    
    ctx.restore();
  }

  private cleanup(): void {
    if (this.previewCanvas && this.previewCanvas.parentElement) {
      this.previewCanvas.parentElement.removeChild(this.previewCanvas);
    }
    this.previewCanvas = null;
    this.startPos = null;
  }

  renderSettings(): React.ReactNode {
    return (
      <div className="linear-gradient-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Linear Gradient</div>
        <div className="text-xs text-gray-500">
          Click and drag to create a linear gradient
        </div>
      </div>
    );
  }
}
