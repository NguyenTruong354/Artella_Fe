// Gradient utility functions
import { GradientOptions } from '../types';

export const gradientUtils = {
  createLinearGradient: (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    colors: Array<{ color: string; position: number }>
  ): CanvasGradient => {
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    colors.forEach(stop => {
      gradient.addColorStop(stop.position, stop.color);
    });
    return gradient;
  },

  createRadialGradient: (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    colors: Array<{ color: string; position: number }>
  ): CanvasGradient => {
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    colors.forEach(stop => {
      gradient.addColorStop(stop.position, stop.color);
    });
    return gradient;
  },

  createConicGradient: (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    colors: Array<{ color: string; position: number }>
  ): CanvasGradient => {
    // HTML5 Canvas doesn't support conic gradients natively, so we simulate with radial
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    colors.forEach(stop => {
      gradient.addColorStop(stop.position, stop.color);
    });
    return gradient;
  },

  applyGradient: (
    ctx: CanvasRenderingContext2D,
    gradient: CanvasGradient,
    options: GradientOptions,
    canvas: HTMLCanvasElement
  ) => {
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.globalAlpha = options.opacity;

    if (options.type === 'linear') {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // For radial and conic, fill entire canvas
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
  },
};

// Named exports for backward compatibility
export const createLinearGradient = gradientUtils.createLinearGradient;
export const createRadialGradient = gradientUtils.createRadialGradient;
export const createConicGradient = gradientUtils.createConicGradient;
