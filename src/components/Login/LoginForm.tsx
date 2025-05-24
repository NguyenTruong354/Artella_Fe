import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const LoginForm = () => {
  const controls = useAnimation();
  const formRef = useRef(null);
  
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      scale: 0.95
    },
    visible: (i) => ({
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
        ease: "easeOut"
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
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const brushStrokeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        pathLength: { duration: 2.5, ease: "easeInOut" },
        opacity: { duration: 1, delay: 0.7 }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Login data:', formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8ede3] via-[#f0e6d8] to-[#e8ddd0] relative overflow-hidden flex items-center justify-center py-12 px-6">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-20"></div>
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
        style={{ animationDelay: '3s' }}
      />

      {/* Decorative brush strokes */}
      <svg className="absolute top-20 right-24 w-40 h-40 opacity-15" viewBox="0 0 100 100">
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
      
      <svg className="absolute bottom-32 left-16 w-32 h-32 opacity-12" viewBox="0 0 100 100">
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

      {/* Main login container */}
      <motion.div
        ref={formRef}
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Login card */}
        <motion.div
          className="bg-white/85 backdrop-blur-md rounded-3xl p-8 md:p-10 border-2 border-[#e2d6c3] 
                    shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden"
          variants={itemVariants}
          custom={0}
          whileHover={{
            y: -5,
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          style={{ 
            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)`,
            backdropFilter: 'blur(20px)',
            border: `2px solid rgba(226, 214, 195, 0.8)`
          }}
        >
          {/* Canvas texture background */}
          <div className="absolute inset-0 bg-[url('/src/assets/textxure_1.png')] bg-repeat opacity-3"></div>
          
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
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src="/src/assets/Logo.PNG" 
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
              Welcome Back
            </motion.h1>
            
            <motion.p
              className="text-[#6d7f75] font-light"
              variants={itemVariants}
              custom={2}
            >
              Sign in to your digital art collection
            </motion.p>
            
            {/* Artistic underline */}
            <motion.div
              className="w-16 h-0.5 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] rounded-full mx-auto mt-4"
              initial={{ scaleX: 0 }}
              animate={controls}
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: 1.5, delay: 1 } }
              }}
            />
          </motion.div>

          {/* Login form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
            variants={itemVariants}
            custom={3}
          >
            {/* Email field */}
            <motion.div
              variants={itemVariants}
              custom={4}
            >
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Email Address
              </label>
              <motion.div className="relative">
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                            rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                            transition-all duration-300 text-[#46594f] placeholder-[#8a9690]"
                  whileFocus={{
                    borderColor: "#c2a792",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  required
                />
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c2a792] text-xl"
                  animate={{
                    scale: formData.email ? [1, 1.2, 1] : 1,
                    opacity: formData.email ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  📧
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Password field */}
            <motion.div
              variants={itemVariants}
              custom={5}
            >
              <label className="block text-[#46594f] font-medium mb-2 text-sm">
                Password
              </label>
              <motion.div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-[#e2d6c3] 
                            rounded-2xl focus:outline-none focus:border-[#c2a792] focus:bg-white/80 
                            transition-all duration-300 text-[#46594f] placeholder-[#8a9690] pr-12"
                  whileFocus={{
                    borderColor: "#c2a792",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c2a792] text-xl 
                            hover:scale-110 transition-transform duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Remember me and Forgot password */}
            <motion.div
              className="flex items-center justify-between"
              variants={itemVariants}
              custom={6}
            >
              <motion.label 
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <motion.input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded-lg border-2 border-[#e2d6c3] text-[#c2a792] 
                            focus:ring-[#c2a792] focus:ring-2 focus:ring-offset-0 
                            bg-white/60 backdrop-blur-sm transition-all duration-300"
                  whileTap={{ scale: 0.9 }}
                />
                <span className="text-[#6d7f75] text-sm font-light group-hover:text-[#46594f] transition-colors duration-200">
                  Remember me
                </span>
              </motion.label>
              
              <motion.a
                href="#forgot"
                className="text-[#c2a792] text-sm font-medium hover:text-[#b8956f] transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot password?
              </motion.a>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                        py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                        uppercase tracking-wider text-sm border border-white/20 overflow-hidden group/submit
                        disabled:opacity-70 disabled:cursor-not-allowed relative"
              variants={itemVariants}
              custom={7}
              whileHover={!isLoading ? {
                scale: 1.02,
                boxShadow: "0 15px 35px rgba(194, 167, 146, 0.4)",
                transition: { duration: 0.3 }
              } : {}}
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
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="text-lg">🎨</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <motion.div
              className="relative my-8"
              variants={itemVariants}
              custom={8}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2d6c3]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-[#8a9690] font-light">Or continue with</span>
              </div>
            </motion.div>

            {/* Social login buttons */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={itemVariants}
              custom={9}
            >
              <motion.button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm 
                          border-2 border-[#e2d6c3] rounded-2xl hover:bg-white/80 hover:border-[#c2a792] 
                          transition-all duration-300 text-[#46594f] font-medium text-sm group"
                whileHover={{
                  scale: 1.02,
                  borderColor: "#c2a792",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">🔗</span>
                <span>MetaMask</span>
              </motion.button>
              
              <motion.button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm 
                          border-2 border-[#e2d6c3] rounded-2xl hover:bg-white/80 hover:border-[#c2a792] 
                          transition-all duration-300 text-[#46594f] font-medium text-sm group"
                whileHover={{
                  scale: 1.02,
                  borderColor: "#c2a792",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">👤</span>
                <span>Google</span>
              </motion.button>
            </motion.div>

            {/* Sign up link */}
            <motion.div
              className="text-center pt-4"
              variants={itemVariants}
              custom={10}
            >
              <span className="text-[#8a9690] text-sm font-light">
                Don't have an account?{" "}
                <motion.a
                  href="#signup"
                  className="text-[#c2a792] font-medium hover:text-[#b8956f] transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create one here
                </motion.a>
              </span>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
          custom={11}
        >
          <motion.div
            className="inline-block w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c2a792] to-transparent rounded-full"
            animate={{
              scaleX: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
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
          opacity: [0.12, 0.2, 0.12]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default LoginForm;
