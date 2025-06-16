import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Calendar, Clock, DollarSign, ArrowLeft, CheckCircle, AlertCircle, Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import { WaveTransition } from '../components/WaveTransition';
import { auctionScheduleService, authService } from '../api/services';
import { productService, Product } from '../api/services/productService';
import { ScheduledAuctionDetailDTO } from '../types/auction';
import SmartImage from '../components/SmartImage';

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

const CreateScheduledAuction: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });  const darkMode = useDarkMode();  // User profile state  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Product state
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Scheduled auctions state
  const [scheduledAuctions, setScheduledAuctions] = useState<ScheduledAuctionDetailDTO[]>([]);
  const [isLoadingScheduledAuctions, setIsLoadingScheduledAuctions] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedProduct: null,
    startPrice: 0,
    endTime: 0,
    scheduledTime: '',
    appraisalCert: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);  // Fetch user's products when component mounts
  useEffect(() => {
    const fetchUserProducts = async () => {
      console.log('🔍 Starting fetchUserProducts...');
      
      // First, fetch user profile to get wallet address
      setIsLoadingProfile(true);
      try {
        console.log('🔍 Fetching user profile...');
        const profileResponse = await authService.getUserProfile();
        console.log('� Profile API response:', profileResponse);        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          console.log('✅ User profile loaded:', profile);
          console.log('🔍 Wallet address from profile:', profile.walletAddress);
          
          if (!profile.walletAddress) {
            console.log('❌ No wallet address in profile');
            setSubmitStatus('error');
            setSubmitMessage('Please connect your wallet to create scheduled auctions');
            return;
          }
          
          // Now fetch products with the wallet address
          setIsLoadingProducts(true);
          try {
            console.log('🔍 Fetching products for wallet:', profile.walletAddress);
            const response = await productService.getProductsBySeller(
              profile.walletAddress,
              { page: 0, size: 100, sortBy: 'createdAt', sortDir: 'desc' }
            );
            
            console.log('📦 Products API response:', response);            if (response.success && response.data) {
              console.log('✅ Products found:', response.data.content.length);
              console.log('📋 Products data:', response.data.content);
              setUserProducts(response.data.content);
              
              // Also fetch user's scheduled auctions to check conflicts
              await fetchUserScheduledAuctions();
            } else {
              console.warn('⚠️ API response not successful:', response);
              setUserProducts([]);
            }
          } catch (error) {
            console.error('Error fetching user products:', error);
            setSubmitStatus('error');
            setSubmitMessage('Failed to load your products. Please try again.');
          } finally {
            setIsLoadingProducts(false);
          }
        } else {
          console.log('❌ Failed to fetch user profile:', profileResponse.message);
          setSubmitStatus('error');
          setSubmitMessage('Please connect your wallet to create scheduled auctions');
        }
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        setSubmitStatus('error');
        setSubmitMessage('Failed to connect to your wallet. Please try again.');      } finally {        setIsLoadingProfile(false);
      }
    };

    // Fetch user's scheduled auctions
    const fetchUserScheduledAuctions = async () => {
      setIsLoadingScheduledAuctions(true);
      try {
        console.log('📅 Fetching user scheduled auctions...');
        const scheduledResponse = await auctionScheduleService.getMyScheduledAuctions();
        console.log('📅 Scheduled auctions response:', scheduledResponse);
        
        if (Array.isArray(scheduledResponse)) {
          setScheduledAuctions(scheduledResponse);
          console.log('✅ Scheduled auctions loaded:', scheduledResponse.length);
        } else {
          console.warn('⚠️ Unexpected scheduled auctions response:', scheduledResponse);
          setScheduledAuctions([]);
        }
      } catch (error) {
        console.error('Error fetching scheduled auctions:', error);
        setScheduledAuctions([]);
      } finally {
        setIsLoadingScheduledAuctions(false);
      }
    };

    fetchUserProducts();
  }, []);
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};    // Check if product is selected
    if (!formData.selectedProduct) {
      newErrors.selectedProduct = 'Please select a product from your collection';
      setErrors(newErrors);
      return false;
    }

    // Check if selected product is available for auction
    if (!isProductAvailableForAuction(formData.selectedProduct)) {
      if (formData.selectedProduct.status === 'Sold') {
        newErrors.selectedProduct = 'Selected product has been sold and cannot be auctioned';
      } else if (formData.selectedProduct.isAuction) {
        newErrors.selectedProduct = 'Selected product is already in auction';
      } else {
        newErrors.selectedProduct = `Selected product is not available (Status: ${formData.selectedProduct.status})`;
      }
      setErrors(newErrors);
      return false;
    }    // Check if selected product has appraisal certificate
    if (!formData.selectedProduct.appraisalCert || formData.selectedProduct.appraisalCert.trim() === '') {
      newErrors.selectedProduct = 'Selected product must have an appraisal certificate to create an auction';
      setErrors(newErrors);
      return false;
    }

    // Check if selected product is already scheduled for auction
    if (isProductScheduledForAuction(formData.selectedProduct)) {
      const existingSchedule = scheduledAuctions.find(sa => 
        sa.productId === formData.selectedProduct!.productId && 
        (sa.status === 'PENDING' || sa.status === 'PROCESSED')
      );
      newErrors.selectedProduct = `Selected product is already scheduled for auction (Schedule ID: ${existingSchedule?.id}, Status: ${existingSchedule?.status})`;
      setErrors(newErrors);
      return false;
    }

    if (formData.startPrice <= 0) {
      newErrors.startPrice = 'Start price must be greater than 0';
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required';
    } else {
      const scheduledDate = new Date(formData.scheduledTime);
      const now = new Date();
      if (scheduledDate <= now) {
        newErrors.scheduledTime = 'Scheduled time must be in the future';
      }
    }

    if (formData.endTime <= 0) {
      newErrors.endTime = 'Auction duration must be greater than 0';
    }

    // appraisalCert và imageUrl là optional vì backend sẽ tự động lấy từ product
    // Chỉ validate format nếu user có nhập
    if (formData.imageUrl.trim() && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Helper function to validate URL format
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      selectedProduct: product,
      // Auto-fill with product's data
      appraisalCert: product.appraisalCert || '',
      imageUrl: product.imageIds?.[0] || ''
    }));

    // Clear product selection error
    if (errors.selectedProduct) {
      setErrors(prev => ({
        ...prev,
        selectedProduct: undefined
      }));
    }
  };

  // Filter products based on search term
  const filteredProducts = userProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(productSearchTerm.toLowerCase())
  );  // Check if product has valid appraisal certificate
  const hasValidAppraisalCert = (product: Product): boolean => {
    return !!(product.appraisalCert && product.appraisalCert.trim() !== '');
  };

  // Check if product is already scheduled for auction
  const isProductScheduledForAuction = (product: Product): boolean => {
    return scheduledAuctions.some(scheduledAuction => 
      scheduledAuction.productId === product.productId && 
      (scheduledAuction.status === 'PENDING' || scheduledAuction.status === 'PROCESSED')
    );
  };

  // Check if product is available for auction
  const isProductAvailableForAuction = (product: Product): boolean => {
    // Check if product status is Available (not Sold, not in auction, etc.)
    const isAvailable = product.status === 'Available';
    
    // Check if product is not already in auction
    const notInAuction = !product.isAuction;
    
    return isAvailable && notInAuction;
  };
  // Check if product can be used for scheduled auction (available, has cert, not already scheduled)
  const canUseForScheduledAuction = (product: Product): boolean => {
    return isProductAvailableForAuction(product) && 
           hasValidAppraisalCert(product) && 
           !isProductScheduledForAuction(product);
  };

  // Calculate end time based on scheduled time and duration
  const calculateEndTime = (scheduledTime: string, durationHours: number): number => {
    if (!scheduledTime || durationHours <= 0) return 0;
    
    const startTime = new Date(scheduledTime).getTime();
    return startTime + (durationHours * 60 * 60 * 1000);
  };

  // Handle duration change
  const handleDurationChange = (durationHours: number) => {
    const endTime = calculateEndTime(formData.scheduledTime, durationHours);
    setFormData(prev => ({
      ...prev,
      endTime
    }));
  };

  // Handle scheduled time change
  const handleScheduledTimeChange = (scheduledTime: string) => {
    setFormData(prev => {
      const durationHours = prev.endTime > 0 ? (prev.endTime - new Date(prev.scheduledTime).getTime()) / (60 * 60 * 1000) : 24;
      const newEndTime = calculateEndTime(scheduledTime, durationHours);
      
      return {
        ...prev,
        scheduledTime,
        endTime: newEndTime
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
    setSubmitStatus('idle');

    try {      const response = await auctionScheduleService.scheduleAuction({
        productId: formData.selectedProduct!.productId,
        startPrice: formData.startPrice,
        endTime: formData.endTime,
        scheduledTime: formData.scheduledTime,
        // Optional: Backend sẽ tự động lấy từ product nếu không cung cấp
        ...(formData.appraisalCert.trim() && { appraisalCert: formData.appraisalCert }),
        ...(formData.imageUrl.trim() && { imageUrl: formData.imageUrl })
      });

      console.log('✅ Scheduled auction created:', response);
      setSubmitStatus('success');
      setSubmitMessage('Auction scheduled successfully!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        navigate('/auctions');
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating scheduled auction:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to schedule auction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <WaveTransition
        isTransitioning={darkMode.isTransitioning}
        isDark={darkMode.isDark}
      />
      <div
        ref={sectionRef}
        className="min-h-screen transition-all duration-500 relative overflow-hidden gradient-transition bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:bg-gradient-to-br dark:from-[#0A0A0A] dark:via-[#0D0D0D] dark:to-[#111111] dark:text-gray-100"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-3" aria-hidden="true">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-purple-400 to-pink-500 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 rounded-full blur-3xl transition-all duration-500 bg-gradient-to-r from-blue-400 to-cyan-500 dark:bg-gradient-to-r dark:from-red-400 dark:to-pink-500"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Header */}
          <motion.div
            className="mb-8"
            variants={itemVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="flex items-center space-x-4 mb-6">
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
                  Schedule New Auction
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Create a scheduled auction for your NFT
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <form onSubmit={handleSubmit} className="space-y-6">              {/* Product Selection */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Select Product to Auction
                </h2>
                
                {/* Search bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your products..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>                {/* Products Grid */}
                {isLoadingProfile || isLoadingProducts || isLoadingScheduledAuctions ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {isLoadingProfile 
                        ? "Loading your profile..." 
                        : isLoadingProducts 
                          ? "Loading your products..." 
                          : "Loading scheduled auctions..."}
                    </span>
                  </div>) : filteredProducts.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 dark:text-gray-400">
                      {userProducts.length === 0 ? (
                        <p>You don't have any products yet. Create a product first to schedule an auction.</p>
                      ) : productSearchTerm ? (
                        <p>No products match your search "{productSearchTerm}".</p>
                      ) : (
                        <div>
                          <p className="mb-3">No products available for auction.</p>
                          {(() => {
                            const availableProducts = userProducts.filter(canUseForScheduledAuction);
                            const unavailableProducts = userProducts.filter(p => !canUseForScheduledAuction(p));
                            return (
                              <div className="text-sm space-y-2">
                                <p>📊 <strong>Product Summary:</strong></p>
                                <p>✅ Available for auction: {availableProducts.length}</p>
                                <p>❌ Not available: {unavailableProducts.length}</p>
                                {unavailableProducts.length > 0 && (
                                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                                    <p className="text-yellow-800 dark:text-yellow-400 font-medium text-xs">
                                      Some products cannot be used because they are:
                                    </p>                                    <ul className="text-yellow-700 dark:text-yellow-400 text-xs mt-1 list-disc list-inside">
                                      {unavailableProducts.some(p => p.status === 'Sold') && <li>Already sold</li>}
                                      {unavailableProducts.some(p => p.isAuction) && <li>Currently in auction</li>}
                                      {unavailableProducts.some(p => !p.appraisalCert) && <li>Missing appraisal certificate</li>}
                                      {unavailableProducts.some(p => isProductScheduledForAuction(p)) && <li>Already scheduled for auction</li>}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => {
                      const isAvailable = isProductAvailableForAuction(product);
                      const isValidCert = hasValidAppraisalCert(product);
                      const canUse = canUseForScheduledAuction(product);
                      const isSelected = formData.selectedProduct?.productId === product.productId;
                        return (
                        <motion.div
                          key={product.productId}
                          className={`relative p-4 border rounded-lg transition-all duration-200 ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : canUse
                                ? 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 cursor-pointer hover:shadow-md'
                                : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-75'
                          }`}
                          onClick={() => canUse && handleProductSelect(product)}
                          whileHover={canUse ? { scale: 1.02 } : {}}
                          whileTap={canUse ? { scale: 0.98 } : {}}
                        >
                          {/* Product Image */}
                          <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {product.imageIds?.[0] ? (
                              <SmartImage 
                                imageId={product.imageIds[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate" title={product.name}>
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">ID: {product.productId}</p>
                            {/* Status badges */}
                          <div className="flex flex-wrap gap-1">
                            {/* Product Status Badge */}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              product.status === 'Available' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : product.status === 'Sold'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {product.status}
                            </span>
                              {/* Auction Status Badge */}
                            {product.isAuction && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                In Auction
                              </span>
                            )}
                            
                            {/* Scheduled Auction Badge */}
                            {isProductScheduledForAuction(product) && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                📅 Scheduled
                              </span>
                            )}
                            
                            {/* Certificate Badge */}
                            {isValidCert ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                ✓ Certified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                ✗ No Certificate
                              </span>
                            )}
                            
                            {/* Selected Badge */}
                            {isSelected && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                Selected
                              </span>
                            )}
                          </div>
                            {/* Warning message if not available */}
                          {!canUse && (
                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs">
                              <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                                {!isAvailable 
                                  ? product.status === 'Sold' 
                                    ? '❌ This product has been sold'
                                    : product.isAuction 
                                      ? '⏰ This product is already in auction'
                                      : `❓ Product status: ${product.status}`
                                  : isProductScheduledForAuction(product)
                                    ? (() => {
                                        const schedule = scheduledAuctions.find(sa => 
                                          sa.productId === product.productId && 
                                          (sa.status === 'PENDING' || sa.status === 'PROCESSED')
                                        );
                                        return `📅 Already scheduled for auction (ID: ${schedule?.id}, Status: ${schedule?.status})`;
                                      })()
                                    : !isValidCert 
                                      ? '📋 No appraisal certificate - cannot create auction'
                                      : '❌ Cannot use for auction'
                                }
                              </p>
                            </div>
                          )}
                          
                          {/* Warning overlay for products without cert */}
                          {!isValidCert && (
                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Appraisal Required
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                
                {/* Selection Error */}
                {errors.selectedProduct && (
                  <p className="text-red-500 text-sm mt-2">{errors.selectedProduct}</p>
                )}

                {/* Selected Product Preview */}
                {formData.selectedProduct && (
                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Selected Product:</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {formData.selectedProduct.imageIds?.[0] ? (
                          <SmartImage 
                            imageId={formData.selectedProduct.imageIds[0]} 
                            alt={formData.selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {formData.selectedProduct.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {formData.selectedProduct.productId}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          ✓ Appraisal Certificate: {formData.selectedProduct.appraisalCert}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>              {/* Pricing */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Starting Price (ETH) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.startPrice}
                    onChange={(e) => handleInputChange('startPrice', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.startPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="0.000"
                  />
                  {errors.startPrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.startPrice}</p>
                  )}
                </div>
              </motion.div>

              {/* Timing */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Scheduled Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledTime}
                      onChange={(e) => handleScheduledTimeChange(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.scheduledTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.scheduledTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auction Duration (Hours) *
                    </label>
                    <select
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.endTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      defaultValue="24"
                    >
                      <option value="1">1 Hour</option>
                      <option value="6">6 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                      <option value="72">72 Hours</option>
                      <option value="168">1 Week</option>
                    </select>
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* End time display */}
                {formData.scheduledTime && formData.endTime > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Auction will end on: {new Date(formData.endTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Submit Status */}
              {submitStatus !== 'idle' && (
                <motion.div
                  className={`p-4 rounded-lg flex items-center ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2" />
                  )}
                  {submitMessage}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
      </div>
    </>
  );
};

export default CreateScheduledAuction;
