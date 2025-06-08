// Types and interfaces for CreateNFT functionality

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  collection?: string;
  creator: string;
  royalty: number;
  price?: string;
  category: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface CanvasTool {
  id: string;
  name: string;
  icon: string;
  type: 'brush' | 'shape' | 'text' | 'eraser' | 'fill' | 'gradient' | 'pattern' | 'symmetry';
  settings?: ToolSettings;
}

export interface ToolSettings {
  size?: number;
  color?: string;
  opacity?: number;
  strokeWidth?: number;
  fontFamily?: string;
  fontSize?: number;
  // Gradient settings
  gradientType?: 'linear' | 'radial' | 'conic';
  gradientColors?: GradientStop[];
  gradientAngle?: number;
  // Pattern settings
  patternType?: 'wood' | 'stone' | 'fabric' | 'marble' | 'metal' | 'custom';
  patternScale?: number;
  // Symmetry settings
  symmetryType?: 'horizontal' | 'vertical' | 'radial' | 'bilateral';
  symmetryPoints?: number;
  symmetryAxis?: { x: number; y: number };
}

export interface GradientStop {
  color: string;
  position: number; // 0-1
}

export interface CreationState {
  activeLayer: number;
  layers: CanvasLayer[];
  selectedTool: CanvasTool;
  canvasSize: { width: number; height: number };
  zoom: number;
  history: CanvasState[];
  historyIndex: number;
  symmetryEnabled?: boolean;
  symmetryAxis?: { x: number; y: number };
}

export interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  content: string; // base64 image data
  type: 'drawing' | 'image' | 'text';
}

export interface CanvasState {
  layers: CanvasLayer[];
  timestamp: number;
}

export interface ViewMode {
  type: 'creation' | 'gallery' | 'split';
  isTransitioning: boolean;
}

export interface GalleryPreviewSettings {
  background: 'dark' | 'light' | 'gradient' | 'museum';
  frame: 'none' | 'classic' | 'modern' | 'digital';
  lighting: 'natural' | 'spotlight' | 'ambient';
  environment: 'gallery' | 'home' | 'museum' | 'digital';
}
