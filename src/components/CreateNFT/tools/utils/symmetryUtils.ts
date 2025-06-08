// Symmetry drawing utilities
import { SymmetryOptions } from '../types';

export const symmetryUtils = {
  drawWithSymmetry: (
    centerX: number,
    centerY: number,
    x: number,
    y: number,
    options: SymmetryOptions,
    drawFunc: (px: number, py: number) => void
  ) => {
    if (!options.enabled) {
      drawFunc(x, y);
      return;
    }

    switch (options.type) {
      case 'horizontal':
        drawFunc(x, y);
        drawFunc(x, 2 * centerY - y);
        break;

      case 'vertical':
        drawFunc(x, y);
        drawFunc(2 * centerX - x, y);
        break;

      case 'bilateral':
        drawFunc(x, y);
        drawFunc(2 * centerX - x, y);
        drawFunc(x, 2 * centerY - y);
        drawFunc(2 * centerX - x, 2 * centerY - y);
        break;

      case 'radial': {
        const points = options.points || 4;
        const angle = (2 * Math.PI) / points;
        
        for (let i = 0; i < points; i++) {
          const rotatedX = centerX + (x - centerX) * Math.cos(angle * i) - (y - centerY) * Math.sin(angle * i);
          const rotatedY = centerY + (x - centerX) * Math.sin(angle * i) + (y - centerY) * Math.cos(angle * i);
          drawFunc(rotatedX, rotatedY);
        }
        break;
      }

      default:
        drawFunc(x, y);
    }
  },

  getSymmetryCenter: (
    canvas: HTMLCanvasElement,
    customAxis?: { x: number; y: number }
  ): { x: number; y: number } => {
    return customAxis || {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
  },

  drawSymmetryAxis: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    options: SymmetryOptions,
    centerX: number,
    centerY: number
  ) => {
    if (!options.enabled) return;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    switch (options.type) {
      case 'horizontal':
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
        break;

      case 'vertical':
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
        break;

      case 'bilateral':
        // Draw both axes
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
        break;

      case 'radial': {
        const points = options.points || 4;
        const angle = (2 * Math.PI) / points;
        const radius = Math.min(canvas.width, canvas.height) / 2;

        for (let i = 0; i < points; i++) {
          const endX = centerX + radius * Math.cos(angle * i);
          const endY = centerY + radius * Math.sin(angle * i);
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        break;
      }
    }

    ctx.restore();
  },
};

// Named exports for backward compatibility
export const calculateSymmetryPoints = (
  centerX: number,
  centerY: number,
  x: number,
  y: number,
  options: SymmetryOptions
): Array<{x: number, y: number}> => {
  if (!options.enabled) {
    return [{x, y}];
  }

  const points: Array<{x: number, y: number}> = [];

  switch (options.type) {
    case 'horizontal':
      points.push({x, y});
      points.push({x, y: 2 * centerY - y});
      break;

    case 'vertical':
      points.push({x, y});
      points.push({x: 2 * centerX - x, y});
      break;

    case 'bilateral':
      points.push({x, y});
      points.push({x: 2 * centerX - x, y});
      points.push({x, y: 2 * centerY - y});
      points.push({x: 2 * centerX - x, y: 2 * centerY - y});
      break;

    case 'radial': {
      const pointCount = options.points || 4;
      const angle = (2 * Math.PI) / pointCount;
      
      for (let i = 0; i < pointCount; i++) {
        const rotatedX = centerX + (x - centerX) * Math.cos(angle * i) - (y - centerY) * Math.sin(angle * i);
        const rotatedY = centerY + (x - centerX) * Math.sin(angle * i) + (y - centerY) * Math.cos(angle * i);
        points.push({x: rotatedX, y: rotatedY});
      }
      break;
    }

    default:
      points.push({x, y});
  }

  return points;
};

export const drawSymmetryAxis = symmetryUtils.drawSymmetryAxis;
