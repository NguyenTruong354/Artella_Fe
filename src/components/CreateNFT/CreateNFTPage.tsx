import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  RotateCw,
  Grid,
  Monitor,
  Brush,
  Download,
  Save,
  HelpCircle, // Import HelpCircle icon for the shortcut button
  X, // Import X icon for closing the shortcut guide
  Upload, // Import Upload icon for NFT creation button
  RefreshCw, // Import RefreshCw icon for refreshing user info
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
import NFTSuccessModal from "./NFTSuccessModal.tsx";
import useDarkMode from "../../hooks/useDarkMode";
import { WaveTransition } from "../WaveTransition";
import { nftService } from "../../api/services/nftService";
import { authService } from "../../api/services/authService";

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
      environment: "gallery",  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false); // State for shortcut guide visibility
  const [showNFTForm, setShowNFTForm] = useState(false); // State for NFT creation form visibility
  const [isCreatingNFT, setIsCreatingNFT] = useState(false); // State for NFT creation loading
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [createdNFTData, setCreatedNFTData] = useState<{
    id?: string;
    name?: string;
    description?: string;
    tokenId?: string;
    nftId?: string;
    category?: string;
    owner?: string;
    creator?: string;
    contractAddress?: string;
    imageUrl?: string;
    royaltyPercentage?: number;
    createdAt?: string;
    mintedAt?: string;
  } | null>(null); // Store created NFT data

  // Initialize history when canvas is ready
  useEffect(() => {
    if (canvasRef.current && creationState.history.length === 0) {
      // Initialize with empty canvas state
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas and set up initial state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const initialImageData = canvas.toDataURL();
        
        setCreationState(prev => ({
          ...prev,
          layers: prev.layers.map((layer, index) =>
            index === 0 ? { ...layer, content: initialImageData } : layer
          ),
          history: [{
            layers: prev.layers.map((layer, index) =>
              index === 0 ? { ...layer, content: initialImageData } : layer
            ),
            timestamp: Date.now(),
          }],
          historyIndex: 0,
        }));
      }
    }  }, [creationState.history.length]);

  // Auto-fill creator information from user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (authService.isAuthenticated()) {
          console.log('🔍 Fetching user profile for creator info...');
          const response = await authService.getUserProfile();
          
          if (response.success && response.data) {
            const { walletAddress, fullName, email } = response.data;
            
            // Determine creator name: prefer wallet address, then full name, then email
            let creatorName = 'Current User';
            if (walletAddress && walletAddress.trim()) {
              creatorName = walletAddress;
            } else if (fullName && fullName.trim()) {
              creatorName = fullName;
            } else if (email && email.trim()) {
              creatorName = email;
            }
            
            console.log('✅ Auto-filling creator:', creatorName);
            
            // Update NFT metadata with creator info
            setNftMetadata(prev => ({
              ...prev,
              creator: creatorName
            }));
          }
        } else {
          console.log('⚠️ User not authenticated, using default creator');
        }
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        // Keep default creator value on error
      }
    };

    fetchUserProfile();
  }, []); // Run once on component mount
  
  // Available tools (memoized to prevent useEffect dependency issues)
  const tools: CanvasTool[] = useMemo(() => [
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
    { id: "pattern-fabric", name: "Fabric Pattern", icon: "grid", type: "pattern",      settings: { patternType: "fabric", patternScale: 1, opacity: 0.8 }
    },
    // Symmetry tool
    { id: "symmetry", name: "Symmetry", icon: "reflect", type: "symmetry",
      settings: { symmetryType: "bilateral", symmetryPoints: 2 }
    }
  ], []);

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
        
        // Apply the state from history
        const newState = {
          ...prev,
          layers: historyState.layers,
          historyIndex: newIndex,
        };

        // Redraw canvas with the previous state
        setTimeout(() => {
          if (canvasRef.current && historyState.layers[prev.activeLayer]) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx && historyState.layers[prev.activeLayer].content) {
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              };
              img.src = historyState.layers[prev.activeLayer].content;
            }
          }
        }, 0);

        return newState;
      }
      return prev;
    });
  }, [canvasRef]);

  const handleRedo = useCallback(() => {
    setCreationState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const historyState = prev.history[newIndex];
        
        // Apply the state from history
        const newState = {
          ...prev,
          layers: historyState.layers,
          historyIndex: newIndex,
        };

        // Redraw canvas with the next state
        setTimeout(() => {
          if (canvasRef.current && historyState.layers[prev.activeLayer]) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx && historyState.layers[prev.activeLayer].content) {
              const img = new Image();
              img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              };
              img.src = historyState.layers[prev.activeLayer].content;
            }
          }
        }, 0);

        return newState;
      }
      return prev;
    });
  }, [canvasRef]);

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
    link.click();  }, [nftMetadata, creationState, gallerySettings]);

  // Handle NFT creation
  const handleCreateNFT = useCallback(async () => {
    if (!canvasRef.current) {
      alert('Canvas not available');
      return;
    }

    if (!nftMetadata.name.trim()) {
      alert('Please enter NFT name');
      return;
    }

    if (!nftMetadata.description.trim()) {
      alert('Please enter NFT description');
      return;
    }

    setIsCreatingNFT(true);
    
    try {
      // Get image data from canvas as base64
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      
      // Prepare request data
      const requestData = {
        image: imageData,
        name: nftMetadata.name,
        description: nftMetadata.description,
        category: nftMetadata.category || 'Art',
        owner: nftMetadata.creator || 'Current User',
        tags: nftMetadata.attributes?.map(attr => attr.value).join(', ') || '',
        royaltyPercentage: nftMetadata.royalty?.toString() || '5'
      };      console.log('🎨 Creating NFT with data:', {
        name: requestData.name,
        description: requestData.description,
        category: requestData.category,
        owner: requestData.owner,
        hasImage: !!requestData.image
      });      // Call API to create NFT
      const createdNFT = await nftService.createDigitalArtNFTFromDrawingSimple(requestData);
      
      console.log('✅ NFT created successfully:', createdNFT);
      
      // Store created NFT data for modal
      setCreatedNFTData({
        id: createdNFT?.id,
        name: createdNFT?.name || requestData.name,
        description: createdNFT?.description || requestData.description,
        tokenId: createdNFT?.tokenId,
        nftId: createdNFT?.nftId,
        category: createdNFT?.category || requestData.category,
        owner: createdNFT?.owner || requestData.owner,
        creator: createdNFT?.creator,
        contractAddress: createdNFT?.contractAddress,
        imageUrl: createdNFT?.imageUrl,
        royaltyPercentage: createdNFT?.royaltyPercentage || parseFloat(requestData.royaltyPercentage),
        createdAt: createdNFT?.createdAt,
        mintedAt: createdNFT?.mintedAt,
      });
      
      // Close form and show success modal
      setShowNFTForm(false);
      setShowSuccessModal(true);
      
      // Optionally reset form or navigate
      // You can add navigation logic here if needed
      
    } catch (error) {
      console.error('❌ Error creating NFT:', error);
      
      // Better error handling
      let errorMessage = 'Failed to create NFT. Please try again.';
        if (error && typeof error === 'object') {
        if ('message' in error && error.message) {
          errorMessage = error.message as string;
        } else if ('response' in error && error.response) {
          const response = error.response as { data?: { message?: string }; message?: string };
          if (response.data && response.data.message) {
            errorMessage = response.data.message;
          } else if (response.message) {
            errorMessage = response.message;
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.log('📝 Formatted error message:', errorMessage);
      alert(errorMessage);
    } finally {
      setIsCreatingNFT(false);
    }}, [nftMetadata]);

  // Handle refresh user profile for creator field
  const handleRefreshUserProfile = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        console.log('🔄 Refreshing user profile for creator info...');
        const response = await authService.getUserProfile();
        
        if (response.success && response.data) {
          const { walletAddress, fullName, email } = response.data;
          
          // Determine creator name: prefer wallet address, then full name, then email
          let creatorName = 'Current User';
          if (walletAddress && walletAddress.trim()) {
            creatorName = walletAddress;
          } else if (fullName && fullName.trim()) {
            creatorName = fullName;
          } else if (email && email.trim()) {
            creatorName = email;
          }
          
          console.log('✅ Refreshed creator info:', creatorName);
          
          // Update NFT metadata with creator info
          setNftMetadata(prev => ({
            ...prev,
            creator: creatorName
          }));
        }
      } else {
        console.log('⚠️ User not authenticated');
        alert('Please login to auto-fill creator information');
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
      alert('Failed to refresh user information');
    }  }, []);

  // Handle success modal close and reset for creating another NFT
  const handleSuccessModalClose = useCallback(() => {
    setShowSuccessModal(false);
    setCreatedNFTData(null);
    // Optionally reset some form fields
    // setNftMetadata(prev => ({ ...prev, name: '', description: '' }));
  }, []);

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
              </div>              {/* Shortcut Button */}
              <button
                onClick={() => setShowShortcutGuide(!showShortcutGuide)}
                className="hidden lg:flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="View Shortcuts"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Shortcuts</span>
              </button>
              {/* Create NFT Button */}
              <button
                onClick={() => setShowNFTForm(!showNFTForm)}
                className="flex items-center space-x-2 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                title="Create NFT from Drawing"
              >
                <Upload className="w-3 h-3" />
                <span>Create NFT</span>
              </button>
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

          {/* Shortcut Guide Modal/Panel */}
          <AnimatePresence>
            {showShortcutGuide && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed top-20 right-8 lg:right-1/4 lg:left-1/4 xl:right-1/3 xl:left-1/3 z-50 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Keyboard Shortcuts
                  </h3>
                  <button
                    onClick={() => setShowShortcutGuide(false)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li><strong>Ctrl + Z:</strong> Undo</li>
                  <li><strong>Ctrl + Y / Ctrl + Shift + Z:</strong> Redo</li>
                  <li><strong>Ctrl + S:</strong> Save Project</li>
                  <li><strong>Ctrl + E:</strong> Export as PNG</li>
                  <li className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700"><strong>B:</strong> Select Brush Tool</li>
                  <li><strong>E:</strong> Select Eraser Tool</li>
                  <li><strong>T:</strong> Select Text Tool</li>
                </ul>
              </motion.div>            )}
          </AnimatePresence>

          {/* NFT Creation Form Modal */}
          <AnimatePresence>
            {showNFTForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowNFTForm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Create NFT from Drawing
                      </h3>
                      <button
                        onClick={() => setShowNFTForm(false)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* NFT Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          NFT Name *
                        </label>
                        <input
                          type="text"
                          value={nftMetadata.name}
                          onChange={(e) => setNftMetadata(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Enter NFT name"
                          disabled={isCreatingNFT}
                        />
                      </div>

                      {/* NFT Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={nftMetadata.description}
                          onChange={(e) => setNftMetadata(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                          placeholder="Describe your NFT artwork"
                          rows={3}
                          disabled={isCreatingNFT}
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={nftMetadata.category}
                          onChange={(e) => setNftMetadata(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          disabled={isCreatingNFT}
                        >
                          <option value="Art">Art</option>
                          <option value="Photography">Photography</option>
                          <option value="Music">Music</option>
                          <option value="Video">Video</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Collectibles">Collectibles</option>
                          <option value="Utility">Utility</option>
                        </select>
                      </div>                      {/* Creator */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Creator
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={nftMetadata.creator}
                            onChange={(e) => setNftMetadata(prev => ({ ...prev, creator: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Creator name or wallet address"
                            disabled={isCreatingNFT}
                          />
                          <button
                            type="button"
                            onClick={handleRefreshUserProfile}
                            disabled={isCreatingNFT}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Refresh from profile"
                          >
                            <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Auto-filled from your profile. Wallet address preferred, then name, then email.
                        </p>
                      </div>

                      {/* Royalty */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Royalty Percentage
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={nftMetadata.royalty}
                          onChange={(e) => setNftMetadata(prev => ({ ...prev, royalty: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="5"
                          disabled={isCreatingNFT}
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags (optional)
                        </label>
                        <input
                          type="text"
                          value={nftMetadata.attributes?.map(attr => attr.value).join(', ') || ''}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                            const attributes = tags.map(tag => ({ trait_type: 'tag', value: tag }));
                            setNftMetadata(prev => ({ ...prev, attributes }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="art, digital, creative"
                          disabled={isCreatingNFT}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Separate tags with commas
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setShowNFTForm(false)}
                        disabled={isCreatingNFT}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateNFT}
                        disabled={isCreatingNFT || !nftMetadata.name.trim() || !nftMetadata.description.trim()}
                        className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                      >
                        {isCreatingNFT ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Create NFT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>          {/* Main Content Area */}
          <motion.main
            className={`grid gap-6 ${getViewClasses()}`}
            variants={itemVariants}
          >
            {viewMode.type === "split" ? (
              // Split view without AnimatePresence to avoid conflicts
              <>
                <motion.div
                  key="creation-view-split"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <CreationView
                    creationState={creationState}
                    onStateUpdate={handleCanvasUpdate}
                    canvasRef={canvasRef}
                  />
                </motion.div>

                <motion.div
                  key="gallery-view-split"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <GalleryView
                    nftMetadata={nftMetadata}
                    gallerySettings={gallerySettings}
                    onSettingsChange={setGallerySettings}
                  />
                </motion.div>
              </>
            ) : (
              // Single view with AnimatePresence mode="wait"
              <AnimatePresence mode="wait">
                {viewMode.type === "creation" && (
                  <motion.div
                    key="creation-view"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <CreationView
                      creationState={creationState}
                      onStateUpdate={handleCanvasUpdate}
                      canvasRef={canvasRef}
                    />

                    <NFTMetadataForm
                      metadata={nftMetadata}
                      onMetadataChange={setNftMetadata}
                    />
                  </motion.div>
                )}

                {viewMode.type === "gallery" && (
                  <motion.div
                    key="gallery-view"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <GalleryView
                      nftMetadata={nftMetadata}
                      gallerySettings={gallerySettings}
                      onSettingsChange={setGallerySettings}
                    />
                    
                    <NFTMetadataForm
                      metadata={nftMetadata}
                      onMetadataChange={setNftMetadata}
                    />
                  </motion.div>
                )}
              </AnimatePresence>            )}
          </motion.main>          {/* NFT Success Modal */}
          <NFTSuccessModal
            isOpen={showSuccessModal}
            onClose={handleSuccessModalClose}
            nftData={createdNFTData || {}}
            imagePreview={canvasRef.current?.toDataURL('image/png')}
          />
        </motion.div>
      </div>
    </>
  );
};

export default CreateNFTPage;
