import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Home,
  Volume2,
  Shield,
  Info,
  Sparkles,
  Camera,
  Tag, // For price
  BarChart2, // For stats
  DollarSign, // For price
  Wallet, // For wallet connection
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { WaveTransition } from "../components/WaveTransition";
import { nftService } from "../api/services";
import { DigitalArtNFT, PaymentRequestDTO } from "../api/types";
import SmartImage from "../components/SmartImage";

// Define a type for the provider injected by MetaMask
interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  request: <T>(args: { method: string; params?: unknown[] }) => Promise<T>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

// Define a type for the Web3 constructor if it's loaded from a script
// We are defining a simplified Web3 interface here because the project doesn't have 'web3' in package.json
// It's loaded via a script tag.
interface Web3 {
  eth: {
    getBlock(
      blockIdentifier: string | number
    ): Promise<{ baseFeePerGas?: number | string | null }>;
    getGasPrice(): Promise<string>;
    estimateGas(callObject: {
      from?: string | null;
      to: string;
      value: string;
    }): Promise<number>;
    getBalance(address: string): Promise<string>;
    getChainId(): Promise<number>;
    net: {
      getId(): Promise<number>;
    };
  };
  utils: {
    toWei(value: string, unit: string): string;
    toHex(value: string | number | bigint): string;
    fromWei(value: string, unit: string): string;
  };
}

interface Web3Constructor {
  new (provider: MetaMaskEthereumProvider | string): Web3;
}

// Extend the Window interface
declare global {
  interface Window {
    ethereum?: MetaMaskEthereumProvider;
    Web3?: Web3Constructor;
  }
}

interface AudioGuideInfo {
  title: string;
  content: string;
  duration: string;
}

