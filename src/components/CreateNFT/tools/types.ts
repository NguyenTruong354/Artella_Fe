// Types and interfaces for drawing tools
import React from 'react';
import { CreationState, CanvasTool } from '../types';

export interface ToolProps {
  creationState: CreationState;
  onStateUpdate: (newState: Partial<CreationState>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  settings?: {
    size?: number;
    color?: string;
    opacity?: number;
    gradientOptions?: GradientOptions;
    patternOptions?: PatternOptions;
    symmetryOptions?: SymmetryOptions;
    shapeType?: ShapeType;
    [key: string]: unknown;
  };
}

export interface DrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  lastPos: { x: number; y: number };
  startPos: { x: number; y: number };
  isDrawing: boolean;
}

export interface ToolHandler {
  onMouseDown: (context: DrawingContext) => void;
  onMouseMove: (context: DrawingContext) => void;
  onMouseUp: (context: DrawingContext) => void;
  onToolSelect?: () => void;
  renderSettings?: () => React.ReactNode;
  render?: () => React.ReactNode;
}

export interface BaseToolProps extends ToolProps {
  tool: CanvasTool;
  isActive: boolean;
}

// Utility functions interface
export interface CanvasUtils {
  getMousePosition: (canvas: HTMLCanvasElement, e: MouseEvent) => { x: number; y: number };
  saveCanvasState: (canvas: HTMLCanvasElement) => HTMLCanvasElement | null;
  restoreCanvasState: (canvas: HTMLCanvasElement, savedCanvas: HTMLCanvasElement) => void;
  clearCanvas: (canvas: HTMLCanvasElement) => void;
}

// Pattern generation types
export interface PatternOptions {
  type: 'wood' | 'stone' | 'fabric' | 'marble' | 'metal' | 'custom';
  scale: number;
  opacity: number;
  color?: string;
}

// Gradient types
export interface GradientOptions {
  type: 'linear' | 'radial' | 'conic';
  colors: Array<{ color: string; position: number }>;
  angle?: number;
  opacity: number;
}

// Symmetry types
export interface SymmetryOptions {
  type: 'horizontal' | 'vertical' | 'radial' | 'bilateral';
  points?: number;
  axis?: { x: number; y: number };
  enabled: boolean;
}

export type ToolType = 'brush' | 'eraser' | 'text' | 'shape' | 'gradient' | 'pattern' | 'symmetry';
export type ShapeType = 'rectangle' | 'circle' | 'line' | 'triangle';
