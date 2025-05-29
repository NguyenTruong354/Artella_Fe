import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const SignupForm = () => {
  // Add CSS keyframes for optimized animations
  useEffect(() => {
    const styleId = 'signup-form-styles';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement("style");
      styleSheet.id = styleId;
      styleSheet.textContent = `
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scaleX(1) translateZ(0);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.2) translateZ(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: scale(1) translateZ(0);
            opacity: 0.12;
          }
          50% {
            transform: scale(1.15) translateZ(0);
            opacity: 0.2;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const controls = useAnimation();
  const formRef = useRef(null);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeNewsletter: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.95,
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        delay: i * 0.08,
        duration: 0.6,
      },
    }),
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return "";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return "#ef4444";
    if (strength <= 50) return "#f59e0b";
    if (strength <= 75) return "#3b82f6";
    return "#10b981";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions!");
      return;
    }
    
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    console.log("Signup data:", formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0] relative overflow-hidden flex items-center justify-center py-8 px-6">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkxpy5kg2/image/upload/v1748527198/textxure_1-C7NG-XLf_atgy9c.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-gradient-to-r from-[#e8d0b3] to-[#f2e4c7] opacity-15 blur-3xl"
        animate={{
          y: [-8, 8, -8],
          x: [-4, 4, -4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-16 top-32 w-96 h-96 rounded-full bg-gradient-to-l from-[#d4e1f7] to-[#e8f2ff] opacity-18 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main signup container */}
      <motion.div
        ref={formRef}
        className="relative z-10 w-full max-w-lg"
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
                loading="lazy"
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
              Create your account to start collecting digital art
            </motion.p>

            {/* Artistic underline */}
            <motion.div
              className="w-20 h-0.5 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full mx-auto mt-4"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.2, delay: 0.8 } },
              }}
            />
          </motion.div>

          {/* Signup form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 relative z-10"
            variants={itemVariants}
            custom={3}
          >
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} custom={4}>
                <label className="block text-[#46594f] font-medium mb-2 text-sm">
                  First Name
                </label>
                <motion.div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                              rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                              transition-all duration-200 text-[#46594f] placeholder-[#8a9690]"
                    required
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div
                    className="absolute right-3 top-1/2 text-[#c2a792] text-lg flex items-center justify-center w-6 h-6"
                    style={{
                      opacity: formData.firstName ? 1 : 0.5,
                      transition: 'opacity 0.2s ease',
                      transform: 'translateY(-50%) translateZ(0)'
                    }}
                  >
                    👤
                  </div>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} custom={5}>
                <label className="block text-[#46594f] font-medium mb-2 text-sm">
                  Last Name
                </label>
                <motion.div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                              rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                              transition-all duration-200 text-[#46594f] placeholder-[#8a9690]"
                    required
                    style={{ transform: 'translateZ(0)' }}
                  />
                  <div
                    className="absolute right-3 top-1/2 text-[#c2a792] text-lg flex items-center justify-center w-6 h-6"
                    style={{
                      opacity: formData.lastName ? 1 : 0.5,
                      transition: 'opacity 0.2s ease',
                      transform: 'translateY(-50%) translateZ(0)'
                    }}
                  >
                    👥
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Email field */}
            <motion.div variants={itemVariants} custom={6}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Email Address
              </label>
              <motion.div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                            rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                            transition-all duration-200 text-[#46594f] placeholder-[#8a9690]"
                  required
                  style={{ transform: 'translateZ(0)' }}
                />
                <div
                  className="absolute right-3 top-1/2 text-[#c2a792] text-lg flex items-center justify-center w-6 h-6"
                  style={{
                    opacity: formData.email ? 1 : 0.5,
                    transition: 'opacity 0.2s ease',
                    transform: 'translateY(-50%) translateZ(0)'
                  }}
                >
                  📧
                </div>
              </motion.div>
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants} custom={7}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Password
              </label>
              <motion.div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                            rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                            transition-all duration-200 text-[#46594f] placeholder-[#8a9690] pr-12"
                  required
                  style={{ transform: 'translateZ(0)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 text-[#c2a792] text-lg 
                            flex items-center justify-center w-6 h-6 rounded-full 
                            hover:bg-[#c2a792]/10 transition-colors duration-200 
                            focus:outline-none focus:ring-2 focus:ring-[#c2a792]/30"
                  style={{ transform: 'translateY(-50%) translateZ(0)' }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </motion.div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength)
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: getPasswordStrengthColor(passwordStrength) }}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password field */}
            <motion.div variants={itemVariants} custom={8}>
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Confirm Password
              </label>
              <motion.div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                            rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                            transition-all duration-200 text-[#46594f] placeholder-[#8a9690] pr-12"
                  required
                  style={{ transform: 'translateZ(0)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 text-[#c2a792] text-lg 
                            flex items-center justify-center w-6 h-6 rounded-full 
                            hover:bg-[#c2a792]/10 transition-colors duration-200 
                            focus:outline-none focus:ring-2 focus:ring-[#c2a792]/30"
                  style={{ transform: 'translateY(-50%) translateZ(0)' }}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </motion.div>
              
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <motion.div
                  className="mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className={`text-xs ${
                      formData.password === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {formData.password === formData.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Terms and Newsletter checkboxes */}
            <motion.div
              className="space-y-3"
              variants={itemVariants}
              custom={9}
              style={{ transform: 'translateZ(0)' }}
            >
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-lg border-2 border-[#e2d6c3] text-[#c2a792] 
                            focus:ring-[#c2a792] focus:ring-2 focus:ring-offset-0 
                            bg-white/60 backdrop-blur-sm transition-colors duration-200 mt-0.5"
                  required
                  style={{ transform: 'translateZ(0)' }}
                />
                <span className="text-[#6d7f75] text-sm font-light group-hover:text-[#46594f] transition-colors duration-200">
                  I agree to the{" "}
                  <a href="#terms" className="text-[#c2a792] hover:text-[#b8956f] font-medium">
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a href="#privacy" className="text-[#c2a792] hover:text-[#b8956f] font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="agreeNewsletter"
                  checked={formData.agreeNewsletter}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-lg border-2 border-[#e2d6c3] text-[#c2a792] 
                            focus:ring-[#c2a792] focus:ring-2 focus:ring-offset-0 
                            bg-white/60 backdrop-blur-sm transition-colors duration-200 mt-0.5"
                  style={{ transform: 'translateZ(0)' }}
                />
                <span className="text-[#6d7f75] text-sm font-light group-hover:text-[#46594f] transition-colors duration-200">
                  Subscribe to our newsletter for updates and exclusive offers
                </span>
              </label>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                        py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                        uppercase tracking-wider text-sm border border-white/20 overflow-hidden 
                        disabled:opacity-70 disabled:cursor-not-allowed relative group/submit"
              variants={itemVariants}
              custom={10}
              style={{
                transform: 'translateZ(0)',
                willChange: 'transform, box-shadow'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 
                          group-hover/submit:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ transform: 'translateZ(0)' }}
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="text-lg">🎨</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <motion.div
              className="relative my-6"
              variants={itemVariants}
              custom={11}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2d6c3]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-[#8a9690] font-light">
                  Or sign up with
                </span>
              </div>
            </motion.div>

            {/* Social signup buttons */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={itemVariants}
              custom={12}
              style={{ transform: 'translateZ(0)' }}
            >
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm 
                          border-2 border-[#e2d6c3] rounded-2xl hover:bg-white/80 hover:border-[#c2a792] 
                          transition-all duration-200 text-[#46594f] font-medium text-sm group"
                style={{ transform: 'translateZ(0)' }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  🔗
                </span>
                <span>MetaMask</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm 
                          border-2 border-[#e2d6c3] rounded-2xl hover:bg-white/80 hover:border-[#c2a792] 
                          transition-all duration-200 text-[#46594f] font-medium text-sm group"
                style={{ transform: 'translateZ(0)' }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  👤
                </span>
                <span>Google</span>
              </button>
            </motion.div>

            {/* Sign in link */}            <motion.div
              className="text-center pt-4"
              variants={itemVariants}
              custom={13}
              style={{ transform: 'translateZ(0)' }}
            >
              <span className="text-[#8a9690] text-sm font-light">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#c2a792] font-medium hover:text-[#b8956f] transition-colors duration-200"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Sign in here
                </a>
              </span>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-6 text-center"
          variants={itemVariants}
          custom={14}
          style={{ transform: 'translateZ(0)' }}
        >
          <div
            className="inline-block w-32 h-0.5 bg-gradient-to-r from-transparent via-[#c2a792] to-transparent rounded-full"
            style={{
              animation: 'pulse 4s ease-in-out infinite',
              transform: 'translateZ(0)'
            }}
          />
        </motion.div>
      </motion.div>

      {/* Enhanced atmospheric lighting */}
      <div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-gradient-to-bl from-[#f0e6d8] 
                   via-[#f8ede3] to-transparent opacity-12 blur-3xl"
        style={{
          animation: 'float 8s ease-in-out infinite',
          transform: 'translateZ(0)',
          willChange: 'auto'
        }}
      />
    </div>
  );
};

export default SignupForm;
