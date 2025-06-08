import React, { useEffect, useState, RefObject } from 'react';
import { motion } from 'framer-motion';
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
  ZoomOut
} from 'lucide-react';

import { CreationState, CanvasTool, CanvasLayer } from './types';

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
  canvasRef
}) => {  
  const [isDrawing, setIsDrawing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
  
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080'
  ];

  const sizes = [2, 5, 10, 15, 20, 30, 40, 50];

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
    if (creationState.selectedTool.type === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = creationState.selectedTool.settings?.color || '#000000';
          ctx.font = `${creationState.selectedTool.settings?.size || 20}px Arial`;
          ctx.fillText(text, x, y);
        }
      }
      setIsDrawing(false); // Don't continue drawing for text
      return;
    }
      // For shapes, save current canvas state for preview
    if (creationState.selectedTool.type === 'shape') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create preview canvas if it doesn't exist
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          setPreviewCanvas(tempCanvas);
        }
      }
    }
    
    if (creationState.selectedTool.type === 'brush') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      if (creationState.selectedTool.type === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = creationState.selectedTool.settings?.color || '#000000';
      ctx.lineWidth = creationState.selectedTool.settings?.size || 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Create smooth line from last position to current position
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (creationState.selectedTool.type === 'eraser') {
      // Set eraser mode - remove pixels using destination-out
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)'; // Any color works for eraser in destination-out mode
      ctx.lineWidth = creationState.selectedTool.settings?.size || 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw eraser line from last position to current position
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Reset composite operation back to normal for other tools
      ctx.globalCompositeOperation = 'source-over';
    } else if (creationState.selectedTool.type === 'shape' && previewCanvas) {
      // Shape preview: restore original canvas and draw shape preview
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(previewCanvas, 0, 0);
      
      // Draw shape preview
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = creationState.selectedTool.settings?.color || '#000000';
      ctx.lineWidth = creationState.selectedTool.settings?.size || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const width = x - startPos.x;
      const height = y - startPos.y;
      
      if (creationState.selectedTool.id === 'rectangle') {
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      } else if (creationState.selectedTool.id === 'circle') {
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
    if (creationState.selectedTool.type === 'shape' && canvasRef.current) {
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
            timestamp: Date.now()
          }
        ],
        historyIndex: creationState.historyIndex + 1
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
          color
        }
      }
    });
    setShowColorPicker(false);
  };

  const updateToolSize = (size: number) => {
    onStateUpdate({
      selectedTool: {
        ...creationState.selectedTool,
        settings: {
          ...creationState.selectedTool.settings,
          size
        }
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
      content: '',
      type: 'drawing'
    };
    
    onStateUpdate({
      layers: [...creationState.layers, newLayer],
      activeLayer: creationState.layers.length
    });
  };

  const toggleLayerVisibility = (layerIndex: number) => {
    onStateUpdate({
      layers: creationState.layers.map((layer, index) =>
        index === layerIndex ? { ...layer, visible: !layer.visible } : layer
      )
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
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [creationState.canvasSize, canvasRef]);

  const getToolIcon = (toolType: string) => {
    const tool = tools.find(t => t.type === toolType);
    if (tool?.id === 'rectangle') return <Square className="w-5 h-5" />;
    if (tool?.id === 'circle') return <Circle className="w-5 h-5" />;
    
    switch (toolType) {
      case 'brush': return <Brush className="w-5 h-5" />;
      case 'eraser': return <Eraser className="w-5 h-5" />;
      case 'text': return <Type className="w-5 h-5" />;
      case 'shape': return <Square className="w-5 h-5" />;
      default: return <Brush className="w-5 h-5" />;
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
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
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
              style={{ backgroundColor: creationState.selectedTool.settings?.color || '#000000' }}
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
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
        </div>
        
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair max-w-full h-auto"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ 
              transform: `scale(${creationState.zoom})`,
              transformOrigin: 'top left'
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
                  ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                  : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
