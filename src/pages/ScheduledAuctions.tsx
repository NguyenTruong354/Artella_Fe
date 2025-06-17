import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Package,
  Search,
  Plus,
  TrendingUp,
  Activity,
  Eye,
  Heart,
  BarChart3,
  Timer,
  Edit3,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { WaveTransition } from "../components/WaveTransition";
import { auctionScheduleService, authService } from "../api/services";
import { productService, Product } from "../api/services/productService";
import { ScheduledAuctionDetailDTO } from "../types/auction";
import SmartImage from "../components/SmartImage";
import "../styles/scheduledAuctions.css";

interface FormData {
  selectedProduct: Product | null;
  startPrice: number;
  endTime: number;
  scheduledTime: string;
  appraisalCert: string;
  imageUrl: string;
}

interface FormErrors {
  selectedProduct?: string;
  startPrice?: string;
  endTime?: string;
  scheduledTime?: string;
  appraisalCert?: string;
  imageUrl?: string;
}

const ScheduledAuctions: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });
  const darkMode = useDarkMode();

  // Main navigation state
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "create" | "my-auctions" | "upcoming" | "history"
  >("dashboard");

  // User profile state
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Product state
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Scheduled auctions state
  const [scheduledAuctions, setScheduledAuctions] = useState<
    ScheduledAuctionDetailDTO[]
  >([]);
  const [isLoadingScheduledAuctions, setIsLoadingScheduledAuctions] =
    useState(false);
  const [allScheduledAuctions, setAllScheduledAuctions] = useState<
    ScheduledAuctionDetailDTO[]
  >([]);

  // Stats state
  const [stats, setStats] = useState({
    totalScheduled: 0,
    pendingAuctions: 0,
    completedAuctions: 0,
    totalRevenue: 0,
    averagePrice: 0,
    successRate: 0,
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedProduct: null,
    startPrice: 0,
    endTime: 0,
    scheduledTime: "",
    appraisalCert: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Real-time timer for active auctions
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Fetch all scheduled auctions (both my auctions and public upcoming ones)
  const fetchAllAuctionsData = async () => {
    setIsLoadingScheduledAuctions(true);
    try {
      // Fetch my scheduled auctions
      const myAuctions = await auctionScheduleService.getMyScheduledAuctions();
      setScheduledAuctions(Array.isArray(myAuctions) ? myAuctions : []);

      // Fetch all upcoming scheduled auctions
      const allUpcoming =
        await auctionScheduleService.getUpcomingScheduledAuctions();
      setAllScheduledAuctions(Array.isArray(allUpcoming) ? allUpcoming : []);

      // Calculate stats
      if (Array.isArray(myAuctions)) {
        const total = myAuctions.length;
        const pending = myAuctions.filter((a) => a.status === "PENDING").length;
        const processed = myAuctions.filter(
          (a) => a.status === "PROCESSED"
        ).length;

        setStats({
          totalScheduled: total,
          pendingAuctions: pending,
          completedAuctions: processed,
          totalRevenue: 0, // Would need additional API call
          averagePrice:
            myAuctions.reduce((sum, a) => sum + a.startPrice, 0) / total || 0,
          successRate: total > 0 ? (processed / total) * 100 : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching auctions data:", error);
    } finally {
      setIsLoadingScheduledAuctions(false);
    }
  };
  // Update the main useEffect
  useEffect(() => {
    const fetchUserProducts = async () => {
      console.log("🔍 Starting fetchUserProducts...");

      // First, fetch user profile to get wallet address
      setIsLoadingProfile(true);
      try {
        console.log("🔍 Fetching user profile...");
        const profileResponse = await authService.getUserProfile();
        console.log("🔍 Profile API response:", profileResponse);

        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          console.log("✅ User profile loaded:", profile);
          console.log("🔍 Wallet address from profile:", profile.walletAddress);

          if (!profile.walletAddress) {
            console.log("❌ No wallet address in profile");
            setSubmitStatus("error");
            setSubmitMessage(
              "Please connect your wallet to create scheduled auctions"
            );
            return;
          }

          // Now fetch products with the wallet address
          setIsLoadingProducts(true);
          try {
            console.log(
              "🔍 Fetching products for wallet:",
              profile.walletAddress
            );
            const response = await productService.getProductsBySeller(
              profile.walletAddress,
              { page: 0, size: 100, sortBy: "createdAt", sortDir: "desc" }
            );

            console.log("📦 Products API response:", response);
            if (response.success && response.data) {
              console.log("✅ Products found:", response.data.content.length);
              console.log("📋 Products data:", response.data.content);
              setUserProducts(response.data.content);
              await fetchAllAuctionsData();
            } else {
              console.warn("⚠️ API response not successful:", response);
              setUserProducts([]);
            }
          } catch (error) {
            console.error("Error fetching user products:", error);
            setSubmitStatus("error");
            setSubmitMessage("Failed to load your products. Please try again.");
          } finally {
            setIsLoadingProducts(false);
          }
        } else {
          console.log(
            "❌ Failed to fetch user profile:",
            profileResponse.message
          );
          setSubmitStatus("error");
          setSubmitMessage(
            "Please connect your wallet to create scheduled auctions"
          );
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setSubmitStatus("error");
        setSubmitMessage("Failed to connect to your wallet. Please try again.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProducts();
  }, []);

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

  // Tab configuration
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "create", label: "Create Auction", icon: Plus },
    { id: "my-auctions", label: "My Auctions", icon: Package },
    { id: "upcoming", label: "Upcoming", icon: Timer },
    { id: "history", label: "History", icon: Activity },
  ];
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check if product is selected
    if (!formData.selectedProduct) {
      newErrors.selectedProduct =
        "Please select a product from your collection";
      setErrors(newErrors);
      return false;
    }

    // Check if selected product is available for auction
    if (!isProductAvailableForAuction(formData.selectedProduct)) {
      if (formData.selectedProduct.status === "Sold") {
        newErrors.selectedProduct =
          "Selected product has been sold and cannot be auctioned";
      } else if (formData.selectedProduct.isAuction) {
        newErrors.selectedProduct = "Selected product is already in auction";
      } else {
        newErrors.selectedProduct = `Selected product is not available (Status: ${formData.selectedProduct.status})`;
      }
      setErrors(newErrors);
      return false;
    }

    // Check if selected product has appraisal certificate
    if (
      !formData.selectedProduct.appraisalCert ||
      formData.selectedProduct.appraisalCert.trim() === ""
    ) {
      newErrors.selectedProduct =
        "Selected product must have an appraisal certificate to create an auction";
      setErrors(newErrors);
      return false;
    }

    // Check if selected product is already scheduled for auction
    if (isProductScheduledForAuction(formData.selectedProduct)) {
      const existingSchedule = scheduledAuctions.find(
        (sa) =>
          sa.productId === formData.selectedProduct!.productId &&
          (sa.status === "PENDING" || sa.status === "PROCESSED")
      );
      newErrors.selectedProduct = `Selected product is already scheduled for auction (Schedule ID: ${existingSchedule?.id}, Status: ${existingSchedule?.status})`;
      setErrors(newErrors);
      return false;
    }

    if (formData.startPrice <= 0) {
      newErrors.startPrice = "Start price must be greater than 0";
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = "Scheduled time is required";
    } else {
      const scheduledDate = new Date(formData.scheduledTime);
      const now = new Date();
      if (scheduledDate <= now) {
        newErrors.scheduledTime = "Scheduled time must be in the future";
      }
    }

    if (formData.endTime <= 0) {
      newErrors.endTime = "Auction duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setFormData((prev) => ({
      ...prev,
      selectedProduct: product,
      appraisalCert: product.appraisalCert || "",
      imageUrl: product.imageIds?.[0] || "",
    }));

    if (errors.selectedProduct) {
      setErrors((prev) => ({
        ...prev,
        selectedProduct: undefined,
      }));
    }
  };

  // Filter products based on search term
  const filteredProducts = userProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(productSearchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Check if product is available for auction
  const isProductAvailableForAuction = (product: Product): boolean => {
    const isAvailable = product.status === "Available";
    const notInAuction = !product.isAuction;
    return isAvailable && notInAuction;
  };

  // Check if product has valid appraisal certificate
  const hasValidAppraisalCert = (product: Product): boolean => {
    return !!(product.appraisalCert && product.appraisalCert.trim() !== "");
  };

  // Check if product is already scheduled for auction
  const isProductScheduledForAuction = (product: Product): boolean => {
    return scheduledAuctions.some(
      (scheduledAuction) =>
        scheduledAuction.productId === product.productId &&
        (scheduledAuction.status === "PENDING" ||
          scheduledAuction.status === "PROCESSED")
    );
  };

  // Check if product can be used for scheduled auction
  const canUseForScheduledAuction = (product: Product): boolean => {
    return (
      isProductAvailableForAuction(product) &&
      hasValidAppraisalCert(product) &&
      !isProductScheduledForAuction(product)
    );
  };

  // Calculate end time based on scheduled time and duration
  const calculateEndTime = (
    scheduledTime: string,
    durationHours: number
  ): number => {
    if (!scheduledTime || durationHours <= 0) return 0;

    const startTime = new Date(scheduledTime).getTime();
    return startTime + durationHours * 60 * 60 * 1000;
  };

  // Handle duration change
  const handleDurationChange = (durationHours: number) => {
    const endTime = calculateEndTime(formData.scheduledTime, durationHours);
    setFormData((prev) => ({
      ...prev,
      endTime,
    }));
  };

  // Handle scheduled time change
  const handleScheduledTimeChange = (scheduledTime: string) => {
    setFormData((prev) => {
      const durationHours =
        prev.endTime > 0
          ? (prev.endTime - new Date(prev.scheduledTime).getTime()) /
            (60 * 60 * 1000)
          : 24;
      const newEndTime = calculateEndTime(scheduledTime, durationHours);

      return {
        ...prev,
        scheduledTime,
        endTime: newEndTime,
      };
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await auctionScheduleService.scheduleAuction({
        productId: formData.selectedProduct!.productId,
        startPrice: formData.startPrice,
        endTime: formData.endTime,
        scheduledTime: formData.scheduledTime,
        ...(formData.appraisalCert.trim() && {
          appraisalCert: formData.appraisalCert,
        }),
        ...(formData.imageUrl.trim() && { imageUrl: formData.imageUrl }),
      });

      console.log("✅ Scheduled auction created:", response);
      setSubmitStatus("success");
      setSubmitMessage("Auction scheduled successfully!");

      // Reset form and refresh data
      setFormData({
        selectedProduct: null,
        startPrice: 0,
        endTime: 0,
        scheduledTime: "",
        appraisalCert: "",
        imageUrl: "",
      });

      // Refresh auction data
      await fetchAllAuctionsData();

      // Switch to my auctions tab after successful creation
      setTimeout(() => {
        setActiveTab("my-auctions");
        setSubmitStatus("idle");
        setSubmitMessage("");
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating scheduled auction:", error);
      setSubmitStatus("error");
      setSubmitMessage("Failed to schedule auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Check if auction is currently active/running
  const isAuctionActive = (auction: ScheduledAuctionDetailDTO): boolean => {
    if (auction.status !== "PROCESSED") return false;
    
    const scheduledTime = new Date(auction.scheduledTime).getTime();
    const endTime = auction.endTime;
    
    return currentTime >= scheduledTime && currentTime <= endTime;
  };// Calculate time remaining for active auction
  const getTimeRemaining = (auction: ScheduledAuctionDetailDTO): string => {
    if (!isAuctionActive(auction)) return "";
    
    const endTime = auction.endTime;
    const timeLeft = Math.max(0, endTime - currentTime);
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };  // Navigate to auction participation page
  const handleViewAuction = (auction: ScheduledAuctionDetailDTO) => {
    console.log("🔍 handleViewAuction called with auction:", auction);
    console.log("🔍 isAuctionActive:", isAuctionActive(auction));
    console.log("🔍 createdAuctionId:", auction.createdAuctionId);
    
    if (isAuctionActive(auction) && auction.createdAuctionId) {
      // If auction is active and has been created, navigate to participation page
      const targetUrl = `/Home/auction-participation/${auction.createdAuctionId}`;
      console.log("🔍 Navigating to:", targetUrl);
      navigate(targetUrl);
    } else {
      // If auction is not active, show details (could be a modal or details page)
      console.log("Viewing auction details:", auction);
      // For now, just log - you can implement a details modal later
      alert(`Auction details:\nProduct: ${auction.productName || 'Unknown'}\nStatus: ${auction.status}\nStart Price: ${auction.startPrice} ETH`);
    }
  };

  // Dashboard Overview
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {" "}
        <motion.div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Scheduled
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalScheduled}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>{" "}
        <motion.div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.pendingAuctions}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>{" "}
        <motion.div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.successRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>{" "}
      {/* Recent Activity */}
      <motion.div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        variants={itemVariants}
        animate={controls}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Recent Scheduled Auctions
        </h3>

        {isLoadingScheduledAuctions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading auctions...
            </p>
          </div>
        ) : scheduledAuctions.length > 0 ? (
          <div className="space-y-4">
            {scheduledAuctions.slice(0, 5).map((auction) => (
              <div
                key={auction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <SmartImage
                      imageId={
                        auction.productImages?.[0] ||
                        auction.imageUrl ||
                        auction.productId
                      }
                      alt={auction.productName || "Auction Item"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {auction.productName || `Auction #${auction.id}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Starts:{" "}
                      {new Date(auction.scheduledTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {auction.startPrice} ETH
                  </p>
                  <p
                    className={`text-sm px-2 py-1 rounded-full ${
                      auction.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : auction.status === "PROCESSED"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {auction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No scheduled auctions yet
            </p>
            <button
              onClick={() => setActiveTab("create")}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Your First Auction
            </button>
          </div>
        )}
      </motion.div>
    </div>
  ); // Create Form
  const renderCreateForm = () => {
    console.log("🔍 renderCreateForm called");
    console.log("🔍 userProducts:", userProducts);
    console.log("🔍 isLoadingProducts:", isLoadingProducts);
    console.log("🔍 filteredProducts:", filteredProducts);

    return (
      <div className="space-y-6">
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          style={{
            position: "relative",
            zIndex: 10000,
            isolation: "isolate",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Create Scheduled Auction
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Schedule your product for a future auction
              </p>
            </div>

            {/* Success/Error Message */}
            {submitStatus !== "idle" && (
              <motion.div
                className={`p-4 rounded-lg flex items-center ${
                  submitStatus === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitStatus === "success" ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                {submitMessage}
              </motion.div>
            )}

            {/* Product Selection */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Select Product to Auction
              </h3>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your products..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {isLoadingProfile || isLoadingProducts ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading your products...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                    No products available for auction
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Make sure your products have appraisal certificates and are
                    not already in auction
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Products Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex-shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {filteredProducts.length} Products Found
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {
                            filteredProducts.filter(canUseForScheduledAuction)
                              .length
                          }{" "}
                          available for auction
                        </p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Select a product below
                      </p>
                    </div>
                  </div>                    {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 max-h-[500px] overflow-y-auto p-2">
                    {filteredProducts.map((product) => {
                      const canUse = canUseForScheduledAuction(product);
                      const isSelected =
                        formData.selectedProduct?.productId ===
                        product.productId;

                      return (                        <motion.div
                          key={product.productId}
                          className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer min-h-[380px] sm:min-h-[400px] flex flex-col ${
                            isSelected
                              ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg scale-105"
                              : canUse
                              ? "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md bg-white dark:bg-gray-800"
                              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60 cursor-not-allowed"
                          }`}
                          onClick={() => canUse && handleProductSelect(product)}
                          whileHover={canUse ? { y: -2 } : {}}
                          whileTap={canUse ? { scale: 0.98 } : {}}
                          layout
                        >
                          {/* Selected Badge */}
                          {isSelected && (
                            <motion.div
                              className="absolute top-2 right-2 z-10 bg-purple-500 text-white rounded-full p-1.5 shadow-lg"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.div>
                          )}                          {/* Product Image */}
                          <div 
                            className="relative h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 overflow-hidden"
                            style={{ isolation: 'isolate', zIndex: 10 }}
                          >
                            <SmartImage
                              imageId={
                                product.imageIds?.[0] || product.productId
                              }
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                              {/* Status Badge - Top Left - Always on top */}
                            <div 
                              className="absolute top-2 left-2"
                              style={{ zIndex: 1000 }}
                            >
                              <span
                                className={`inline-block px-2.5 py-1.5 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md border-2 ${
                                  product.status === "Available" &&
                                  !product.isAuction
                                    ? "bg-green-50 text-green-900 border-green-400 dark:bg-green-900 dark:text-green-100 dark:border-green-500"
                                    : product.isAuction
                                    ? "bg-orange-50 text-orange-900 border-orange-400 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-500"
                                    : "bg-red-50 text-red-900 border-red-400 dark:bg-red-900 dark:text-red-100 dark:border-red-500"
                                }`}
                                style={{ 
                                  zIndex: 1001,
                                  position: 'relative',
                                  isolation: 'isolate'
                                }}
                              >
                                {product.isAuction
                                  ? "In Auction"
                                  : product.status}
                              </span>
                            </div>                            {/* Certificate Badge - Bottom Right - Always on top */}
                            {hasValidAppraisalCert(product) && (
                              <div 
                                className="absolute bottom-2 right-2"
                                style={{ zIndex: 1000 }}
                              >
                                <div 
                                  className="bg-blue-500 text-white rounded-full p-1.5 shadow-2xl border-2 border-blue-300"
                                  style={{ 
                                    zIndex: 1001,
                                    position: 'relative',
                                    isolation: 'isolate'
                                  }}
                                >
                                  <Shield className="w-3 h-3" />
                                </div>
                              </div>
                            )}
                          </div>                          {/* Product Info - Better Structured Layout */}
                          <div 
                            className="p-3 sm:p-4 flex flex-col flex-1 min-h-0"
                            style={{ position: 'relative', zIndex: 5 }}
                          >
                            {/* Product Name - Fixed height with proper line clamping */}
                            <div className="mb-2 min-h-[2.5rem] flex items-start">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight line-clamp-2">
                                {product.name}
                              </h4>
                            </div>
                            
                            {/* Short Description - Fixed space */}
                            <div className="mb-3 min-h-[2rem] flex-shrink-0">
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                            
                            {/* Quick Info Cards - Fixed height */}
                            <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0 min-h-[3rem]">
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center flex flex-col justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">ID</span>
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                                  {product.productId.slice(0, 6)}...
                                </p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-center flex flex-col justify-center">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Price</span>
                                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 truncate">
                                  {product.price} ETH
                                </p>
                              </div>
                            </div>
                            
                            {/* Category Tag - Fixed space */}
                            <div className="mb-4 flex-shrink-0 min-h-[1.5rem] flex items-center">
                              <span className="inline-block text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full truncate max-w-full">
                                {product.category}
                              </span>
                            </div>

                            {/* Spacer to push status to bottom */}
                            <div className="flex-1"></div>

                            {/* Availability Status - Always at bottom with fixed height */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 min-h-[3.5rem] flex items-center">
                              <div
                                className={`w-full flex items-center justify-center space-x-1 sm:space-x-2 text-xs py-2.5 px-2 sm:px-3 rounded-lg ${
                                  canUse
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-700"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    canUse ? "bg-green-500" : "bg-red-500"
                                  }`}
                                ></div>
                                <span className="truncate text-center font-medium">
                                  {canUse
                                    ? "Ready for auction"
                                    : isProductScheduledForAuction(product)
                                    ? "Already scheduled"
                                    : !hasValidAppraisalCert(product)
                                    ? "No certificate"
                                    : "Not available"}
                                </span>
                              </div>
                            </div>
                          </div>{/* Unavailable Overlay */}
                          {!canUse && (
                            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-xl flex items-center justify-center p-2">
                              <div className="text-center text-white max-w-full">
                                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 opacity-80" />
                                <p className="text-xs sm:text-sm font-semibold mb-1 px-2">
                                  {!isProductAvailableForAuction(product)
                                    ? "Not Available"
                                    : !hasValidAppraisalCert(product)
                                    ? "No Certificate"
                                    : "Already Scheduled"}
                                </p>
                                <p className="text-xs opacity-75 leading-relaxed px-2 line-clamp-2">
                                  {!isProductAvailableForAuction(product)
                                    ? "Product is sold or in auction"
                                    : !hasValidAppraisalCert(product)
                                    ? "Appraisal certificate required"
                                    : "Product already has scheduled auction"}
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {errors.selectedProduct && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.selectedProduct}
                </p>
              )}              {formData.selectedProduct && (
                <motion.div
                  className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center text-sm sm:text-base">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    Selected Product:
                  </h5>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 mx-auto sm:mx-0">
                      <SmartImage
                        imageId={
                          formData.selectedProduct.imageIds?.[0] ||
                          formData.selectedProduct.productId
                        }
                        alt={formData.selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                        {formData.selectedProduct.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {formData.selectedProduct.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono truncate">
                          ID: {formData.selectedProduct.productId.slice(0, 12)}...
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {formData.selectedProduct.price} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Auction Details Form */}
            {formData.selectedProduct && (
              <motion.div
                className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Auction Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Starting Price (ETH)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={formData.startPrice || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "startPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="0.001"
                      />
                    </div>
                    {errors.startPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startPrice}
                      </p>
                    )}
                  </div>

                  {/* Scheduled Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scheduled Start Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={formData.scheduledTime}
                        min={new Date(Date.now() + 60000)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          handleScheduledTimeChange(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    {errors.scheduledTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.scheduledTime}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auction Duration (Hours)
                    </label>
                    <select
                      onChange={(e) =>
                        handleDurationChange(parseInt(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={3}>3 Hours</option>
                      <option value={6}>6 Hours</option>
                      <option value={12}>12 Hours</option>
                      <option value={24} selected>
                        24 Hours
                      </option>
                      <option value={48}>48 Hours</option>
                      <option value={72}>72 Hours</option>
                      <option value={168}>1 Week</option>
                    </select>
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="submit"
                disabled={isSubmitting || !formData.selectedProduct}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Auction
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    );
  };

  // My Auctions
  const renderMyAuctions = () => (
    <div className="space-y-6">
      <motion.div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        variants={itemVariants}
        animate={controls}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          My Scheduled Auctions
        </h3>

        {isLoadingScheduledAuctions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading your auctions...
            </p>
          </div>
        ) : scheduledAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            {scheduledAuctions.map((auction) => (
              <motion.div
                key={auction.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow relative"
                whileHover={{ y: -2 }}
              >
                {/* Active Auction Indicator */}
                {isAuctionActive(auction) && auction.createdAuctionId && (
                  <div className="absolute top-2 right-2 flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</span>
                  </div>
                )}
                
                <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                  <SmartImage
                    imageId={
                      auction.productImages?.[0] ||
                      auction.imageUrl ||
                      auction.productId
                    }
                    alt={auction.productName || "Auction Item"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {auction.productName || `Auction #${auction.id}`}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Start Price:
                    </span>
                    <span className="font-medium">
                      {auction.startPrice} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Scheduled:
                    </span>
                    <span className="font-medium">
                      {new Date(auction.scheduledTime).toLocaleDateString()}
                    </span>
                  </div>                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        auction.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : auction.status === "PROCESSED"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {auction.status}
                    </span>
                  </div>
                  {/* Time Remaining for Active Auctions */}
                  {isAuctionActive(auction) && auction.createdAuctionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Time Left:
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {getTimeRemaining(auction)}
                      </span>
                    </div>
                  )}
                </div>                <div className="flex space-x-2 mt-4">
                  <button 
                    onClick={() => handleViewAuction(auction)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                      isAuctionActive(auction) && auction.createdAuctionId
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    {isAuctionActive(auction) && auction.createdAuctionId ? "Join Auction" : "View Details"}
                  </button>
                  {auction.status === "PENDING" && (
                    <button className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                      <Edit3 className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No scheduled auctions yet
            </p>{" "}
            <button
              onClick={() => setActiveTab("create")}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create Your First Auction
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  // Upcoming Auctions
  const renderUpcomingAuctions = () => (
    <div className="space-y-6">
      <motion.div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        variants={itemVariants}
        animate={controls}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Timer className="w-5 h-5 mr-2" />
          Upcoming Scheduled Auctions
        </h3>

        {isLoadingScheduledAuctions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Loading upcoming auctions...
            </p>
          </div>
        ) : allScheduledAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allScheduledAuctions.map((auction) => {
              const timeUntilStart =
                new Date(auction.scheduledTime).getTime() - Date.now();
              const daysUntil = Math.floor(
                timeUntilStart / (1000 * 60 * 60 * 24)
              );
              const hoursUntil = Math.floor(
                (timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );

              return (
                <motion.div
                  key={auction.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -2 }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
                    <SmartImage
                      imageId={
                        auction.productImages?.[0] ||
                        auction.imageUrl ||
                        auction.productId
                      }
                      alt={auction.productName || "Auction Item"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {auction.productName || `Auction #${auction.id}`}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Start Price:
                      </span>
                      <span className="font-medium">
                        {auction.startPrice} ETH
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Starts in:
                      </span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {daysUntil > 0
                          ? `${daysUntil}d ${hoursUntil}h`
                          : `${hoursUntil}h`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Owner:
                      </span>
                      <span className="font-medium">
                        {auction.owner.slice(0, 6)}...{auction.owner.slice(-4)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
                      <Heart className="w-4 h-4 inline mr-1" />
                      Watch
                    </button>
                    <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      <Eye className="w-4 h-4 inline mr-1" />
                      Preview
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Timer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming auctions at the moment
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
  // History
  const renderHistory = () => (
    <div className="space-y-6">
      <motion.div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        variants={itemVariants}
        animate={controls}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Auction History
        </h3>

        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Auction history will be displayed here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            This feature will show completed and cancelled auctions
          </p>
        </div>
      </motion.div>
    </div>
  );

  // Call debug when data changes
  useEffect(() => {
    if (scheduledAuctions.length > 0) {
      console.log("🔍 Current scheduledAuctions:", scheduledAuctions);
      console.log("🔍 Duplicate check:", scheduledAuctions.map(a => ({ id: a.id, endTime: a.endTime })));
    }
  }, [scheduledAuctions]);

  // Render different content based on active tab
  const renderTabContent = () => {
    console.log("🔍 renderTabContent called with activeTab:", activeTab);

    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "create":
        console.log("🔍 Rendering create form...");
        return renderCreateForm();
      case "my-auctions":
        return renderMyAuctions();
      case "upcoming":
        return renderUpcomingAuctions();
      case "history":
        return renderHistory();
      default:
        return renderDashboard();
    }
  };
  return (
    <>
      {" "}
      {/* CSS để giải quyết vấn đề background che phủ form/tab */}
      <style>{`
        .scheduled-auctions-page {
          position: relative;
          isolation: isolate;
        }
        .scheduled-auctions-page .bg-decoration {
          position: absolute;
          z-index: -10 !important;
          opacity: 0.008 !important;
          pointer-events: none !important;
        }
        .scheduled-auctions-page .main-container {
          position: relative;
          z-index: 10 !important;
        }
        .scheduled-auctions-page .form-content {
          position: relative !important;
          z-index: 9999 !important;
          isolation: isolate !important;
        }
        .scheduled-auctions-page .form-content > * {
          position: relative !important;
          z-index: 10000 !important;
        }
        .scheduled-auctions-page .content-card {
          position: relative;
          z-index: 50 !important;
        }
        .scheduled-auctions-page .nav-tabs {
          position: relative;
          z-index: 60 !important;
        }
        .scheduled-auctions-page .header-section {
          position: relative;
          z-index: 40 !important;
        }        /* Đảm bảo form luôn hiển thị */
        .form-content .bg-white\\/98 {
          background-color: rgba(255, 255, 255, 0.98) !important;
        }
        .form-content .dark\\:bg-gray-900\\/98 {
          background-color: rgba(17, 24, 39, 0.98) !important;        }
        /* Đảm bảo form hiển thị ổn định */
        .form-content {
          background: white !important;
        }
        .dark .form-content {
          background: #1f2937 !important;
        }
        /* Đảm bảo tất cả nội dung trong form hiển thị */
        .form-content * {
          position: relative !important;
          z-index: inherit !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
      {/* CSS để giải quyết vấn đề z-index và background overlay */}
      <style>{`
        .scheduled-auctions-page {
          position: relative;
          isolation: isolate;
        }
        .scheduled-auctions-page .bg-decoration {
          position: absolute;
          z-index: -10;
          opacity: 0.005;
          pointer-events: none;
        }
        .scheduled-auctions-page .main-container {
          position: relative;
          z-index: 10;
        }
        .scheduled-auctions-page .form-content {
          position: relative;
          z-index: 100;
          isolation: isolate;
        }
        .scheduled-auctions-page .content-card {
          backdrop-filter: blur(8px);
        }
        .scheduled-auctions-page .form-content {
          backdrop-filter: blur(16px);
        }
      `}</style>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />{" "}
      <div
        ref={sectionRef}
        className="scheduled-auctions-page min-h-screen transition-all duration-500 relative overflow-hidden gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
      >
        {/* Background decoration - properly controlled */}
        <div className="bg-decoration absolute inset-0" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-red-400 dark:to-pink-500"></div>
        </div>

        <div className="main-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {" "}
          {/* Header */}
          <motion.div
            className="header-section mb-8"
            variants={itemVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Scheduled Auctions
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your auction schedule and explore upcoming auctions
                  </p>
                </div>
              </div>

              {/* Quick action button */}
              <motion.button
                onClick={() => setActiveTab("create")}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Auction
              </motion.button>
            </div>
          </motion.div>{" "}
          {/* Navigation Tabs */}
          <motion.div
            className="nav-tabs mb-8"
            variants={itemVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as
                            | "dashboard"
                            | "create"
                            | "my-auctions"
                            | "upcoming"
                            | "history"
                        )
                      }
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>{" "}
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={activeTab === "create" ? "form-content" : "content-card"}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ScheduledAuctions;
