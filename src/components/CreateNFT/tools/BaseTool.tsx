// Base tool component that all tools extend from
import React from 'react';
import { ToolProps, ToolHandler, DrawingContext, SymmetryOptions } from './types';

export abstract class BaseTool implements ToolHandler {
  protected props: ToolProps;

  constructor(props: ToolProps) {
    this.props = props;
  }

  abstract onMouseDown(context: DrawingContext): void;
  abstract onMouseMove(context: DrawingContext): void;
  abstract onMouseUp(context: DrawingContext): void;
  
  onToolSelect?(): void {
    // Optional override for tool selection behavior
  }

  renderSettings?(): React.ReactNode {
    // Optional override for custom settings UI
    return null;
  }

  // Render method for React component compatibility
  render(): React.ReactNode {
    return this.renderSettings ? this.renderSettings() : null;
  }

  // Helper method to create drawing context
  protected createDrawingContext(
    canvas: HTMLCanvasElement,
    e: React.MouseEvent<HTMLCanvasElement>,
    lastPos: { x: number; y: number },
    startPos: { x: number; y: number },
    isDrawing: boolean
  ): DrawingContext {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    return {
      canvas,
      ctx,
      x,
      y,
      lastPos,
      startPos,
      isDrawing,
    };
  }  // Helper method to save canvas state for preview operations
  protected saveCanvasState(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0);
      return tempCanvas;
    }
    return null;
  }

  // Helper method to restore canvas state
  protected restoreCanvasState(canvas: HTMLCanvasElement, savedCanvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(savedCanvas, 0, 0);
    }
  }
  // Helper methods to get settings from props
  protected getToolSize(): number {
    return this.props.settings?.size || this.props.creationState.selectedTool.settings?.size || 5;
  }

  protected getToolColor(): string {
    return this.props.settings?.color || this.props.creationState.selectedTool.settings?.color || '#000000';
  }

  protected getToolOpacity(): number {
    return this.props.settings?.opacity || this.props.creationState.selectedTool.settings?.opacity || 1;
  }

  protected getSymmetryOptions(): SymmetryOptions {
    return this.props.settings?.symmetryOptions || {
      type: 'horizontal',
      enabled: false,
      points: 4,
      axis: { x: 0, y: 0 }
    };
  }
}
