import React, { useEffect, useState, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Eye,
  EyeOff,
  Plus,
  ZoomIn,
  ZoomOut,
  Settings,
  Palette,
  Sliders,
} from "lucide-react";

import { CreationState, CanvasTool, CanvasLayer } from "./types";
import { ToolSelector, ColorPicker, SizeSlider, ToolSettingsPanel } from "./tools";
import { DrawingContext, ToolHandler } from "./tools/types";
import { ToolRegistry } from "./tools/ToolRegistry";
import { ToolFactory } from "./tools/ToolFactory";

interface CreationViewProps {
  creationState: CreationState;
  tools: CanvasTool[];
  onStateUpdate: (newState: Partial<CreationState>) => void;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const CreationView: React.FC<CreationViewProps> = ({
  creationState,
  tools,
  onStateUpdate,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeToolInstance, setActiveToolInstance] = useState<ToolHandler | null>(null);
  
  // UI State for collapsible panels
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(true);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'color' | 'size' | 'advanced'>('color');
  // Initialize tool instance when selectedTool changes
  useEffect(() => {    const toolInfo = ToolRegistry.getTool(creationState.selectedTool.type);
    if (toolInfo) {
      const instance = ToolFactory.createToolInstance(
        toolInfo.id,
        {
          creationState,
          onStateUpdate,
          canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>
        }
      );
      setActiveToolInstance(instance);
    }
  }, [creationState.selectedTool.type, creationState.selectedTool.settings, creationState, onStateUpdate, canvasRef]);

  // Create drawing context helper
  const createDrawingContext = (x: number, y: number): DrawingContext => {
    if (!canvasRef.current) throw new Error("Canvas not available");
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    return {
      canvas,
      ctx,
      x,
      y,
      lastPos,
      startPos,
      isDrawing,
    };
  };  // Helper function to get accurate mouse coordinates
  const getMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas element
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Get logical canvas size (what we set in width/height attributes)
    const logicalWidth = creationState.canvasSize.width;
    const logicalHeight = creationState.canvasSize.height;
    
    // Get displayed size (CSS size)
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Calculate scale factors from display size to logical size
    const scaleX = logicalWidth / displayWidth;
    const scaleY = logicalHeight / displayHeight;
    
    // Convert mouse coordinates to canvas logical coordinates
    let x = mouseX * scaleX;
    let y = mouseY * scaleY;
    
    // Apply zoom factor if any
    const zoomFactor = creationState.zoom || 1;
    if (zoomFactor !== 1) {
      x = x / zoomFactor;
      y = y / zoomFactor;
    }
    
    // Round to nearest pixel and clamp to canvas bounds
    x = Math.round(Math.max(0, Math.min(x, logicalWidth - 1)));
    y = Math.round(Math.max(0, Math.min(y, logicalHeight - 1)));
    
    return { x, y };
  };
  // Canvas drawing events using tool instances
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !activeToolInstance) return;

    const { x, y } = getMouseCoordinates(e);
    
    // Debug logging (remove in production)
    console.log('Mouse coordinates:', { x, y, canvasSize: creationState.canvasSize, zoom: creationState.zoom });

    setIsDrawing(true);
    setLastPos({ x, y });
    setStartPos({ x, y });

    try {
      const context = createDrawingContext(x, y);
      activeToolInstance.onMouseDown(context);
    } catch (error) {
      console.error("Error in tool onMouseDown:", error);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !activeToolInstance) return;

    const { x, y } = getMouseCoordinates(e);

    try {
      const context = createDrawingContext(x, y);
      activeToolInstance.onMouseMove(context);
    } catch (error) {
      console.error("Error in tool onMouseMove:", error);
    }

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing || !activeToolInstance) return;
    setIsDrawing(false);

    try {
      const context = createDrawingContext(lastPos.x, lastPos.y);
      activeToolInstance.onMouseUp(context);
    } catch (error) {
      console.error("Error in tool onMouseUp:", error);
    }

    // Save to history
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      onStateUpdate({
        layers: creationState.layers.map((layer, index) =>
          index === creationState.activeLayer
            ? { ...layer, content: imageData }
            : layer
        ),
        history: [
          ...creationState.history.slice(0, creationState.historyIndex + 1),
          {
            layers: creationState.layers,
            timestamp: Date.now(),
          },
        ],
        historyIndex: creationState.historyIndex + 1,
      });
    }
  };

  // Tool selection
  const selectTool = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      onStateUpdate({ selectedTool: tool });
    }
  };  // Handle tool settings update
  const handleToolSettingsUpdate = (settings: Record<string, unknown>) => {
    onStateUpdate({
      selectedTool: {
        ...creationState.selectedTool,
        settings: { ...creationState.selectedTool.settings, ...settings }
      }
    });
  };

  // Layer management
  const addLayer = () => {
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${creationState.layers.length + 1}`,
      visible: true,
      opacity: 1,
      content: "",
      type: "drawing",
    };

    onStateUpdate({
      layers: [...creationState.layers, newLayer],
      activeLayer: creationState.layers.length,
    });
  };

  const toggleLayerVisibility = (layerIndex: number) => {
    onStateUpdate({
      layers: creationState.layers.map((layer, index) =>
        index === layerIndex ? { ...layer, visible: !layer.visible } : layer
      ),
    });
  };

  const selectLayer = (layerIndex: number) => {
    onStateUpdate({ activeLayer: layerIndex });
  };  // Canvas setup
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = creationState.canvasSize.width;
      canvas.height = creationState.canvasSize.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Set default styles
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [creationState.canvasSize, canvasRef]);

  // Get cursor style based on selected tool
  const getCursorStyle = () => {
    switch (creationState.selectedTool.type) {
      case "eraser":
        return "cursor-cell";
      case "text":
        return "cursor-text";
      case "brush":
      case "shape":
      default:
        return "cursor-crosshair";
    }
  };
  return (
    <div className="h-full flex flex-col">
      {/* Compact Floating Toolbar */}
      <motion.div
        className="sticky top-0 z-10 backdrop-blur-sm bg-white/90 dark:bg-[#1A1A1A]/90 border-b border-gray-200/50 dark:border-gray-800/50 p-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          {/* Primary Tools - Always Visible */}
          <div className="flex items-center space-x-1">
            <ToolSelector
              selectedToolId={creationState.selectedTool.id}
              onToolSelect={selectTool}
              compact={true}
            />
          </div>

          {/* Quick Settings */}
          <div className="flex items-center space-x-2">
            {/* Color Picker - Compact */}
            <div className="flex items-center space-x-1">
              <div 
                className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                style={{ backgroundColor: creationState.selectedTool.settings?.color || "#000000" }}
                onClick={() => setActiveSettingsTab('color')}
              />
            </div>

            {/* Size Indicator */}
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
              <span>{creationState.selectedTool.settings?.size || 10}px</span>
            </div>

            {/* Toggle Panels */}
            <button
              onClick={() => setIsToolsPanelOpen(!isToolsPanelOpen)}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsLayersPanelOpen(!isLayersPanelOpen)}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 border-l border-gray-300 dark:border-gray-600 pl-2">
              <button className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[35px] text-center">
                {Math.round(creationState.zoom * 100)}%
              </span>
              <button className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Settings Panel */}
        <AnimatePresence>
          {isToolsPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2 border-t border-gray-200/50 dark:border-gray-800/50 pt-2"
            >
              {/* Settings Tabs */}
              <div className="flex space-x-1 mb-2">
                {[
                  { id: 'color', label: 'Color', icon: Palette },
                  { id: 'size', label: 'Size', icon: Sliders },
                  { id: 'advanced', label: 'Advanced', icon: Settings }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSettingsTab(id as 'color' | 'size' | 'advanced')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                      activeSettingsTab === id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <div className="min-h-[60px]">
                {activeSettingsTab === 'color' && (
                  <ColorPicker
                    selectedColor={creationState.selectedTool.settings?.color || "#000000"}
                    onColorSelect={(color) => handleToolSettingsUpdate({ color })}
                    compact={true}
                  />
                )}
                
                {activeSettingsTab === 'size' && (
                  <SizeSlider
                    size={creationState.selectedTool.settings?.size || 10}
                    onSizeChange={(size) => handleToolSettingsUpdate({ size })}
                    compact={true}
                  />
                )}
                
                {activeSettingsTab === 'advanced' && (
                  <ToolSettingsPanel
                    toolId={creationState.selectedTool.id}
                    settings={creationState.selectedTool.settings || {}}
                    onSettingsChange={handleToolSettingsUpdate}
                    compact={true}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex">        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden h-full flex items-center justify-center">            <canvas
              ref={canvasRef}
              className={`border border-gray-300 dark:border-gray-600 rounded-lg bg-white ${getCursorStyle()}`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: `${creationState.canvasSize.width}px`,
                height: `${creationState.canvasSize.height}px`,
                transform: creationState.zoom !== 1 ? `scale(${creationState.zoom})` : 'none',
                transformOrigin: "center center"
              }}
            />
          </div>
        </div>

        {/* Floating Layers Panel */}
        <AnimatePresence>
          {isLayersPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
                    Layers
                  </h3>
                  <button
                    onClick={addLayer}
                    className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto">
                  {creationState.layers.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all duration-200 ${
                        index === creationState.activeLayer
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => selectLayer(index)}
                    >
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerVisibility(index);
                          }}
                          className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          {layer.visible ? (
                            <Eye className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-gray-400" />
                          )}
                        </button>
                        <div>
                          <p className="text-xs font-medium">{layer.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{layer.type}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(layer.opacity * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreationView;