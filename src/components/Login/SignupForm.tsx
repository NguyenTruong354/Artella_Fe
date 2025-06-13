import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/auth";
import { formatErrorMessage, isValidEmail } from "../../api/utils";
import type { UserRegistrationRequest } from "../../api/types";

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  // Only show indicator if password has content
  if (!password) {
    return null;
  }

  const hasMin = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  const requirements = [
    { text: "At least 8 characters", met: hasMin },
    { text: "One uppercase letter", met: hasUpper },
    { text: "One lowercase letter", met: hasLower },
    { text: "One number", met: hasNumber },
    { text: "One special character", met: hasSpecial },
  ];
  
  const strength = [hasMin, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500", 
    "bg-orange-500", 
    "bg-yellow-500", 
    "bg-green-400", 
    "bg-green-600"
  ];
  
  return (
    <div className="mt-2 text-xs animate-fadeIn">
      {/* Strength bar */}
      <div className="flex mb-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            className={`h-1 flex-1 mx-0.5 rounded-full ${
              index < strength ? strengthColor[strength - 1] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      
      {/* Strength text */}
      <div className="mb-1.5 font-medium" style={{ 
        color: strength === 0 ? "#f87171" : strength < 3 ? "#f59e0b" : "#10b981" 
      }}>
        {strengthText[strength - 1] || "Very Weak"}
      </div>
      
      {/* Requirements list */}
      <div className="space-y-1 mt-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center">
            <span className={`mr-2 text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
              {req.met ? '✓' : '○'}
            </span>
            <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SignupForm = () => {  const controls = useAnimation();
  const formRef = useRef(null);
  const navigate = useNavigate();
  // Không cần dùng location vì đã chuyển thẳng đến trang verification
  const { state: authState, register, clearError } = useAuth();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: 'Buyer' as 'Buyer' | 'Seller' | 'Admin', // Updated with correct backend roles
    agreeToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Realtime validation state  
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [phoneNumberTouched, setPhoneNumberTouched] = useState(false);
  
  // Handler for full name validation
  const handleFullNameBlur = () => {
    setFullNameTouched(true);
    
    if (!formData.fullName.trim()) {
      setFormErrors((prev: Record<string, string>) => ({ 
        ...prev, 
        fullName: 'Full name is required' 
      }));
    } else if (formData.fullName.trim().length < 2) {
      setFormErrors((prev: Record<string, string>) => ({ 
        ...prev, 
        fullName: 'Full name must be at least 2 characters' 
      }));
    } else if (formData.fullName.trim().length > 50) {
      setFormErrors((prev: Record<string, string>) => ({ 
        ...prev, 
        fullName: 'Full name must not exceed 50 characters' 
      }));
    } else if (!/^[a-zA-ZÀ-ỹ\s.''-]+$/.test(formData.fullName.trim())) {
      setFormErrors((prev: Record<string, string>) => ({ 
        ...prev, 
        fullName: 'Full name can only contain letters, spaces, and common punctuation' 
      }));
    } else {
      setFormErrors((prev: Record<string, string>) => ({ ...prev, fullName: '' }));
    }
  };

  // Animation variants - similar to LoginForm
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 40,
      opacity: 0,
      scale: 0.95,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay: i * 0.1,
        duration: 0.8,
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-8, 8, -8],
      x: [-4, 4, -4],
      rotate: [-2, 2, -2],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const brushStrokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  };
  // Password validation helpers
  const hasMinLength = (password: string): boolean => password.length >= 8;
  const hasUpperCase = (password: string): boolean => /[A-Z]/.test(password);
  const hasLowerCase = (password: string): boolean => /[a-z]/.test(password);
  const hasNumber = (password: string): boolean => /\d/.test(password);
  const hasSpecialChar = (password: string): boolean => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  // Phone number validation helper
  const isValidPhoneNumber = (phone: string): boolean => {
    // Allow empty or validate if provided
    if (!phone) return true;
    
    // International phone number format: Allow +, spaces, dashes, parentheses, and numbers
    // Generally should have 7-15 digits total (not counting separators)
    // Remove all non-digit characters to count actual digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return false;
    
    // Basic phone validation format
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{2,4}[-\s.]?[0-9]{2,4}$/.test(phone);
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.trim().length > 50) {
      errors.fullName = "Full name must not exceed 50 characters";
    } else if (!/^[a-zA-ZÀ-ỹ\s.''-]+$/.test(formData.fullName.trim())) {
      errors.fullName = "Full name can only contain letters, spaces, and common punctuation";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      const passwordErrors: string[] = [];
      
      if (!hasMinLength(formData.password)) {
        passwordErrors.push("at least 8 characters");
      }
      if (!hasUpperCase(formData.password)) {
        passwordErrors.push("one uppercase letter");
      }
      if (!hasLowerCase(formData.password)) {
        passwordErrors.push("one lowercase letter");
      }
      if (!hasNumber(formData.password)) {
        passwordErrors.push("one number");
      }
      if (!hasSpecialChar(formData.password)) {
        passwordErrors.push("one special character");
      }
      
      if (passwordErrors.length > 0) {
        errors.password = `Password must contain ${passwordErrors.join(", ")}`;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Phone number validation
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    // Terms and conditions
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    clearError();

    try {
      // Prepare data for API (matching Spring Boot UserRegistrationRequest)
      const registrationData: UserRegistrationRequest = {
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role, // Now correctly matches backend: 'Buyer' | 'Seller' | 'Admin'
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
      };

      console.log('🔍 Registration data:', registrationData);
      
      const response = await register(registrationData);
      
      console.log('✅ Registration response:', response);
      
      // If we reach here, registration was successful (no error thrown)
      setRegistrationSuccess(true);
      
      // Redirect to verification page after 2 seconds
      setTimeout(() => {
        navigate('/verification', { 
          state: { 
            message: 'Registration successful! Please verify your account.',
            email: formData.email 
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      // Error is handled by AuthContext and will be displayed in UI
    } finally {
      setIsLoading(false);
    }
  };// Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched based on which field is being edited    // Mark field as touched based on which field is being edited
    switch(field) {
      case 'email':
        if (!emailTouched) setEmailTouched(true);
        break;
      case 'password':
        if (!passwordTouched) setPasswordTouched(true);
        break;
      case 'confirmPassword':
        if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
        break;
      case 'fullName':
        if (!fullNameTouched) setFullNameTouched(true);
        break;
      case 'phoneNumber':
        if (!phoneNumberTouched) setPhoneNumberTouched(true);
        break;
    }
    
    // Perform realtime validation for password and confirm password
    if (field === 'password' || field === 'confirmPassword') {
      const newPassword = field === 'password' ? value as string : formData.password;
      const newConfirmPassword = field === 'confirmPassword' ? value as string : formData.confirmPassword;
      
      // Only validate match if both fields have values
      if (newPassword && newConfirmPassword && newPassword !== newConfirmPassword) {
        setFormErrors(prev => ({ 
          ...prev, 
          confirmPassword: 'Passwords do not match'
        }));
      } else {
        // Clear the error if they match now
        setFormErrors(prev => ({ 
          ...prev, 
          confirmPassword: ''
        }));
      }
    }
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };  // Realtime validation handlers
  const handlePasswordBlur = () => {
    setPasswordTouched(true);
      // Validate password on blur if there's any input
    if (formData.password) {
      const passwordErrors: string[] = [];
      
      if (!hasMinLength(formData.password)) {
        passwordErrors.push("at least 8 characters");
      }
      if (!hasUpperCase(formData.password)) {
        passwordErrors.push("one uppercase letter");
      }
      if (!hasLowerCase(formData.password)) {
        passwordErrors.push("one lowercase letter");
      }
      if (!hasNumber(formData.password)) {
        passwordErrors.push("one number");
      }
      if (!hasSpecialChar(formData.password)) {
        passwordErrors.push("one special character");
      }
      
      if (passwordErrors.length > 0) {
        setFormErrors(prev => ({ 
          ...prev, 
          password: `Password must contain ${passwordErrors.join(", ")}`
        }));
      } else {
        setFormErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };
  
  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    
    // Validate confirm password on blur
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setFormErrors(prev => ({ 
        ...prev, 
        confirmPassword: 'Passwords do not match' 
      }));
    } else {
      setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };
  
  const handleEmailBlur = () => {
    setEmailTouched(true);
    
    // Validate email on blur
    if (!formData.email) {
      setFormErrors(prev => ({ 
        ...prev, 
        email: 'Email is required' 
      }));
    } else if (!isValidEmail(formData.email)) {
      setFormErrors(prev => ({ 
        ...prev, 
        email: 'Please enter a valid email address' 
      }));
    } else {
      setFormErrors(prev => ({ ...prev, email: '' }));
    }
  };
  
  // New handler for phone number validation  
  const handlePhoneNumberBlur = () => {
    setPhoneNumberTouched(true);
    
    // Validate phone number on blur only if provided
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      setFormErrors(prev => ({ 
        ...prev, 
        phoneNumber: 'Please enter a valid phone number' 
      }));
    } else {
      setFormErrors(prev => ({ ...prev, phoneNumber: '' }));
    }  };
  // Handler for full name validation - already defined above

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0] relative overflow-hidden flex items-center justify-center py-12 px-6">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Floating artistic elements */}
      <motion.div
        className="absolute -left-20 top-32 w-80 h-80 rounded-full bg-gradient-to-r from-[#e8d0b3] to-[#f2e4c7] opacity-15 blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute right-16 bottom-32 w-96 h-96 rounded-full bg-gradient-to-l from-[#d4e1f7] to-[#e8f2ff] opacity-18 blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        className="absolute left-1/4 top-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#f7e8d4] to-[#fff5e6] opacity-12 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "3s" }}
      />

      {/* Decorative brush strokes */}
      <svg
        className="absolute top-20 right-24 w-40 h-40 opacity-15"
        viewBox="0 0 100 100"
      >
        <motion.path
          d="M15,75 Q35,15 85,25 Q95,35 75,85"
          stroke="#c2a792"
          strokeWidth="2.5"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>

      <svg
        className="absolute bottom-32 left-16 w-32 h-32 opacity-12"
        viewBox="0 0 100 100"
      >
        <motion.path
          d="M25,25 Q55,75 85,35 Q95,45 65,85"
          stroke="#8e5a5a"
          strokeWidth="2"
          fill="none"
          variants={brushStrokeVariants}
          initial="hidden"
          animate={controls}
        />
      </svg>

      {/* Main signup container */}
      <motion.div
        ref={formRef}
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Signup card */}
        <motion.div
          className="bg-white/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border-2 border-[#e2d6c3] 
                    shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
          variants={itemVariants}
          custom={0}
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)`,
            backdropFilter: "blur(20px)",
            border: `2px solid rgba(226, 214, 195, 0.8)`,
          }}
        >
          {/* Canvas texture background */}
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-3"></div>

          {/* Header */}
          <motion.div
            className="text-center mb-8 relative z-10"
            variants={itemVariants}
            custom={1}
          >
            <motion.div
              className="mb-6"
              variants={titleVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <img
                src="https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527095/Logo_uwp9ly.png"
                alt="Smart Market"
                className="h-16 w-auto mx-auto mb-4"
              />
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-serif text-[#46594f] mb-2 tracking-wide"
              variants={titleVariants}
              style={{
                textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Join Smart Market
            </motion.h1>

            <motion.p
              className="text-[#6d7f75] font-light"
              variants={itemVariants}
              custom={2}
            >
              Create your digital art collection account
            </motion.p>

            {/* Artistic underline */}
            <motion.div
              className="w-16 h-0.5 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full mx-auto mt-4"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.5, delay: 1 } },
              }}
            />

            {/* Success message */}
            {registrationSuccess && (
              <motion.div
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mt-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="font-medium">Registration successful! 🎉</div>
                <div className="text-green-500 text-xs mt-1">Redirecting to login...</div>
              </motion.div>
            )}

            {/* Error message from context */}
            {authState.error && (
              <motion.div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mt-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {formatErrorMessage(authState.error)}
              </motion.div>
            )}
          </motion.div>          {/* Registration form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-3 relative z-10"
            variants={itemVariants}
            custom={3}
          >
            {/* Full Name */}
            <motion.div variants={itemVariants} custom={4}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Full Name *
              </label>              <motion.input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={handleFullNameBlur}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                           focus:outline-none focus:bg-white/80 transition-all duration-300 
                           text-[#46594f] placeholder-[#8a9690] ${
                             formErrors.fullName 
                               ? 'border-red-300 focus:border-red-400' 
                               : 'border-[#e2d6c3] focus:border-[#c2a792]'
                           }`}
                disabled={isLoading}
                required
              />              {fullNameTouched && formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} custom={5}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Email Address *
              </label>
              <motion.input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                           focus:outline-none focus:bg-white/80 transition-all duration-300 
                           text-[#46594f] placeholder-[#8a9690] ${
                             formErrors.email 
                               ? 'border-red-300 focus:border-red-400' 
                               : 'border-[#e2d6c3] focus:border-[#c2a792]'
                           }`}
                disabled={isLoading}
                required
              />              {emailTouched && formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={itemVariants} custom={6}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Phone Number
              </label>              <motion.input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={handlePhoneNumberBlur}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                         focus:outline-none focus:bg-white/80 transition-all duration-300 
                         text-[#46594f] placeholder-[#8a9690] ${
                           formErrors.phoneNumber 
                             ? 'border-red-300 focus:border-red-400' 
                             : 'border-[#e2d6c3] focus:border-[#c2a792]'
                         }`}                disabled={isLoading}
              />              {phoneNumberTouched && formErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
              )}
            </motion.div>

            {/* Wallet Address */}

            {/* Account Type */}
            <motion.div variants={itemVariants} custom={8}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Account Type
              </label>              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as 'Buyer' | 'Seller' | 'Admin')} // Updated with correct backend roles
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                         focus:outline-none focus:bg-white/80 transition-all duration-300 
                         text-[#46594f] border-[#e2d6c3] focus:border-[#c2a792]"
                disabled={isLoading}              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
                <option value="Admin">Admin</option>
              </select>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} custom={9}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Password *
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                             focus:outline-none focus:bg-white/80 transition-all duration-300 
                             text-[#46594f] placeholder-[#8a9690] pr-12 ${
                               formErrors.password 
                                 ? 'border-red-300 focus:border-red-400' 
                                 : 'border-[#e2d6c3] focus:border-[#c2a792]'
                             }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a9690] hover:text-[#46594f] transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>              {passwordTouched && formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}

              {/* Password strength indicator - new component usage */}
              <PasswordStrengthIndicator password={formData.password} />
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} custom={10}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Confirm Password *
              </label>
              <div className="relative">
                <motion.input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                             focus:outline-none focus:bg-white/80 transition-all duration-300 
                             text-[#46594f] placeholder-[#8a9690] pr-12 ${
                               formErrors.confirmPassword 
                                 ? 'border-red-300 focus:border-red-400' 
                                 : 'border-[#e2d6c3] focus:border-[#c2a792]'
                             }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8a9690] hover:text-[#46594f] transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>              {confirmPasswordTouched && formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Terms checkbox */}
            <motion.div variants={itemVariants} custom={11}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#c2a792] focus:ring-[#c2a792] border-[#e2d6c3] rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#6d7f75]">
                  I agree to the{' '}
                  <a href="#" className="text-[#c2a792] hover:text-[#b39682] underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#c2a792] hover:text-[#b39682] underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {formErrors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1">{formErrors.agreeToTerms}</p>
              )}
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading || registrationSuccess}
              variants={itemVariants}
              custom={12}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full bg-gradient-to-r from-[#c2a792] to-[#d8bca6] text-white py-3 px-6 rounded-2xl 
                       font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-[#c2a792] focus:ring-offset-2"
              style={{
                background: isLoading || registrationSuccess 
                  ? 'linear-gradient(to right, #c2a792, #d8bca6)' 
                  : 'linear-gradient(to right, #c2a792, #d8bca6)',
                boxShadow: '0 8px 30px rgba(194, 167, 146, 0.3)',
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : registrationSuccess ? (
                'Account Created! 🎉'
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.form>

          {/* Login link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupForm;