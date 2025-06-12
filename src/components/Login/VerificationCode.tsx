import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoginBackground from "./LoginBackground";

const VerificationCode = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    controls.start("visible");
    
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [controls]);

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

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock verification
      if (verificationCode === "123456") {
        console.log("Verification successful");
        navigate("/login");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setError("");
    
    // Start countdown again
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate resend API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Verification code resent");
    } catch (error) {
      console.error("Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-6">
      {/* Background Component */}
      <LoginBackground />

      {/* Main verification container */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Verification card */}
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
              Verify Your Email
            </motion.h1>

            <motion.p
              className="text-[#6d7f75] font-light mb-2"
              variants={itemVariants}
              custom={2}
            >
              We've sent a 6-digit code to your email
            </motion.p>

            <motion.p
              className="text-[#8a9690] text-sm"
              variants={itemVariants}
              custom={2}
            >
              example@email.com
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
          </motion.div>

          {/* Verification form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
            variants={itemVariants}
            custom={3}
          >
            {/* Code input fields */}
            <motion.div variants={itemVariants} custom={4}>
              <label className="block text-[#46594f] font-medium mb-4 text-sm text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3 mb-4">
                {code.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-bold bg-white/60 backdrop-blur-sm 
                              border-2 border-[#e2d6c3] rounded-xl focus:outline-none focus:border-[#c2a792] 
                              focus:bg-white/80 transition-all duration-300 text-[#46594f]"
                    maxLength={1}
                    whileFocus={{
                      borderColor: "#c2a792",
                      backgroundColor: "rgba(255,255,255,0.8)",
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                  />
                ))}
              </div>
              
              {error && (
                <motion.p
                  className="text-red-500 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full bg-gradient-to-r from-[#c2a792] via-[#d0b5a0] to-[#d8bca6] text-white 
                        py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 
                        uppercase tracking-wider text-sm border border-white/20 overflow-hidden group/submit
                        disabled:opacity-70 disabled:cursor-not-allowed relative"
              variants={itemVariants}
              custom={5}
              whileHover={
                !isLoading && code.join("").length === 6
                  ? {
                      scale: 1.02,
                      boxShadow: "0 15px 35px rgba(194, 167, 146, 0.4)",
                      transition: { duration: 0.3 },
                    }
                  : {}
              }
              whileTap={!isLoading && code.join("").length === 6 ? { scale: 0.98 } : {}}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[#b8956f] to-[#c2a792] opacity-0 
                          group-hover/submit:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  "Verify Code"
                )}
              </span>
            </motion.button>

            {/* Resend section */}
            <motion.div
              className="text-center pt-4"
              variants={itemVariants}
              custom={6}
            >
              <p className="text-[#8a9690] text-sm mb-2">
                Didn't receive the code?
              </p>
              
              {canResend ? (
                <motion.button
                  type="button"
                  onClick={handleResend}
                  className="text-[#c2a792] font-medium hover:text-[#b8956f] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resend Code
                </motion.button>
              ) : (
                <p className="text-[#8a9690] text-sm">
                  Resend code in {resendTimer}s
                </p>
              )}
            </motion.div>

            {/* Back to signup */}
            <motion.div
              className="text-center pt-4 border-t border-[#e2d6c3]/50"
              variants={itemVariants}
              custom={7}
            >
              <motion.button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#6d7f75] hover:text-[#46594f] transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back to Sign Up
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
          custom={8}
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
    </div>
  );
};

export default VerificationCode;
