import React, { useEffect, useState, RefObject } from "react";
import { motion } from "framer-motion";
import {
  Brush,
  Eraser,
  Type,
  Square,
  Circle,
  Palette,
  Layers,
  Eye,
  EyeOff,
  Plus,
  ZoomIn,
  ZoomOut,
  Zap,
  TreePine,
  Mountain,
  Grid3X3,
  RotateCcw,
} from "lucide-react";

import { CreationState, CanvasTool, CanvasLayer } from "./types";

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
    "#008000",
    "#000080",
  ];

  const sizes = [2, 5, 10, 15, 20, 30, 40, 50];

  // Utility functions for gradient and patterns
  const createGradient = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    const settings = creationState.selectedTool.settings;
    if (!settings || !settings.gradientColors) return null;

    let gradient: CanvasGradient;

    switch (settings.gradientType) {
      case 'linear':
        gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        break;      case 'radial': {
        const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        gradient = ctx.createRadialGradient(startX, startY, 0, startX, startY, radius);
        break;
      }
      case 'conic':
        // HTML5 Canvas doesn't natively support conic gradients, we'll simulate with radial
        gradient = ctx.createRadialGradient(startX, startY, 0, startX, startY, 
          Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
        break;
      default:
        gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    }

    settings.gradientColors.forEach(stop => {
      gradient.addColorStop(stop.position, stop.color);
    });

    return gradient;
  };

  const createPattern = (ctx: CanvasRenderingContext2D) => {
    const settings = creationState.selectedTool.settings;
    if (!settings || !settings.patternType) return null;

    // Create pattern canvas
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return null;

    const scale = settings.patternScale || 1;
    const size = 50 * scale;
    patternCanvas.width = size;
    patternCanvas.height = size;

    // Generate pattern based on type
    switch (settings.patternType) {
      case 'wood':
        // Wood grain pattern
        patternCtx.fillStyle = '#8B4513';
        patternCtx.fillRect(0, 0, size, size);
        patternCtx.strokeStyle = '#654321';
        patternCtx.lineWidth = 2;
        for (let i = 0; i < size; i += 8) {
          patternCtx.beginPath();
          patternCtx.moveTo(0, i);
          patternCtx.quadraticCurveTo(size/2, i + 5, size, i);
          patternCtx.stroke();
        }
        break;

      case 'stone':
        // Stone texture pattern
        patternCtx.fillStyle = '#696969';
        patternCtx.fillRect(0, 0, size, size);
        // Add random stone-like shapes
        for (let i = 0; i < 10; i++) {
          patternCtx.fillStyle = `hsl(0, 0%, ${40 + Math.random() * 20}%)`;
          patternCtx.beginPath();
          patternCtx.arc(Math.random() * size, Math.random() * size, 
            Math.random() * 10 + 5, 0, Math.PI * 2);
          patternCtx.fill();
        }
        break;      case 'fabric': {
        // Fabric weave pattern
        patternCtx.fillStyle = '#F5F5DC';
        patternCtx.fillRect(0, 0, size, size);
        patternCtx.strokeStyle = '#DEB887';
        patternCtx.lineWidth = 1;
        const spacing = size / 10;
        for (let i = 0; i <= size; i += spacing) {
          patternCtx.beginPath();
          patternCtx.moveTo(i, 0);
          patternCtx.lineTo(i, size);
          patternCtx.moveTo(0, i);
          patternCtx.lineTo(size, i);
          patternCtx.stroke();
        }
        break;
      }

      default:
        return null;
    }

    return ctx.createPattern(patternCanvas, 'repeat');
  };

  const drawWithSymmetry = (x: number, y: number, drawFunc: (x: number, y: number) => void) => {
    const settings = creationState.selectedTool.settings;
    if (!settings || !settings.symmetryType || !creationState.symmetryEnabled) {
      drawFunc(x, y);
      return;
    }

    const centerX = creationState.symmetryAxis?.x || creationState.canvasSize.width / 2;
    const centerY = creationState.symmetryAxis?.y || creationState.canvasSize.height / 2;

    switch (settings.symmetryType) {
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
        break;      case 'radial': {
        const points = settings.symmetryPoints || 4;
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
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setIsDrawing(true);
    setLastPos({ x, y });
    setStartPos({ x, y });

    // Handle text tool click
    if (creationState.selectedTool.type === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle =
            creationState.selectedTool.settings?.color || "#000000";
          ctx.font = `${
            creationState.selectedTool.settings?.size || 20
          }px Arial`;
          ctx.fillText(text, x, y);
        }
      }
      setIsDrawing(false); // Don't continue drawing for text
      return;
    }
    // For shapes, save current canvas state for preview
    if (creationState.selectedTool.type === "shape") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Create preview canvas if it doesn't exist
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          setPreviewCanvas(tempCanvas);
        }
      }
    }
    if (creationState.selectedTool.type === "brush") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }    // Handle eraser tool - start erasing immediately on click
    if (creationState.selectedTool.type === "eraser") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          (creationState.selectedTool.settings?.size || 20) / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }
    }

    // Handle gradient tools - save start position for gradient creation
    if (creationState.selectedTool.type === "gradient") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Save current canvas state for preview
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          setPreviewCanvas(tempCanvas);
        }
      }
    }

    // Handle pattern tools - start painting with pattern immediately
    if (creationState.selectedTool.type === "pattern") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pattern = createPattern(ctx);
        if (pattern) {
          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = pattern;
          ctx.globalAlpha = creationState.selectedTool.settings?.opacity || 0.8;
          
          const drawPattern = (px: number, py: number) => {
            ctx.beginPath();
            ctx.arc(px, py, (creationState.selectedTool.settings?.size || 20) / 2, 0, Math.PI * 2);
            ctx.fill();
          };

          drawWithSymmetry(x, y, drawPattern);
          ctx.restore();
        }
      }
    }

    // Handle symmetry tool activation
    if (creationState.selectedTool.type === "symmetry") {
      // Toggle symmetry mode and set axis
      onStateUpdate({
        symmetryEnabled: !creationState.symmetryEnabled,
        symmetryAxis: { x, y }
      });
      setIsDrawing(false);
      return;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);    if (creationState.selectedTool.type === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = creationState.selectedTool.settings?.color || "#000000";
      ctx.lineWidth = creationState.selectedTool.settings?.size || 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Create smooth line from last position to current position
      const drawBrushStroke = (fromX: number, fromY: number, toX: number, toY: number) => {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      };      if (creationState.symmetryEnabled) {
        drawWithSymmetry(x, y, (px: number, py: number) => {
          const lastSymX = lastPos.x;
          const lastSymY = lastPos.y;
          drawBrushStroke(lastSymX, lastSymY, px, py);
        });
      } else {
        drawBrushStroke(lastPos.x, lastPos.y, x, y);
      }
    }else if (creationState.selectedTool.type === "eraser") {
      // Set eraser mode - remove pixels using destination-out
      ctx.save(); // Save current context state
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)"; // Color doesn't matter for destination-out
      ctx.fillStyle = "rgba(0,0,0,1)"; // For round eraser effect
      ctx.lineWidth = creationState.selectedTool.settings?.size || 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw eraser line from last position to current position
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Also draw circles at each point for smoother erasing
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        (creationState.selectedTool.settings?.size || 20) / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();      ctx.restore(); // Restore context state
    } else if (creationState.selectedTool.type === "gradient" && previewCanvas) {
      // Gradient preview: restore original canvas and draw gradient preview
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(previewCanvas, 0, 0);

      // Create and apply gradient
      const gradient = createGradient(ctx, startPos.x, startPos.y, x, y);
      if (gradient) {
        ctx.fillStyle = gradient;
        ctx.globalAlpha = creationState.selectedTool.settings?.opacity || 1;
        
        // Fill entire canvas or specific area based on gradient type
        if (creationState.selectedTool.settings?.gradientType === 'linear') {
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // For radial and conic, fill from center
          ctx.beginPath();
          const radius = Math.sqrt((x - startPos.x) ** 2 + (y - startPos.y) ** 2);
          ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      }
    } else if (creationState.selectedTool.type === "pattern") {
      // Pattern brush drawing
      const pattern = createPattern(ctx);
      if (pattern) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = pattern;
        ctx.globalAlpha = creationState.selectedTool.settings?.opacity || 0.8;
        
        const drawPattern = (px: number, py: number) => {
          ctx.beginPath();
          ctx.arc(px, py, (creationState.selectedTool.settings?.size || 20) / 2, 0, Math.PI * 2);
          ctx.fill();
        };

        drawWithSymmetry(x, y, drawPattern);
        ctx.restore();
      }
    } else if (creationState.selectedTool.type === "shape" && previewCanvas) {
      // Shape preview: restore original canvas and draw shape preview
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(previewCanvas, 0, 0);

      // Draw shape preview
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = creationState.selectedTool.settings?.color || "#000000";
      ctx.lineWidth = creationState.selectedTool.settings?.size || 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const width = x - startPos.x;
      const height = y - startPos.y;

      if (creationState.selectedTool.id === "rectangle") {
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (creationState.selectedTool.id === "circle") {
        const radius = Math.sqrt(width * width + height * height);
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // For shapes, finalize the shape drawing
    if (creationState.selectedTool.type === "shape" && canvasRef.current) {
      // The final shape is already drawn on canvas from the last draw call
      // Just need to save to history
    }

    // Save to history
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL();
      // Update layer content and save to history
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
  const selectTool = (tool: CanvasTool) => {
    onStateUpdate({ selectedTool: tool });
  };

  // Color and size updates
  const updateToolColor = (color: string) => {
    onStateUpdate({
      selectedTool: {
        ...creationState.selectedTool,
        settings: {
          ...creationState.selectedTool.settings,
          color,
        },
      },
    });
    setShowColorPicker(false);
  };

  const updateToolSize = (size: number) => {
    onStateUpdate({
      selectedTool: {
        ...creationState.selectedTool,
        settings: {
          ...creationState.selectedTool.settings,
          size,
        },
      },
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
  }; // Canvas setup
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = creationState.canvasSize.width;
      canvas.height = creationState.canvasSize.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas to transparent instead of white background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Set up initial canvas properties
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [creationState.canvasSize, canvasRef]);  const getToolIcon = (toolType: string) => {
    const tool = tools.find((t) => t.type === toolType);
    if (tool?.id === "rectangle") return <Square className="w-5 h-5" />;
    if (tool?.id === "circle") return <Circle className="w-5 h-5" />;
    if (tool?.id === "gradient-linear") return <Zap className="w-5 h-5" />;
    if (tool?.id === "gradient-radial") return <Circle className="w-5 h-5" />;
    if (tool?.id === "gradient-conic") return <RotateCcw className="w-5 h-5" />;
    if (tool?.id === "pattern-wood") return <TreePine className="w-5 h-5" />;
    if (tool?.id === "pattern-stone") return <Mountain className="w-5 h-5" />;
    if (tool?.id === "pattern-fabric") return <Grid3X3 className="w-5 h-5" />;
    if (tool?.id === "symmetry") return <RotateCcw className="w-5 h-5" />;

    switch (toolType) {
      case "brush":
        return <Brush className="w-5 h-5" />;
      case "eraser":
        return <Eraser className="w-5 h-5" />;
      case "text":
        return <Type className="w-5 h-5" />;
      case "shape":
        return <Square className="w-5 h-5" />;
      case "gradient":
        return <Zap className="w-5 h-5" />;
      case "pattern":
        return <Grid3X3 className="w-5 h-5" />;
      case "symmetry":
        return <RotateCcw className="w-5 h-5" />;
      default:
        return <Brush className="w-5 h-5" />;
    }
  };

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
        <div className="grid grid-cols-5 gap-2 mb-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => selectTool(tool)}
              className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
                creationState.selectedTool.id === tool.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={tool.name}
            >
              {getToolIcon(tool.type)}
            </button>
          ))}
        </div>

        {/* Tool Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Color Picker */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Color</label>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 relative overflow-hidden"
              style={{
                backgroundColor:
                  creationState.selectedTool.settings?.color || "#000000",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </button>

            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateToolColor(color)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Size Slider */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Size: {creationState.selectedTool.settings?.size || 10}px
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="50"
                value={creationState.selectedTool.settings?.size || 10}
                onChange={(e) => updateToolSize(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex space-x-1">
                {sizes.slice(0, 4).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateToolSize(size)}
                    className={`px-2 py-1 text-xs rounded ${
                      creationState.selectedTool.settings?.size === size
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}              </div>
            </div>
          </div>

          {/* Gradient Settings */}
          {creationState.selectedTool.type === "gradient" && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Gradient Colors
              </label>
              <div className="space-y-2">
                {creationState.selectedTool.settings?.gradientColors?.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => {
                        const newColors = [...(creationState.selectedTool.settings?.gradientColors || [])];
                        newColors[index] = { ...stop, color: e.target.value };
                        onStateUpdate({
                          selectedTool: {
                            ...creationState.selectedTool,
                            settings: {
                              ...creationState.selectedTool.settings,
                              gradientColors: newColors
                            }
                          }
                        });
                      }}
                      className="w-8 h-8 rounded border"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={stop.position}
                      onChange={(e) => {
                        const newColors = [...(creationState.selectedTool.settings?.gradientColors || [])];
                        newColors[index] = { ...stop, position: parseFloat(e.target.value) };
                        onStateUpdate({
                          selectedTool: {
                            ...creationState.selectedTool,
                            settings: {
                              ...creationState.selectedTool.settings,
                              gradientColors: newColors
                            }
                          }
                        });
                      }}
                      className="flex-1"
                    />
                    <span className="text-xs w-10">{Math.round(stop.position * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Settings */}
          {creationState.selectedTool.type === "pattern" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Pattern Scale
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={creationState.selectedTool.settings?.patternScale || 1}
                onChange={(e) => {
                  onStateUpdate({
                    selectedTool: {
                      ...creationState.selectedTool,
                      settings: {
                        ...creationState.selectedTool.settings,
                        patternScale: parseFloat(e.target.value)
                      }
                    }
                  });
                }}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x</span>
                <span>{creationState.selectedTool.settings?.patternScale || 1}x</span>
                <span>3x</span>
              </div>
            </div>
          )}

          {/* Symmetry Settings */}
          {creationState.selectedTool.type === "symmetry" && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Symmetry Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['horizontal', 'vertical', 'bilateral', 'radial'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onStateUpdate({                        selectedTool: {
                          ...creationState.selectedTool,
                          settings: {
                            ...creationState.selectedTool.settings,
                            symmetryType: type as 'horizontal' | 'vertical' | 'radial' | 'bilateral'
                          }
                        }
                      });
                    }}
                    className={`px-3 py-2 text-xs rounded capitalize ${
                      creationState.selectedTool.settings?.symmetryType === type
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {creationState.selectedTool.settings?.symmetryType === 'radial' && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Points: {creationState.selectedTool.settings?.symmetryPoints || 4}</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={creationState.selectedTool.settings?.symmetryPoints || 4}
                    onChange={(e) => {
                      onStateUpdate({
                        selectedTool: {
                          ...creationState.selectedTool,
                          settings: {
                            ...creationState.selectedTool.settings,
                            symmetryPoints: parseInt(e.target.value)
                          }
                        }
                      });
                    }}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
              {creationState.symmetryEnabled && (
                <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-xs text-green-700 dark:text-green-300">
                  Symmetry Mode Active - Click on canvas to set axis
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Canvas Area */}
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
        </div>{" "}
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
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-32 overflow-y-auto">
          {creationState.layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                index === creationState.activeLayer
                  ? "bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700"
                  : "bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => selectLayer(index)}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(index);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium">{layer.name}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(layer.opacity * 100)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CreationView;