const DetailNFT: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isLoading, setIsLoading] = useState(true);
  const [nftData, setNftData] = useState<DigitalArtNFT | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAudioGuide, setActiveAudioGuide] = useState<string | null>(null);
  const [similarNFTs, setSimilarNFTs] = useState<DigitalArtNFT[]>([]);
  const [similarNFTsLoading, setSimilarNFTsLoading] = useState(false);
  // MetaMask payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Dark mode hook
  const darkMode = useDarkMode();

  // Helper function to truncate long addresses (like wallet addresses or contract addresses)
  const truncateAddress = useCallback(
    (address: string, startLength: number = 6, endLength: number = 4) => {
      if (!address || address.length <= startLength + endLength) return address;
      return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
    },
    []
  );

  // Initialize Web3 and connect wallet
  const initializeWeb3 = useCallback(async () => {
    try {
      if (typeof window.ethereum !== "undefined" && window.Web3) {
        const Web3 = window.Web3;
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        return web3Instance;
      } else {
        console.error(
          "MetaMask or Web3 not detected. Please ensure MetaMask is installed and the Web3 script is loaded."
        );
        return null;
      }
    } catch (error) {
      console.error("Error initializing Web3:", error);
      return null;
    }
  }, []);

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setPaymentStatus(
          "MetaMask not detected. Please install MetaMask extension."
        );
        return null;
      }

      const web3Instance = await initializeWeb3();
      if (!web3Instance) {
        setPaymentStatus("Failed to initialize Web3");
        return null;
      }

      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setPaymentStatus("No accounts found. Please connect your wallet.");
        return null;
      }

      const account = accounts[0];
      setCurrentAccount(account);
      setPaymentStatus(`Connected: ${truncateAddress(account)}`);
      return account;
    } catch (error: unknown) {
      console.error("Error connecting wallet:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      setPaymentStatus("Failed to connect wallet: " + message);
      return null;
    }
  }, [initializeWeb3, truncateAddress]);
  // Get optimal gas settings (currently unused - keeping for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getOptimalGasSettings = useCallback(
    async (web3Instance: Web3, to: string, value: string) => {
      try {
        const latestBlock = await web3Instance.eth.getBlock("latest");
        const supportsEIP1559 =
          latestBlock.baseFeePerGas !== undefined &&
          latestBlock.baseFeePerGas !== null;
        const gasSettings: {
          maxFeePerGas?: string;
          maxPriorityFeePerGas?: string;
          gasPrice?: string;
          gas?: string;
        } = {};

        if (supportsEIP1559 && latestBlock.baseFeePerGas) {
          const baseFeePerGas = BigInt(latestBlock.baseFeePerGas);
          const maxPriorityFeePerGas = web3Instance.utils.toWei("2", "gwei");
          const maxFeePerGas = (
            baseFeePerGas * BigInt(2) +
            BigInt(maxPriorityFeePerGas)
          ).toString();

          gasSettings.maxFeePerGas = "0x" + BigInt(maxFeePerGas).toString(16);
          gasSettings.maxPriorityFeePerGas =
            "0x" + BigInt(maxPriorityFeePerGas).toString(16);
        } else {
          const gasPrice = await web3Instance.eth.getGasPrice();
          gasSettings.gasPrice =
            "0x" + (BigInt(gasPrice) * BigInt(2)).toString(16);
        }

        // Estimate gas limit
        let gasLimit = 210000; // Increased default gas limit
        try {
          const estimatedGas = await web3Instance.eth.estimateGas({
            from: currentAccount,
            to: to,
            value: value,
          });
          gasLimit = Math.floor(Number(estimatedGas) * 1.2);
        } catch (gasEstError) {
          console.warn("Gas estimation failed, using default:", gasEstError);
        }

        gasSettings.gas = "0x" + gasLimit.toString(16);
        return gasSettings;
      } catch (error) {
        console.error("Error getting gas settings:", error);
        // Fallback gas settings
        return {
          value,
          gas: "0x" + (210000).toString(16),
          gasPrice: "0x" + web3Instance.utils.toWei("20", "gwei").toString(16),
        };
      }
    },
    [currentAccount]
  );

  // Fetch similar NFTs by category
  const fetchSimilarNFTs = useCallback(
    async (category: string, currentNFTId: string) => {
      try {
        setSimilarNFTsLoading(true);
        console.log("🔍 Fetching similar NFTs for category:", category);

        const similarNFTsResponse =
          await nftService.getDigitalArtNFTsByCategory(category);

        // Filter out current NFT and limit to 3 items
        const filteredSimilarNFTs = similarNFTsResponse
          .filter((nft) => nft.id !== currentNFTId)
          .slice(0, 3);

        console.log("✅ Similar NFTs received:", filteredSimilarNFTs);
        setSimilarNFTs(filteredSimilarNFTs);
      } catch (err) {
        console.error("❌ Error fetching similar NFTs:", err);
        // Don't show error for similar NFTs, just keep empty array
        setSimilarNFTs([]);
      } finally {
        setSimilarNFTsLoading(false);
      }
    },
    []
  );

  // Fetch NFT data from API
  const fetchNFTData = useCallback(async () => {
    if (!id) {
      setError("No NFT ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // console.log('🔍 Fetching NFT data for ID:', id); // Debug log, consider removing for production

      const nftResponse = await nftService.getDigitalArtNFTById(id);
      // console.log('✅ NFT data received:', nftResponse); // Debug log

      setNftData(nftResponse);

      // Fetch similar NFTs after getting main NFT data
      if (nftResponse && nftResponse.category) {
        fetchSimilarNFTs(nftResponse.category, nftResponse.id);
      }
    } catch (err) {
      // console.error('❌ Error fetching NFT data:', err); // Debug log
      if (err instanceof Error && err.message.includes("not found")) {
        setError("Artwork not found.");
      } else {
        setError("Failed to load NFT data. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchSimilarNFTs]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    if (!isLoading) {
      controls.start("visible");
    }
  }, [controls, isLoading]);
  useEffect(() => {
    fetchNFTData();

    // console.log("🏛️ Welcome to the Digital Museum Experience!"); // Debug log
    // console.log("✨ NFT Detail Page: Active"); // Debug log
    // console.log("🎧 Audio Guide: Ready"); // Debug log
    // console.log("🖱️ Interactive Features: Enabled"); // Debug log
  }, [fetchNFTData]);

  // Initialize MetaMask check in separate useEffect
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request<string[]>({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            const web3Instance = await initializeWeb3();
            if (web3Instance) {
              setWeb3(web3Instance);
            }
          }
        } catch (error) {
          console.log("MetaMask check failed:", error);
        }
      }
    };
    checkMetaMask();
  }, [initializeWeb3]);

  // Generate mock properties based on NFT data
  const generateMockProperties = (nft: DigitalArtNFT) => [
    { trait: "Category", value: nft.category, rarity: "15%" },
    {
      trait: "Creation Method",
      value: nft.creationMethod,
      rarity: nft.creationMethod === "DRAWING" ? "8%" : "25%",
    },
    { trait: "Royalty", value: `${nft.royaltyPercentage}%`, rarity: "12%" },
    {
      trait: "Status",
      value: nft.onSale ? "For Sale" : "Collection",
      rarity: "20%",
    },
  ];

  const mockProperties = nftData ? generateMockProperties(nftData) : [];
  // Audio guide sound simulation
  const playAudioGuideSound = useCallback((type: string) => {
    console.log(`🎧 Audio Guide: Playing ${type} information`);
  }, []);

  // Audio guide information
  const audioGuideInfo: { [key: string]: AudioGuideInfo } = {
    artwork: {
      title: "About the Artwork",
      content:
        nftData?.description ||
        "Detailed information about this artwork is being prepared.",
      duration: "2:34",
    },
    artist: {
      title: "Meet the Artist",
      content: `This piece was created by ${
        nftData?.creator || "an esteemed artist"
      }. More details about their background and other works are available in the gallery.`,
      duration: "1:48",
    },
    technique: {
      title: "Artistic Technique",
      content: `This artwork was created using the '${
        nftData?.creationMethod || "unique digital"
      }' method. It showcases a blend of modern digital tools and artistic vision.`,
      duration: "3:12",
    },
  };
  // Main purchase function
  const handlePurchaseNFT = useCallback(async () => {
    if (!nftData || !nftData.id) {
      setPaymentStatus("NFT data not available");
      return;
    }

    // Check if user is authenticated
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      setPaymentStatus(
        "Please log in to purchase NFTs. You need to be authenticated to complete transactions."
      );
      return;
    }

    // Check if NFT is available for sale
    if (!nftData.onSale) {
      setPaymentStatus("This NFT is not currently for sale");
      return;
    }

    if (!nftData.price || nftData.price <= 0) {
      setPaymentStatus("Invalid NFT price");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setPaymentStatus("Initializing purchase...");

      // Step 1: Connect wallet if not connected
      let account = currentAccount;
      if (!account) {
        account = await connectWallet();
        if (!account) {
          setIsProcessingPayment(false);
          return;
        }
      }

      // Step 2: Initialize Web3 if not already done
      let web3Instance = web3;
      if (!web3Instance) {
        web3Instance = await initializeWeb3();
        if (!web3Instance) {
          setPaymentStatus("Failed to initialize Web3");
          setIsProcessingPayment(false);
          return;
        }
      }
      setPaymentStatus("Preparing MetaMask payment...");

      // Step 3: Prepare MetaMask payment
      let prepareResponse;
      try {
        prepareResponse = await nftService.prepareMetaMaskPayment(nftData.id);
        console.log("🦊 MetaMask preparation response:", prepareResponse);
      } catch (prepareError: unknown) {
        console.error("❌ Error in prepare step:", prepareError);

        // Handle specific error cases
        if (
          typeof prepareError === "object" &&
          prepareError !== null &&
          "status" in prepareError
        ) {
          const err = prepareError as { status: number; message?: string };
          if (err.status === 400) {
            setPaymentStatus(
              "This NFT is not available for purchase. It may already be sold or not listed for sale."
            );
          } else if (err.status === 401) {
            setPaymentStatus(
              "Authentication required. Please log in to purchase NFTs."
            );
          } else if (err.status === 404) {
            setPaymentStatus(
              "NFT not found. Please refresh the page and try again."
            );
          } else {
            setPaymentStatus(
              `Server error (${err.status}): ${err.message || "Unknown error"}`
            );
          }
        } else {
          setPaymentStatus(
            "Failed to prepare payment. Please check your connection and try again."
          );
        }
        return;
      }

      if (!prepareResponse || !prepareResponse.transactionData) {
        setPaymentStatus("Invalid payment data received from server");
        return;
      }

      const { transactionData } = prepareResponse;
      setPaymentStatus("Processing payment...");
      // Handle value conversion like in mau.html
      const originalValue = transactionData.value;
      console.log("🔍 Backend value analysis:", {
        value: originalValue,
        type: typeof originalValue,
        asNumber: Number(originalValue),
        asString: String(originalValue),
      });

      // IMPORTANT: Let's first understand what backend is sending
      console.log("🚨 DEBUGGING VALUE CONVERSION:");
      console.log("Raw backend value:", originalValue);
      console.log("Type:", typeof originalValue);

      // In mau.html, backend sends ETH amount (like 0.02)
      // Let's assume backend always sends ETH amount for now
      let ethAmount: number;

      if (typeof originalValue === "number") {
        ethAmount = originalValue;
      } else if (typeof originalValue === "string") {
        ethAmount = parseFloat(originalValue);
      } else {
        ethAmount = 0.01; // fallback small amount
      }

      console.log("� Interpreted ETH amount:", ethAmount);

      // Safety check - if the amount seems too large, something is wrong
      if (ethAmount > 100) {
        console.error(
          "🚨 DANGEROUS: Trying to send",
          ethAmount,
          "ETH! This seems wrong!"
        );
        setPaymentStatus(
          `⚠️ Error: Amount too large (${ethAmount} ETH). Please check the backend data.`
        );
        return;
      }

      if (ethAmount <= 0) {
        console.error("� Invalid amount:", ethAmount);
        setPaymentStatus("⚠️ Error: Invalid payment amount");
        return;
      }
      // Convert ETH to Wei properly
      const valueInWei = web3Instance.utils.toWei(
        ethAmount.toString(),
        "ether"
      );

      console.log("✅ Final conversion:");
      console.log("  ETH amount:", ethAmount);
      console.log("  Wei amount:", valueInWei);
      console.log("  Wei length:", valueInWei.length); // Convert to hex like in mau.html - IMPORTANT: convert string to BigInt first
      const valueInHex = "0x" + BigInt(valueInWei).toString(16);

      // Display value for user (convert back to ETH for display)
      const displayValue = web3Instance.utils.fromWei(valueInWei, "ether");

      console.log("💰 Final value conversion:", {
        original: originalValue,
        wei: valueInWei,
        hex: valueInHex,
        displayETH: displayValue,
      }); // Step 4: Check account balance before sending
      const balance = await web3Instance.eth.getBalance(account);
      const balanceInEth = parseFloat(
        web3Instance.utils.fromWei(balance, "ether")
      );
      const requiredEth = parseFloat(displayValue);

      console.log("💰 Balance check:", {
        accountBalance: balanceInEth + " ETH",
        requiredAmount: requiredEth + " ETH",
        sufficient: balanceInEth >= requiredEth,
      });

      if (balanceInEth < requiredEth) {
        setPaymentStatus(
          `Insufficient balance. You have ${balanceInEth.toFixed(
            4
          )} ETH but need ${requiredEth} ETH`
        );
        return;
      }      // Step 5: Get optimal gas settings like in mau.html
      console.log("🔍 Getting optimal gas settings...");

      // Get network information
      const networkId = await web3Instance.eth.net.getId();
      const chainId = await web3Instance.eth.getChainId();
      const latestBlock = await web3Instance.eth.getBlock("latest");

      console.log("🔍 Network Info:", {
        networkId,
        chainId,
        baseFeePerGas: latestBlock.baseFeePerGas,
      });

      // Check if network supports EIP-1559
      const supportsEIP1559 =
        latestBlock.baseFeePerGas !== undefined &&
        latestBlock.baseFeePerGas !== null;      const baseParams = {
        from: account,
        to: transactionData.to,
        value: valueInHex,
      };

      let transactionParams: {
        from: string;
        to: string;
        value: string;
        maxFeePerGas?: string;
        maxPriorityFeePerGas?: string;
        gasPrice?: string;
        gas?: string;
        type?: string;
      } = { ...baseParams };

      if (supportsEIP1559) {
        // EIP-1559 networks
        console.log("⚡ Using EIP-1559 gas strategy");

        const baseFeeWei = Number(latestBlock.baseFeePerGas);
        let priorityFeeGwei = 1; // Reduced to 1 gwei

        if (chainId === 31337 || chainId === 1337) {
          priorityFeeGwei = 1; // Keep low for local network
        }

        const priorityFeeWei = priorityFeeGwei * 1000000000;
        const maxFeePerGasWei = baseFeeWei * 2 + priorityFeeWei;

        transactionParams = {
          ...baseParams,
          maxFeePerGas: "0x" + Math.floor(maxFeePerGasWei).toString(16),
          maxPriorityFeePerGas: "0x" + Math.floor(priorityFeeWei).toString(16),
          type: "0x2"
        };

        console.log("💰 EIP-1559 Gas Details:", {
          baseFee: `${baseFeeWei} wei (${baseFeeWei / 1000000000} gwei)`,
          priorityFee: `${priorityFeeWei} wei (${priorityFeeGwei} gwei)`,
          maxFee: `${maxFeePerGasWei} wei (${maxFeePerGasWei / 1000000000} gwei)`,
        });
      } else {
        // Legacy networks (Hardhat local, some testnets)
        console.log("🔄 Using legacy gas strategy");
        let gasPrice;

        if (chainId === 31337 || chainId === 1337) {
          // Hardhat local network - use higher gas price for reliability
          const currentGasPrice = await web3Instance.eth.getGasPrice();
          gasPrice = Math.floor(Number(currentGasPrice) * 1.5);
          console.log("🏠 Hardhat network: Using 1.5x gas price for reliability");
        } else {
          // Other networks
          const currentGasPrice = await web3Instance.eth.getGasPrice();
          gasPrice = Math.floor(Number(currentGasPrice) * 1.2);
          console.log("🌐 Using dynamic gas pricing with 20% buffer");
        }

        transactionParams = {
          ...baseParams,
          gasPrice: "0x" + gasPrice.toString(16),
          type: "0x0"
        };

        console.log("💰 Legacy Gas Details:", {
          gasPrice: `${gasPrice} wei (${gasPrice / 1000000000} gwei)`,
        });
      }

      // Smart gas limit estimation with multiple fallbacks
      let gasLimit = 200000;

      try {
        const estimatedGas = await web3Instance.eth.estimateGas({
          from: account,
          to: transactionData.to,
          value: valueInHex,
        });
        gasLimit = Math.max(Math.floor(Number(estimatedGas) * 1.5), 150000);
        console.log("✅ Estimated gas limit:", estimatedGas, "→ With buffer:", gasLimit);
      } catch (gasEstError) {
        console.warn("⚠️ Direct gas estimation failed:", gasEstError);
        
        try {
          const fallbackGas = await web3Instance.eth.estimateGas({
            from: account,
            to: transactionData.to,
            value: "1", // Minimal value for estimation
          });
          gasLimit = Math.max(Number(fallbackGas) * 2, 150000);
          console.log("🔄 Fallback gas estimate:", fallbackGas, "→ Used:", gasLimit);
        } catch {
          console.warn("⚠️ All gas estimation failed, using conservative default:", gasLimit);
          
          if (chainId === 31337 || chainId === 1337) {
            gasLimit = 200000; // Higher for local testing
          } else {
            gasLimit = 150000; // Standard for mainnet
          }
        }
      }

      transactionParams = {
        ...transactionParams,
        gas: "0x" + gasLimit.toString(16)
      };

      console.log("⚙️ Final transaction parameters:", transactionParams);

      setPaymentStatus(`Ready to send ${displayValue} ETH to purchase NFT...`);

      if (!window.ethereum) {
        setPaymentStatus(
          "MetaMask connection lost. Please refresh and try again."
        );
        return;
      }

      const txHash = await window.ethereum.request<string>({
        method: "eth_sendTransaction",
        params: [transactionParams],
      });

      console.log("✅ Transaction sent:", txHash);
      setPaymentStatus("Transaction sent. Confirming with server...");

      // Step 6: Confirm payment with backend
      const paymentRequest: PaymentRequestDTO = {
        paymentMethod: "CRYPTO",
        transactionHash: txHash,
      };

      const confirmResponse = await nftService.processNFTPayment(
        nftData.id,
        paymentRequest
      );
      console.log("✅ Payment confirmed by server:", confirmResponse);

      setPaymentStatus("Purchase completed successfully!");

      // Refresh NFT data to update ownership
      setTimeout(() => {
        fetchNFTData();
        setPaymentStatus("");
      }, 3000);
    } catch (error: unknown) {
      console.error("❌ Purchase failed:", error);

      let errorMessage = "Purchase failed: ";
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: number; message?: string };
        if (err.code === 4001) {
          errorMessage += "User rejected the transaction";
        } else if (
          err.code === -32603 ||
          (err.message && err.message.includes("insufficient funds"))
        ) {
          errorMessage += "Insufficient funds for transaction";
        } else {
          errorMessage += err.message || "Unknown error";
        }
      } else if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "An unknown error occurred";
      }

      setPaymentStatus(errorMessage);

      setTimeout(() => {
        setPaymentStatus("");
      }, 5000);
    } finally {
      setIsProcessingPayment(false);
    }
  }, [
    nftData,
    currentAccount,
    web3,
    connectWallet,
    initializeWeb3,
    fetchNFTData,
  ]);

  const handleAudioGuide = (section: string) => {
    setActiveAudioGuide(activeAudioGuide === section ? null : section);
    if (activeAudioGuide !== section) {
      playAudioGuideSound(section);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-amber-300 text-sm font-medium font-serif">
              Preparing the exhibition...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error && error.includes("Artwork not found")) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Artwork Not Found
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              The requested NFT could not be found. It might have been moved or
              does not exist.
            </p>
            <button
              onClick={() => navigate("/Home/gallery")}
              className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center mx-auto shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Main Gallery
            </button>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Sparkles className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Exhibition Temporarily Unavailable
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              We encountered an issue loading the artwork details: {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={fetchNFTData}
                className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Retry Loading
              </button>
              <button
                onClick={() => navigate("/Home")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Museum Entrance
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!nftData) {
    // This case should ideally be covered by the isLoading or error states above.
    // If nftData is null after loading and no error, it implies an issue not caught.
    // For robustness, we can show a generic "not found" or redirect.
    return (
      <>
        <WaveTransition
          isTransitioning={darkMode.isTransitioning}
          isDark={darkMode.isDark}
        />
        <div className="min-h-screen flex items-center justify-center transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="text-center p-8">
            <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mb-2 font-serif">
              Artwork Details Unavailable
            </h2>
            <p className="text-gray-600 dark:text-amber-300/80 mb-6">
              The details for this artwork could not be loaded at this time.
            </p>
            <button
              onClick={() => navigate("/Home/gallery")}
              className="px-6 py-3 bg-blue-500 dark:bg-amber-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-amber-600 transition-colors duration-300 font-medium flex items-center justify-center mx-auto shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-amber-500/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Main Gallery
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      {/* Museum Exhibition Layout */}
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-gray-100"
      >
        {/* Gallery Lighting Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 transition-all duration-500 bg-gradient-radial from-blue-200/20 via-blue-100/10 to-transparent dark:bg-gradient-radial dark:from-amber-200/20 dark:via-amber-100/10 dark:to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-64 h-64 transition-all duration-500 bg-gradient-radial from-purple-300/15 via-purple-200/8 to-transparent dark:bg-gradient-radial dark:from-amber-300/15 dark:via-amber-200/8 dark:to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-1/4 w-48 h-48 transition-all duration-500 bg-gradient-radial from-cyan-400/10 via-cyan-300/5 to-transparent dark:bg-gradient-radial dark:from-amber-400/10 dark:via-amber-300/5 dark:to-transparent rounded-full blur-xl"></div>
        </div>{" "}
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back to Gallery */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-serif"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Main Gallery</span>
            <span className="sm:hidden">Back</span>
          </motion.button>

          {/* Main Exhibition Layout */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Artwork Display - Museum Style */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="relative">
                {/* Artwork Frame */}
                <div className="relative bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:bg-gradient-to-br dark:from-amber-900/20 dark:to-amber-800/10 p-8 rounded-lg border-4 border-gray-300/50 dark:border-amber-700/40 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-gray-100/20 dark:bg-gradient-radial dark:from-transparent dark:via-transparent dark:to-black/30 pointer-events-none"></div>

                  <div className="aspect-square rounded-lg overflow-hidden bg-white/50 dark:bg-black/50 shadow-2xl relative group transition-all duration-500">
                    <SmartImage
                      imageId={nftData.imageUrl}
                      alt={nftData.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-5"
                      fallbackCategory={nftData.category}
                    />

                    {/* Museum Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:bg-gradient-to-br dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none"></div>

                    {/* Security/Preservation Indicators */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-green-500 dark:text-green-400 transition-all duration-500">
                        <Shield className="w-4 h-4" />
                      </div>
                      {nftData.creationMethod === "DRAWING" && (
                        <div className="p-2 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full text-purple-500 dark:text-purple-400 transition-all duration-500">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Audio Guide Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <motion.button
                        onClick={() => handleAudioGuide("artwork")}
                        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          activeAudioGuide === "artwork"
                            ? "bg-blue-500 dark:bg-amber-500 text-white shadow-lg shadow-blue-500/30 dark:shadow-amber-500/30"
                            : "bg-white/70 dark:bg-black/70 text-blue-600 dark:text-amber-300 hover:bg-blue-50 dark:hover:bg-amber-900/50"
                        }`}
                        title="Audio Guide: About the Artwork"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Volume2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Artwork Information Panel - Museum Style */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 transition-all duration-500">
                <motion.h1
                  className="text-4xl font-bold mb-3 text-gray-900 dark:text-amber-100 font-serif tracking-tight leading-tight"
                  variants={itemVariants}
                >
                  {nftData.name}
                </motion.h1>{" "}
                <motion.p
                  className="text-lg text-gray-600 dark:text-amber-300/80 mb-6 font-sans"
                  variants={itemVariants}
                >
                  By{" "}
                  <span
                    className="font-semibold text-blue-600 dark:text-amber-400 cursor-pointer hover:text-blue-700 dark:hover:text-amber-300 transition-colors"
                    title={nftData.creator} // Show full creator address on hover
                    onClick={() => {
                      navigator.clipboard.writeText(nftData.creator);
                      console.log(
                        "Copied creator address to clipboard:",
                        nftData.creator
                      );
                    }}
                  >
                    {nftData.creator.startsWith("0x") &&
                    nftData.creator.length > 20
                      ? truncateAddress(nftData.creator, 6, 4)
                      : nftData.creator}
                  </span>
                </motion.p>
                <motion.div
                  className="flex items-center space-x-6 mb-8 text-sm text-gray-500 dark:text-amber-300/70"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-500 dark:text-amber-500" />
                    <span>{nftData.viewCount.toLocaleString()} Views</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" />
                    <span>{nftData.likeCount.toLocaleString()} Likes</span>
                  </div>
                </motion.div>{" "}
                {/* Current Price Section */}
                {nftData.onSale ? (
                  <motion.div className="mb-8" variants={itemVariants}>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-amber-300/70 mb-2 uppercase tracking-wider font-sans">
                      Current Price
                    </h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-amber-400 font-serif">
                      {nftData.price.toLocaleString()} ETH
                    </p>

                    {/* Purchase Button */}
                    <div className="mt-4 space-y-3">
                      {paymentStatus && (
                        <div
                          className={`p-3 rounded-lg text-sm font-medium ${
                            paymentStatus.includes("successfully") ||
                            paymentStatus.includes("completed")
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50"
                              : paymentStatus.includes("failed") ||
                                paymentStatus.includes("error") ||
                                paymentStatus.includes("rejected")
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700/50"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50"
                          }`}
                        >
                          {paymentStatus}
                        </div>
                      )}

                      <button
                        onClick={handlePurchaseNFT}
                        disabled={isProcessingPayment}
                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r font-semibold rounded-lg shadow-lg transition-all duration-300 transform ${
                          isProcessingPayment
                            ? "from-gray-400 to-gray-500 cursor-not-allowed"
                            : "from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 hover:scale-105 hover:shadow-xl"
                        } text-white`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Wallet className="w-5 h-5" />
                            <span>Buy with MetaMask</span>
                            <span className="text-sm font-normal opacity-90">
                              ({nftData.price} ETH)
                            </span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 dark:text-amber-400/70 text-center">
                        Secure payment powered by MetaMask • Gas fees apply
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div className="mb-8" variants={itemVariants}>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-amber-300/70 mb-2 uppercase tracking-wider font-sans">
                      Availability
                    </h3>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          Not For Sale
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This NFT is currently not available for purchase. It's
                        part of a private collection.
                      </p>
                    </div>
                  </motion.div>
                )}
                <motion.div className="flex space-x-3" variants={itemVariants}>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-medium">
                    <Heart className="w-5 h-5" />
                    <span>Favorite</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100/80 to-white/80 border border-gray-300/50 dark:bg-gradient-to-r dark:from-amber-900/40 dark:to-amber-800/30 backdrop-blur-sm rounded-lg dark:border dark:border-amber-700/30 hover:from-gray-200/90 hover:to-white/90 dark:hover:from-amber-800/50 dark:hover:to-amber-700/40 transition-all duration-300 text-gray-700 dark:text-amber-200 hover:text-gray-900 dark:hover:text-amber-100 font-medium">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Detailed Information Tabs - Museum Style */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight">
              Artwork Details
            </h2>
            <div className="mb-10 prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-amber-300/90 prose-headings:font-serif prose-headings:text-gray-800 dark:prose-headings:text-amber-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-500 dark:text-amber-500" />
                Curator's Note
              </h3>
              <p className="leading-relaxed whitespace-pre-wrap">
                {nftData.description}
              </p>
            </div>
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-amber-200 font-serif">
                <Award className="w-6 h-6 mr-3 text-purple-500 dark:text-purple-400" />
                Key Attributes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockProperties.map((prop, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50/70 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    variants={itemVariants}
                  >
                    <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans">
                      {prop.trait}
                    </p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-amber-200 mt-1">
                      {prop.value}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-2">
                      Rarity: {prop.rarity}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>{" "}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-amber-200 font-serif">
                <Shield className="w-6 h-6 mr-3 text-green-500 dark:text-green-400" />
                Blockchain Provenance
              </h3>
              <div className="space-y-5">
                {" "}
                {[
                  {
                    label: "Contract Address",
                    value: truncateAddress(nftData.contractAddress),
                    fullValue: nftData.contractAddress, // Keep full value for copy or tooltip
                    icon: (
                      <Calendar className="w-5 h-5 text-blue-500 dark:text-amber-500" />
                    ),
                  },
                  {
                    label: "Token ID",
                    value: nftData.tokenId,
                    icon: (
                      <Tag className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    ),
                  },
                  {
                    label: "NFT Standard",
                    value: "ERC-721 (Assumed)",
                    icon: (
                      <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                    ),
                  },
                  {
                    label: "Minted On",
                    value: new Date(nftData.mintedAt).toLocaleDateString(),
                    icon: (
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ),
                  },
                  {
                    label: "Created On",
                    value: new Date(nftData.createdAt).toLocaleDateString(),
                    icon: (
                      <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ),
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50/70 dark:bg-gray-700/50 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3 text-sm font-medium text-gray-600 dark:text-amber-300/80">
                        {item.label}:
                      </span>
                    </div>
                    <span
                      className="text-sm text-gray-800 dark:text-amber-200 font-mono break-all cursor-pointer hover:text-blue-600 dark:hover:text-amber-400 transition-colors"
                      title={item.fullValue || item.value} // Show full value on hover
                      onClick={() => {
                        if (item.fullValue) {
                          navigator.clipboard.writeText(item.fullValue);
                          console.log("Copied to clipboard:", item.fullValue);
                        }
                      }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* NEW: Marketplace Insights Section */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <BarChart2 className="w-8 h-8 mr-3 text-blue-500 dark:text-amber-500" />
              Marketplace Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sale Status */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Sale Status
                </p>
                <p
                  className={`text-2xl font-semibold mt-2 ${
                    nftData.onSale
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-amber-300"
                  }`}
                >
                  {nftData.onSale ? "Currently For Sale" : "Not For Sale"}
                </p>
                {nftData.onSale && (
                  <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                    Available for purchase
                  </p>
                )}
              </motion.div>

              {/* Price */}
              {nftData.onSale && (
                <motion.div
                  className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  variants={itemVariants}
                >
                  <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Current Price
                  </p>
                  <p className="text-2xl font-semibold text-blue-600 dark:text-amber-400 mt-2">
                    {nftData.price.toLocaleString()} ETH
                  </p>
                  <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                    (Excluding gas fees)
                  </p>
                </motion.div>
              )}

              {/* View Count */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Total Views
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-amber-200 mt-2">
                  {nftData.viewCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                  Impressions on this artwork
                </p>
              </motion.div>

              {/* Like Count */}
              <motion.div
                className="bg-gray-50/70 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <p className="text-xs text-gray-500 dark:text-amber-400/80 uppercase tracking-wider font-sans flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Total Likes
                </p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-2">
                  {nftData.likeCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 dark:text-amber-500/70 mt-1">
                  Community appreciation
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Audio Guide Section - Museum Style */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 mb-16 transition-all duration-500"
            variants={itemVariants}
          >
            {/* ... existing Audio Guide ... */}
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <Volume2 className="w-8 h-8 mr-3 text-blue-500 dark:text-amber-500" />
              Interactive Audio Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(audioGuideInfo).map(([key, info]) => (
                <motion.button
                  key={key}
                  onClick={() => handleAudioGuide(key)}
                  className={`p-6 rounded-lg border transition-all duration-300 transform hover:-translate-y-1 ${
                    activeAudioGuide === key
                      ? "bg-blue-500 dark:bg-amber-500 text-white shadow-blue-500/40 dark:shadow-amber-500/40"
                      : "bg-gray-50/70 dark:bg-gray-700/50 border-gray-200/80 dark:border-amber-800/50 hover:shadow-md"
                  }`}
                  variants={itemVariants}
                >
                  <h4 className="text-lg font-semibold mb-2 text-left">
                    {info.title}
                  </h4>
                  <p
                    className={`text-sm text-left ${
                      activeAudioGuide === key
                        ? "text-blue-100 dark:text-amber-100"
                        : "text-gray-600 dark:text-amber-300/80"
                    }`}
                  >
                    Duration: {info.duration}
                  </p>
                </motion.button>
              ))}
            </div>
            {activeAudioGuide && audioGuideInfo[activeAudioGuide] && (
              <motion.div
                className="mt-6 p-6 bg-gray-100/80 dark:bg-gray-700/60 rounded-lg border border-gray-200/80 dark:border-amber-800/50 shadow-inner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-amber-200 font-serif">
                  {audioGuideInfo[activeAudioGuide].title}
                </h4>
                <p className="text-gray-700 dark:text-amber-300/90 leading-relaxed whitespace-pre-wrap">
                  {audioGuideInfo[activeAudioGuide].content}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Similar Artworks Section - Museum Style */}
          <motion.div
            className="bg-gradient-to-br from-white/70 to-gray-100/50 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/50 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-200/50 dark:border-amber-700/30 transition-all duration-500"
            variants={itemVariants}
          >
            {/* ... existing Similar Artworks ... */}{" "}
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-amber-100 font-serif tracking-tight flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-purple-500 dark:text-purple-400" />
              Explore Similar Artworks
            </h2>
            {/* Loading state */}
            {similarNFTsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 dark:border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600 dark:text-amber-300">
                  Loading similar artworks...
                </span>
              </div>
            )}
            {/* Empty state */}
            {!similarNFTsLoading && similarNFTs.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-amber-300/80">
                  No similar artworks found in this category yet.
                </p>
              </div>
            )}
            {/* Similar NFTs grid */}
            {!similarNFTsLoading && similarNFTs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarNFTs.map((nft) => (
                  <motion.div
                    key={nft.id}
                    className="bg-white/80 dark:bg-gray-700/60 rounded-lg shadow-lg overflow-hidden border border-gray-200/80 dark:border-amber-800/50 group transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1.5"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative overflow-hidden aspect-square">
                      <SmartImage
                        imageId={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        fallbackCategory={nft.category}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-amber-200 font-serif">
                        {nft.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-amber-300/80 mb-1">
                        By{" "}
                        {nft.creator.startsWith("0x") && nft.creator.length > 20
                          ? truncateAddress(nft.creator, 6, 4)
                          : nft.creator}
                      </p>
                      {nft.onSale && (
                        <p className="text-lg font-bold text-blue-600 dark:text-amber-400">
                          {nft.price.toLocaleString()} ETH
                        </p>
                      )}
                      {!nft.onSale && (
                        <p className="text-sm text-gray-500 dark:text-amber-500/70">
                          Not for sale
                        </p>
                      )}
                      <button
                        onClick={() => navigate(`/Home/nft/${nft.id}`)}
                        className="mt-4 w-full px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-amber-500 dark:to-amber-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 dark:hover:from-amber-600 dark:hover:to-amber-700 transition-all duration-300 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DetailNFT;
