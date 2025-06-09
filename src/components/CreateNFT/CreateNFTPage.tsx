import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  RotateCw,
  Grid,
  Monitor,
  Brush,
  Download,
  Save,
} from "lucide-react";

import {
  NFTMetadata,
  CreationState,
  ViewMode,
  GalleryPreviewSettings,
  CanvasTool,
} from "./types";
import CreationView from "./CreationView.tsx";
import GalleryView from "./GalleryView.tsx";
import NFTMetadataForm from "./NFTMetadataForm.tsx";
import useDarkMode from "../../hooks/useDarkMode";
import { WaveTransition } from "../WaveTransition";

const CreateNFTPage: React.FC = () => {
  const darkMode = useDarkMode();
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: "split",
    isTransitioning: false,
  });  const [creationState, setCreationState] = useState<CreationState>({
    activeLayer: 0,
    layers: [
      {
        id: "layer-1",
        name: "Background",
        visible: true,
        opacity: 1,
        content: "",
        type: "drawing",
      },
    ],
    selectedTool: {
      id: "brush",
      name: "Brush",
      icon: "brush",
      type: "brush",
      settings: {
        size: 10,
        color: "#000000",
        opacity: 1,
      },
    },
    canvasSize: { width: 800, height: 800 },
    zoom: 1,
    history: [],
    historyIndex: -1,
    symmetryEnabled: false,
    symmetryAxis: { x: 400, y: 400 }, // Center of 800x800 canvas
  });

  const [nftMetadata, setNftMetadata] = useState<NFTMetadata>({
    name: "",
    description: "",
    image: "",
    attributes: [],
    creator: "Current User",
    royalty: 5,
    category: "Art",
  });

  const [gallerySettings, setGallerySettings] =
    useState<GalleryPreviewSettings>({
      background: "dark",
      frame: "modern",
      lighting: "spotlight",
      environment: "gallery",
    });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Available tools
  const tools: CanvasTool[] = [
    { id: "brush", name: "Brush", icon: "brush", type: "brush" },
    { id: "eraser", name: "Eraser", icon: "eraser", type: "eraser" },
    { id: "text", name: "Text", icon: "type", type: "text" },
    { id: "rectangle", name: "Rectangle", icon: "square", type: "shape" },
    { id: "circle", name: "Circle", icon: "circle", type: "shape" },
    // New gradient tools
    { id: "gradient-linear", name: "Linear Gradient", icon: "gradient", type: "gradient", 
      settings: { gradientType: "linear", gradientColors: [
        { color: "#FF0000", position: 0 },
        { color: "#0000FF", position: 1 }
      ], gradientAngle: 0 }
    },
    { id: "gradient-radial", name: "Radial Gradient", icon: "circle", type: "gradient",
      settings: { gradientType: "radial", gradientColors: [
        { color: "#FF0000", position: 0 },
        { color: "#0000FF", position: 1 }
      ]}
    },
    { id: "gradient-conic", name: "Conic Gradient", icon: "spiral", type: "gradient",
      settings: { gradientType: "conic", gradientColors: [
        { color: "#FF0000", position: 0 },
        { color: "#00FF00", position: 0.5 },
        { color: "#0000FF", position: 1 }
      ]}
    },
    // Pattern tools
    { id: "pattern-wood", name: "Wood Pattern", icon: "tree", type: "pattern",
      settings: { patternType: "wood", patternScale: 1, opacity: 0.8 }
    },
    { id: "pattern-stone", name: "Stone Pattern", icon: "mountain", type: "pattern",
      settings: { patternType: "stone", patternScale: 1, opacity: 0.8 }
    },
    { id: "pattern-fabric", name: "Fabric Pattern", icon: "grid", type: "pattern",
      settings: { patternType: "fabric", patternScale: 1, opacity: 0.8 }
    },
    // Symmetry tool
    { id: "symmetry", name: "Symmetry", icon: "reflect", type: "symmetry",
      settings: { symmetryType: "bilateral", symmetryPoints: 2 }
    }
  ];

  // Toggle view modes with smooth transition
  const toggleViewMode = useCallback(async (newMode: ViewMode["type"]) => {
    setViewMode((prev) => ({ ...prev, isTransitioning: true }));

    // Wait for transition animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    setViewMode({ type: newMode, isTransitioning: false });
  }, []);

  // Synchronized canvas update handler
  const handleCanvasUpdate = useCallback((newState: Partial<CreationState>) => {
    setCreationState((prev) => ({ ...prev, ...newState }));

    // Generate preview image for gallery view
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png");
      setNftMetadata((prev) => ({ ...prev, image: imageData }));
    }
  }, []);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    setCreationState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const historyState = prev.history[newIndex];
        return {
          ...prev,
          layers: historyState.layers,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);
  const handleRedo = useCallback(() => {
    setCreationState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const historyState = prev.history[newIndex];
        return {
          ...prev,
          layers: historyState.layers,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  // Export canvas functionality
  const handleExportCanvas = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.download = `${nftMetadata.name || "nft-artwork"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, [nftMetadata.name]);
  const handleSaveProject = useCallback(() => {
    const projectData = {
      metadata: nftMetadata,
      creationState,
      gallerySettings,
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.download = `${nftMetadata.name || "nft-project"}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, [nftMetadata, creationState, gallerySettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case "y":
            e.preventDefault();
            handleRedo();
            break;
          case "s":
            e.preventDefault();
            handleSaveProject();
            break;
          case "e":
            e.preventDefault();
            handleExportCanvas();
            break;
        }
      }

      // Tool shortcuts
      switch (e.key) {
        case "b":
        case "B":
          if (!e.ctrlKey && !e.metaKey) {
            const brushTool = tools.find((t) => t.type === "brush");
            if (brushTool) handleCanvasUpdate({ selectedTool: brushTool });
          }
          break;
        case "e":
        case "E":
          if (!e.ctrlKey && !e.metaKey) {
            const eraserTool = tools.find((t) => t.type === "eraser");
            if (eraserTool) handleCanvasUpdate({ selectedTool: eraserTool });
          }
          break;
        case "t":
        case "T":
          if (!e.ctrlKey && !e.metaKey) {
            const textTool = tools.find((t) => t.type === "text");
            if (textTool) handleCanvasUpdate({ selectedTool: textTool });
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleSaveProject,
    handleExportCanvas,
    handleCanvasUpdate,
    tools,
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
      },
    },
  };

  const getViewClasses = () => {
    switch (viewMode.type) {
      case "creation":
        return "grid-cols-1";
      case "gallery":
        return "grid-cols-1";
      default:
        return "grid-cols-1 lg:grid-cols-2";
    }
  };

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      <div className="min-h-screen transition-all duration-500 p-4 sm:p-6 lg:p-8 relative overflow-hidden gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"></div>
        </div>

        <motion.div
          className="relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with view controls */}
          <motion.header
            className="flex flex-col sm:flex-row justify-between items-center mb-8"
            variants={itemVariants}
          >
            {" "}
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
                Create NFT
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Dual-Reality Studio
              </div>
              <div className="hidden lg:block text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                Shortcuts: Ctrl+Z/Y (Undo/Redo), Ctrl+S (Save), Ctrl+E (Export),
                B/E/T (Tools)
              </div>
            </div>
            {/* View Mode Controls */}
            <div className="flex items-center space-x-2 backdrop-blur-sm rounded-2xl p-2 bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50">
              <button
                onClick={() => toggleViewMode("creation")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  viewMode.type === "creation"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Brush className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </button>

              <button
                onClick={() => toggleViewMode("split")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  viewMode.type === "split"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Split</span>
              </button>

              <button
                onClick={() => toggleViewMode("gallery")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  viewMode.type === "gallery"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>{" "}
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportCanvas}
                className="p-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400/30 hover:scale-105 transition-all duration-200 shadow-lg"
                title="Export as PNG"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={handleSaveProject}
                className="p-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-blue-400/30 hover:scale-105 transition-all duration-200 shadow-lg"
                title="Save Project"
              >
                <Save className="w-5 h-5" />
              </button>

              <button
                onClick={handleUndo}
                disabled={creationState.historyIndex <= 0}
                className="p-2 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50 disabled:opacity-50 hover:scale-105 transition-all duration-200"
                title="Undo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handleRedo}
                disabled={
                  creationState.historyIndex >= creationState.history.length - 1
                }
                className="p-2 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-[#1A1A1A]/80 border border-gray-200/50 dark:border-gray-800/50 disabled:opacity-50 hover:scale-105 transition-all duration-200"
                title="Redo"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </motion.header>

          {/* Main Content Area */}
          <motion.main
            className={`grid gap-6 ${getViewClasses()}`}
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {/* Creation View */}
              {(viewMode.type === "creation" || viewMode.type === "split") && (
                <motion.div
                  key="creation-view"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >                  <CreationView
                    creationState={creationState}
                    onStateUpdate={handleCanvasUpdate}
                    canvasRef={canvasRef}
                  />

                  {viewMode.type === "creation" && (
                    <NFTMetadataForm
                      metadata={nftMetadata}
                      onMetadataChange={setNftMetadata}
                    />
                  )}
                </motion.div>
              )}

              {/* Gallery View */}
              {(viewMode.type === "gallery" || viewMode.type === "split") && (
                <motion.div
                  key="gallery-view"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {" "}
                  <GalleryView
                    nftMetadata={nftMetadata}
                    gallerySettings={gallerySettings}
                    onSettingsChange={setGallerySettings}
                  />
                  {viewMode.type === "gallery" && (
                    <NFTMetadataForm
                      metadata={nftMetadata}
                      onMetadataChange={setNftMetadata}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>
        </motion.div>
      </div>
    </>
  );
};

export default CreateNFTPage;
