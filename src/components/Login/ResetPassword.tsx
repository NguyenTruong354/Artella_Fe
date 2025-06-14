import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isValidEmail } from "../../api/utils";
import { authService } from "../../api/services";

const ResetPassword = () => {
  const controls = useAnimation();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email and code from URL parameters (if available)
  const emailFromUrl = searchParams.get("email") || "";
  const codeFromUrl = searchParams.get("code") || "";

  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  const [formData, setFormData] = useState({
    email: emailFromUrl,
    code: codeFromUrl,
    newPassword: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Animation variants
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
      opacity: 0.6,
      transition: {
        pathLength: { duration: 2.5, ease: "easeInOut" },
        opacity: { duration: 1, delay: 0.7 },
      },
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.code) {
      errors.code = "Verification code is required";
    } else if (formData.code.length !== 6) {
      errors.code = "Verification code must be 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = (): boolean => {
    if (currentStep === 1) {
      return validateStep1();
    } else {
      return validateStep2();
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (currentStep === 1) {
      // Step 1: Just move to next step after validation
      console.log("Moving to step 2 - entering new password");
      setCurrentStep(2);
      return;
    }

    // Step 2: Call actual API
    setIsLoading(true);

    try {
      // Step 2: Call actual reset password API
      console.log("Attempting to reset password for email:", formData.email);
      const response = await authService.resetPassword(
        formData.email,
        formData.code,
        formData.newPassword
      );

      if (response.success) {
        console.log("Password reset successful");
        setIsSuccess(true);
      } else {
        console.error("Password reset failed:", response.message);
        setFormErrors({
          code:
            response.message ||
            "Invalid verification code or failed to reset password",
        });
        // Go back to step 1 if API call fails
        setCurrentStep(1);
      }
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      setFormErrors({
        newPassword: errorMessage,
      });
      // Go back to step 1 if API call fails
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
    setFormErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0] relative overflow-hidden flex items-center justify-center py-12 px-6">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-20"></div>
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-white/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border-2 border-[#e2d6c3] 
                      shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden text-center"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)`,
              backdropFilter: "blur(20px)",
              border: `2px solid rgba(226, 214, 195, 0.8)`,
            }}
          >
            {/* Canvas texture background */}
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-3 z-[-10]"></div>

            <div className="relative z-10">
              {/* Success icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="text-4xl"
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  🎉
                </motion.span>
              </motion.div>

              <motion.h1
                className="text-2xl md:text-3xl font-serif text-[#46594f] mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Password Reset Successfully!
              </motion.h1>

              <motion.p
                className="text-[#6d7f75] mb-6 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your password has been reset successfully. <br />
                You can now login with your new password.
              </motion.p>

              <motion.button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                          py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                          uppercase tracking-wider text-sm border border-white/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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

      {/* Main reset password container */}
      <motion.div
        ref={formRef}
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Reset password card */}
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
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-3 z-[-10]"></div>
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
            </motion.div>{" "}
            <motion.h1
              className="text-3xl md:text-4xl font-serif text-[#46594f] mb-2 tracking-wide"
              variants={titleVariants}
              style={{
                textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Reset Password{" "}
            </motion.h1>
            <motion.p
              className="text-[#6d7f75] font-light mb-6"
              variants={itemVariants}
              custom={2}
            >
              {currentStep === 1
                ? "Enter your email and the verification code from your email."
                : "Set your new password."}{" "}
            </motion.p>
            {/* Step indicator */}
            <motion.div
              className="flex items-center justify-center space-x-4 mb-6"
              variants={itemVariants}
              custom={2}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-[#c2a792] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 2 ? "bg-[#c2a792]" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-[#c2a792] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </motion.div>
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
          </motion.div>{" "}
          {/* Reset password form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
            variants={itemVariants}
            custom={3}
          >
            {/* Step 1: Email and Verification Code */}
            {currentStep === 1 && (
              <>
                {/* Email field */}
                <motion.div variants={itemVariants} custom={4}>
                  <label className="block text-[#46594f] font-medium mb-2 text-sm">
                    Email Address
                  </label>
                  <motion.div className="relative">
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                                 focus:outline-none focus:bg-white/80 transition-all duration-300 
                                 text-[#46594f] placeholder-[#8a9690] ${
                                   formErrors.email
                                     ? "border-red-300 focus:border-red-400"
                                     : "border-[#e2d6c3] focus:border-[#c2a792]"
                                 }`}
                      whileFocus={{
                        borderColor: formErrors.email ? "#f87171" : "#c2a792",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        transition: { duration: 0.3 },
                      }}
                      required
                    />
                    <motion.div
                      className="absolute right-3 top-1/2 text-[#c2a792] text-lg flex items-center justify-center w-6 h-6"
                      animate={{
                        opacity: formData.email ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transform: "translateY(-50%)" }}
                    >
                      📧
                    </motion.div>
                  </motion.div>
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </motion.div>

                {/* Verification code field */}
                <motion.div variants={itemVariants} custom={5}>
                  <label className="block text-[#46594f] font-medium mb-2 text-sm">
                    Verification Code
                  </label>
                  <motion.div className="relative">
                    <motion.input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className={`w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 rounded-2xl 
                                 focus:outline-none focus:bg-white/80 transition-all duration-300 
                                 text-[#46594f] placeholder-[#8a9690] text-center tracking-widest text-lg ${
                                   formErrors.code
                                     ? "border-red-300 focus:border-red-400"
                                     : "border-[#e2d6c3] focus:border-[#c2a792]"
                                 }`}
                      whileFocus={{
                        borderColor: formErrors.code ? "#f87171" : "#c2a792",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        transition: { duration: 0.3 },
                      }}
                      required
                    />
                    <motion.div
                      className="absolute right-3 top-1/2 text-[#c2a792] text-lg flex items-center justify-center w-6 h-6"
                      animate={{
                        opacity: formData.code ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transform: "translateY(-50%)" }}
                    >
                      🔑
                    </motion.div>
                  </motion.div>
                  {formErrors.code && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.code}
                    </p>
                  )}
                </motion.div>
              </>
            )}{" "}
            {/* Step 2: New Password Fields */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* New Password field */}
                <div className="mb-4">
                  <label className="block text-[#46594f] font-medium mb-2 text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className={`w-full px-4 py-3 bg-white border-2 rounded-2xl 
                                 focus:outline-none focus:bg-white transition-all duration-300 
                                 text-[#46594f] placeholder-[#8a9690] pr-12 ${
                                   formErrors.newPassword
                                     ? "border-red-300 focus:border-red-400"
                                     : "border-[#e2d6c3] focus:border-[#c2a792]"
                                 }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 text-[#c2a792] text-lg 
                                flex items-center justify-center w-6 h-6 rounded-full 
                                hover:bg-[#c2a792]/10 transition-colors duration-200 
                                focus:outline-none focus:ring-2 focus:ring-[#c2a792]/30"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.newPassword}
                    </p>
                  )}
                </div>
                {/* Confirm Password field */}
                <div className="mb-4">
                  <label className="block text-[#46594f] font-medium mb-2 text-sm">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-3 bg-white border-2 rounded-2xl 
                                 focus:outline-none focus:bg-white transition-all duration-300 
                                 text-[#46594f] placeholder-[#8a9690] pr-12 ${
                                   formErrors.confirmPassword
                                     ? "border-red-300 focus:border-red-400"
                                     : "border-[#e2d6c3] focus:border-[#c2a792]"
                                 }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 text-[#c2a792] text-lg 
                                flex items-center justify-center w-6 h-6 rounded-full 
                                hover:bg-[#c2a792]/10 transition-colors duration-200 
                                focus:outline-none focus:ring-2 focus:ring-[#c2a792]/30"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>{" "}
              </div>
            )}
            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                        py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                        uppercase tracking-wider text-sm border border-white/20 overflow-hidden group/submit
                        disabled:opacity-70 disabled:cursor-not-allowed"
              variants={itemVariants}
              custom={8}
              whileHover={
                !isLoading
                  ? {
                      scale: 1.02,
                      boxShadow: "0 15px 35px rgba(194, 167, 146, 0.4)",
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 
                          group-hover/submit:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 1 ? "Continue" : "Reset Password"}
                    </span>
                    <span className="text-lg">
                      {currentStep === 1 ? "➡️" : "🔄"}
                    </span>
                  </>
                )}
              </span>
            </motion.button>
            {/* Navigation buttons */}
            <motion.div
              className="flex justify-between items-center pt-4"
              variants={itemVariants}
              custom={9}
            >
              {/* Back button - only show on step 2 */}
              {currentStep === 2 && (
                <motion.button
                  type="button"
                  onClick={handleBackToStep1}
                  className="text-[#c2a792] font-medium hover:text-[#b8956f] transition-colors duration-200 flex items-center space-x-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>←</span>
                  <span>Back</span>
                </motion.button>
              )}

              {/* Back to login */}
              <motion.button
                type="button"
                onClick={handleBackToLogin}
                className={`text-[#8a9690] text-sm font-light hover:text-[#46594f] transition-colors duration-200 ${
                  currentStep === 1 ? "mx-auto" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep === 1 ? "Remember your password? " : ""}
                <span className="text-[#c2a792] font-medium hover:text-[#b8956f]">
                  Back to Login
                </span>
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
          custom={10}
        >
          <motion.div
            className="inline-block w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c2a792] to-transparent rounded-full"
            animate={{
              scaleX: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Enhanced atmospheric lighting */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-[#f0e6d8] 
                   via-[#f8ede3] to-transparent opacity-12 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ResetPassword;
