import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
import { createRadialGradient } from '../utils/gradientUtils';

export class RadialGradientTool extends BaseTool {
  private centerPos: { x: number; y: number } | null = null;
  private previewCanvas: HTMLCanvasElement | null = null;

  constructor(props: ToolProps) {
    super(props);
  }

  onMouseDown(context: DrawingContext): void {
    if (!context.canvas) return;

    this.centerPos = { x: context.x, y: context.y };
    this.createPreviewCanvas(context.canvas);
  }

  onMouseMove(context: DrawingContext): void {
    if (!this.centerPos || !this.previewCanvas || !context.canvas) return;

    const previewCtx = this.previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    
    // Calculate radius from center to mouse position
    const radius = Math.sqrt(
      Math.pow(context.x - this.centerPos.x, 2) + 
      Math.pow(context.y - this.centerPos.y, 2)
    );

    // Draw gradient preview
    this.drawGradientPreview(previewCtx, this.centerPos, radius);
  }

  onMouseUp(context: DrawingContext): void {
    if (!this.centerPos || !context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    // Calculate final radius
    const radius = Math.sqrt(
      Math.pow(context.x - this.centerPos.x, 2) + 
      Math.pow(context.y - this.centerPos.y, 2)
    );

    // Draw final gradient
    this.drawGradient(ctx, this.centerPos, radius);

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
  private drawGradientPreview(ctx: CanvasRenderingContext2D, center: { x: number; y: number }, radius: number): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    const gradient = createRadialGradient(ctx, center.x, center.y, radius, gradientColors);
    
    // Draw gradient preview with opacity
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw radius indicator
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw center point
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }
  private drawGradient(ctx: CanvasRenderingContext2D, center: { x: number; y: number }, radius: number): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    const gradient = createRadialGradient(ctx, center.x, center.y, radius, gradientColors);
    
    ctx.save();
    ctx.fillStyle = gradient;
    
    // Apply gradient to entire canvas or specific area based on settings
    const area = this.props.settings?.gradientArea || 'canvas';
    if (area === 'canvas') {
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      // Apply to circular area
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    ctx.restore();
  }

  private cleanup(): void {
    if (this.previewCanvas && this.previewCanvas.parentElement) {
      this.previewCanvas.parentElement.removeChild(this.previewCanvas);
    }
    this.previewCanvas = null;
    this.centerPos = null;
  }
  render(): React.ReactElement {
    return (
      <div className="radial-gradient-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Radial Gradient</div>
        <div className="text-xs text-gray-500">
          Click and drag to create radial gradient from center point
        </div>
      </div>
    );
  }
}
