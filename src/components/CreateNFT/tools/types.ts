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
    fontFamily?: string;
    fontSize?: number;
    strokeWidth?: number;
    filled?: boolean;
    [key: string]: unknown;
  };
  onSettingsChange?: (structuredUpdate: Partial<ToolProps['settings']>) => void;
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
export interface WoodPatternSpecificOptions {
  woodType?: 'oak' | 'pine' | 'mahogany' | 'birch'; // From ToolRegistry
  grainDirection?: 'horizontal' | 'vertical' | 'diagonal'; // From ToolRegistry
  patternIntensity?: number; // From ToolRegistry (already in PatternOptions as opacity, maybe consolidate or keep specific)
}

export interface StonePatternSpecificOptions {
  stoneType?: 'granite' | 'marble' | 'slate' | 'sandstone'; // From ToolRegistry
  roughness?: number; // From ToolRegistry
  addCracks?: boolean; // From ToolRegistry
  weathered?: boolean; // From ToolRegistry
  patternIntensity?: number; // From ToolRegistry
}

export interface FabricPatternSpecificOptions {
  fabricType?: 'cotton' | 'silk' | 'wool' | 'linen'; // From ToolRegistry
  weaveDensity?: number; // From ToolRegistry
  colorVariation?: number; // From ToolRegistry
  showWarp?: boolean; // From ToolRegistry
  showWeft?: boolean; // From ToolRegistry
  patternIntensity?: number; // From ToolRegistry
}

// Generic PatternOptions, now including specific sub-options
export interface PatternOptions {
  type: 'wood' | 'stone' | 'fabric' | 'marble' | 'metal' | 'custom';
  scale: number; // General scale factor
  opacity: number; // General opacity for the applied pattern
  color?: string; // A base color or tint for the pattern
  wood?: WoodPatternSpecificOptions;
  stone?: StonePatternSpecificOptions;
  fabric?: FabricPatternSpecificOptions;
  // Marble and Metal might have their own specific options too if needed
  // For now, they might only use scale, opacity, color
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
