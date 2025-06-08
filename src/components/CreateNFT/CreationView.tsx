import React, { useEffect, useState, RefObject } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Eye,
  EyeOff,
  Plus,
  ZoomIn,
  ZoomOut,
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
}) => {  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeToolInstance, setActiveToolInstance] = useState<ToolHandler | null>(null);
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
  };

  // Canvas drawing events using tool instances
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !activeToolInstance) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

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

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

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
  };

  // Canvas setup
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = creationState.canvasSize.width;
      canvas.height = creationState.canvasSize.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    <div className="h-full space-y-6">
      {/* Tools Panel */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-4 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
          Creation Tools
        </h3>
          {/* Tool Selection */}
        <ToolSelector
          selectedToolId={creationState.selectedTool.id}
          onToolSelect={selectTool}
        />

        {/* Tool Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Color Picker */}
          <ColorPicker
            selectedColor={creationState.selectedTool.settings?.color || "#000000"}
            onColorSelect={(color) => handleToolSettingsUpdate({ color })}
          />

          {/* Size Slider */}
          <SizeSlider
            size={creationState.selectedTool.settings?.size || 10}
            onSizeChange={(size) => handleToolSettingsUpdate({ size })}
          />          {/* Tool-specific Settings */}
          <div className="col-span-1 sm:col-span-2">
            <ToolSettingsPanel
              toolId={creationState.selectedTool.id}
              settings={creationState.selectedTool.settings || {}}
              onSettingsChange={handleToolSettingsUpdate}
            />
          </div>
        </div>
      </motion.div>

      {/* Canvas Panel */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-4 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
            Canvas
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(creationState.zoom * 100)}%
            </span>
            <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`border border-gray-300 dark:border-gray-600 rounded-lg max-w-full h-auto bg-white ${getCursorStyle()}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              transform: `scale(${creationState.zoom})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </motion.div>

      {/* Layers Panel */}
      <motion.div
        className="backdrop-blur-sm rounded-2xl p-4 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
            Layers
          </h3>
          <button
            onClick={addLayer}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {creationState.layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                index === creationState.activeLayer
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => selectLayer(index)}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(index);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium">{layer.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{layer.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {Math.round(layer.opacity * 100)}%
                </span>
                <Layers className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreationView;