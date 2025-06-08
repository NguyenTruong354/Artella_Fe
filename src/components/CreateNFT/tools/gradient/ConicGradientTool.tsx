import React from 'react';
import { BaseTool } from '../BaseTool';
import { ToolProps, DrawingContext } from '../types';

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
    const gradientColors = [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    // Since HTML5 Canvas doesn't support conic gradients natively, we'll simulate it
    this.simulateConicGradient(ctx, center, startAngle, gradientColors, 0.7);
    
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
    const gradientColors = [
      { position: 0, color: this.getToolColor() },
      { position: 1, color: '#ffffff' }
    ];

    this.simulateConicGradient(ctx, center, startAngle, gradientColors, 1);
  }

  private simulateConicGradient(
    ctx: CanvasRenderingContext2D, 
    center: { x: number; y: number }, 
    startAngle: number, 
    colors: Array<{ position: number; color: string }>,
    opacity: number
  ): void {
    const canvas = ctx.canvas;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    // Create color interpolation function
    const interpolateColor = (position: number) => {
      // Find the two colors to interpolate between
      let color1 = colors[0];
      let color2 = colors[colors.length - 1];

      for (let i = 0; i < colors.length - 1; i++) {
        if (position >= colors[i].position && position <= colors[i + 1].position) {
          color1 = colors[i];
          color2 = colors[i + 1];
          break;
        }
      }

      // Interpolate between color1 and color2
      const t = (position - color1.position) / (color2.position - color1.position);
      const rgb1 = this.hexToRgb(color1.color);
      const rgb2 = this.hexToRgb(color2.color);

      return {
        r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * t),
        g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * t),
        b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)
      };
    };

    // Generate gradient pixel by pixel
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const dx = x - center.x;
        const dy = y - center.y;
        let angle = Math.atan2(dy, dx) - startAngle;
        
        // Normalize angle to 0-2π
        while (angle < 0) angle += 2 * Math.PI;
        while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
        
        const position = angle / (2 * Math.PI);
        const color = interpolateColor(position);
        
        const index = (y * canvas.width + x) * 4;
        data[index] = color.r;     // Red
        data[index + 1] = color.g; // Green
        data[index + 2] = color.b; // Blue
        data[index + 3] = Math.round(255 * opacity); // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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
