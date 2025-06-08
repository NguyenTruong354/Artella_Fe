// Canvas utility functions
import { CanvasUtils } from '../types';

export const canvasUtils: CanvasUtils = {
  getMousePosition: (canvas: HTMLCanvasElement, e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  },

  saveCanvasState: (canvas: HTMLCanvasElement) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      return tempCanvas;
    }
    return null;
  },

  restoreCanvasState: (canvas: HTMLCanvasElement, savedCanvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(savedCanvas, 0, 0);
    }
  },

  clearCanvas: (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  },
};

// Drawing utility functions
export const drawingUtils = {
  // Smooth line drawing
  drawSmoothLine: (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    lineWidth: number,
    color: string
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.restore();
  },

  // Erase function
  erase: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  // Text drawing
  drawText: (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    fontFamily: string = 'Arial'
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillText(text, x, y);
    ctx.restore();
  },

  // Shape drawing
  drawRectangle: (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    strokeWidth: number,
    color: string,
    filled: boolean = false
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const width = endX - startX;
    const height = endY - startY;

    if (filled) {
      ctx.fillRect(startX, startY, width, height);
    } else {
      ctx.strokeRect(startX, startY, width, height);
    }
    ctx.restore();
  },

  drawCircle: (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    endX: number,
    endY: number,
    strokeWidth: number,
    color: string,
    filled: boolean = false
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const radius = Math.sqrt((endX - centerX) ** 2 + (endY - centerY) ** 2);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

    if (filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.restore();
  },
};
