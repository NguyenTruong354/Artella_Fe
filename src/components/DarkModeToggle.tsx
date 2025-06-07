import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import useDarkMode from '../hooks/useDarkMode';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  className = ''
}) => {
  const { isDark, isTransitioning, toggleTheme } = useDarkMode();

  return (
    <motion.button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`
        relative group overflow-hidden
        w-14 h-14 rounded-2xl 
        bg-gradient-to-br transition-all duration-500
        ${isDark 
          ? 'from-slate-800 via-slate-700 to-slate-900 hover:from-slate-700 hover:via-slate-600 hover:to-slate-800' 
          : 'from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600'
        }
        border-2 transition-colors duration-500
        ${isDark 
          ? 'border-slate-600 hover:border-slate-500' 
          : 'border-amber-300 hover:border-amber-200'
        }
        shadow-lg hover:shadow-xl
        ${isDark ? 'shadow-slate-900/50' : 'shadow-amber-500/30'}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ scale: isTransitioning ? 1 : 1.05 }}
      whileTap={{ scale: isTransitioning ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Background glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500
        ${isDark 
          ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-slate-600' 
          : 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500'
        }
      `} />

      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key="transitioning"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
              className="text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            </motion.div>
          ) : isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: {
                  duration: 0.5,
                  ease: "backOut"
                }
              }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              className="text-slate-100 group-hover:text-white transition-colors"
            >
              <Moon className="w-6 h-6 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: {
                  duration: 0.5,
                  ease: "backOut"
                }
              }}
              exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
              className="text-amber-900 group-hover:text-amber-800 transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatDelay: 1
                }}
              >
                <Sun className="w-6 h-6 fill-current" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={false}
        animate={isTransitioning ? {
          background: [
            'radial-gradient(circle, transparent 0%, transparent 100%)',
            `radial-gradient(circle, ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(251, 191, 36, 0.3)'} 0%, transparent 70%)`,
            'radial-gradient(circle, transparent 0%, transparent 100%)'
          ]
        } : {}}
        transition={{ duration: 0.8 }}
      />

      {/* Tooltip */}
      <div className={`
        absolute -top-12 left-1/2 transform -translate-x-1/2
        px-3 py-1 rounded-lg text-xs font-medium
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none whitespace-nowrap
        ${isDark 
          ? 'bg-slate-800 text-slate-200 border border-slate-600' 
          : 'bg-white text-gray-700 border border-amber-200 shadow-lg'
        }
      `}>
        {isTransitioning ? 'Switching...' : isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        <div className={`
          absolute top-full left-1/2 transform -translate-x-1/2
          border-4 border-transparent
          ${isDark ? 'border-t-slate-800' : 'border-t-white'}
        `} />      </div>
    </motion.button>
  );
};
