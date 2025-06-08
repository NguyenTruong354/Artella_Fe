import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';
import { createConicGradient } from '../utils/gradientUtils'; // Import the utility

export class ConicGradientTool extends BaseTool {
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
    
    // Calculate angle from center to mouse position
    const angle = Math.atan2(context.y - this.centerPos.y, context.x - this.centerPos.x);

    // Draw gradient preview
    this.drawGradientPreview(previewCtx, this.centerPos, angle);
  }

  onMouseUp(context: DrawingContext): void {
    if (!this.centerPos || !context.canvas) return;

    const ctx = context.canvas.getContext('2d');
    if (!ctx) return;

    // Calculate final angle
    const angle = Math.atan2(context.y - this.centerPos.y, context.x - this.centerPos.x);

    // Draw final gradient
    this.drawGradient(ctx, this.centerPos, angle);

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
  private drawGradientPreview(ctx: CanvasRenderingContext2D, center: { x: number; y: number }, startAngle: number): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    // Use the updated utility which calls native createConicGradient
    const gradient = createConicGradient(ctx, startAngle, center.x, center.y, gradientColors);
    
    ctx.save(); // Save before applying gradient to preview
    ctx.globalAlpha = 0.7; // Keep preview opacity
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Fill entire preview
    ctx.restore(); // Restore before drawing indicators

    // Draw angle indicator
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw line from center to indicate start angle
    const radius = 50;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(
      center.x + Math.cos(startAngle) * radius,
      center.y + Math.sin(startAngle) * radius
    );
    ctx.stroke();
    
    // Draw center point
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  }
  private drawGradient(ctx: CanvasRenderingContext2D, center: { x: number; y: number }, startAngle: number): void {
    const gradientColors = this.props.settings?.gradientOptions?.colors || [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    // Use the updated utility which calls native createConicGradient
    const gradient = createConicGradient(ctx, startAngle, center.x, center.y, gradientColors);

    ctx.save();
    // Apply gradient to entire canvas or specific area based on settings
    // For conic, it's typical to fill the whole canvas or a circular region.
    // Defaulting to full canvas for now, consistent with original simulation.
    // Opacity for final draw should be from settings or 1.
    ctx.globalAlpha = this.props.settings?.gradientOptions?.opacity ?? 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
      <div className="conic-gradient-tool-settings flex flex-col gap-3">
        <div className="text-xs font-medium text-gray-700">Conic Gradient</div>
        <div className="text-xs text-gray-500">
          Click and drag to set start angle for conic gradient
        </div>
      </div>
    );
  }
}
