import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  // Đặt thời gian kết thúc (ví dụ: 30 ngày từ bây giờ)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, color: "from-[#c2a792] to-[#d8bca6]" },
    { label: "Hours", value: timeLeft.hours, color: "from-[#d8bca6] to-[#e8d0b3]" },
    { label: "Minutes", value: timeLeft.minutes, color: "from-[#e8d0b3] to-[#f0e4d1]" },
    { label: "Seconds", value: timeLeft.seconds, color: "from-[#f0e4d1] to-[#c2a792]" }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  return (
    <motion.div
      className="mt-4 mb-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >      {/* Countdown Title */}
      <motion.div
        className="text-center mb-3"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 
          className="text-lg md:text-xl font-bold text-gray-700 mb-1"
          style={{ fontFamily: 'Segoe Print, cursive' }}
        >
          Exhibition Starts In
        </h3>
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#c2a792] to-[#d8bca6] mx-auto rounded-full"></div>
      </motion.div>      {/* Countdown Display */}
      <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            {/* Decorative background circle */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-sm shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
              {/* Main container */}
            <motion.div
              className={`relative bg-gradient-to-br ${unit.color} p-2 md:p-3 rounded-xl 
                         shadow-lg border border-white/20 backdrop-blur-sm min-w-[60px] md:min-w-[70px]
                         group-hover:shadow-xl transition-all duration-300`}
              variants={unit.label === "Seconds" ? pulseVariants : {}}
              animate={unit.label === "Seconds" ? "pulse" : ""}
            >              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                           rounded-xl transform -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
              
                {/* Time value */}
              <motion.div
                className="text-center relative z-10"
                key={unit.value} // Key để trigger re-render khi giá trị thay đổi
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="text-lg md:text-2xl font-bold text-white drop-shadow-md"
                  style={{ fontFamily: 'Segoe Print, cursive' }}
                >
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div 
                  className="text-xs font-medium uppercase tracking-wider text-white/90"
                  style={{ fontFamily: 'Segoe Print, cursive' }}
                >
                  {unit.label}
                </div>
              </motion.div>              {/* Decorative corner elements */}
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            </motion.div>

            {/* Floating particles */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-[#c2a792]/60 rounded-full"
              animate={{
                y: [0, -6, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          </motion.div>
        ))}
      </div>      {/* Call to action text */}
      <motion.p
        className="text-center mt-3 text-gray-600 text-xs md:text-sm font-light"
        style={{ fontFamily: 'Segoe Print, cursive' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        Don't miss your chance to be part of history
      </motion.p>
    </motion.div>
  );
};

export default CountdownTimer;
