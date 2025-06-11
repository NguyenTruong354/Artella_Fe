import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CosmicPortalProps {
  onComplete: () => void;
}

const CosmicPortal: React.FC<CosmicPortalProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'dot' | 'portal' | 'zoom' | 'flash'>('dot');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('portal'), 1000);
    const timer2 = setTimeout(() => setStage('zoom'), 3000);
    const timer3 = setTimeout(() => setStage('flash'), 5000);
    const timer4 = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
      {/* Initial Dot */}
      {stage === 'dot' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-2 h-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        />
      )}

      {/* Portal Formation */}
      {(stage === 'portal' || stage === 'zoom') && (
        <div className="relative">
          {/* Spiral Galaxy Portal */}
          <motion.div
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              scale: stage === 'zoom' ? 15 : 1, 
              rotate: stage === 'zoom' ? 1440 : 360,
              opacity: 1 
            }}
            transition={{ 
              duration: stage === 'zoom' ? 2 : 2,
              ease: stage === 'zoom' ? "easeIn" : "easeOut"
            }}
            className="relative w-64 h-64"
          >
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 animate-spin-slow">
              <div className="absolute inset-2 rounded-full border-2 border-blue-400/50 animate-spin-reverse">
                <div className="absolute inset-2 rounded-full border border-cyan-300/70 animate-spin-slow">
                  <div className="absolute inset-2 rounded-full bg-gradient-radial from-white/20 via-purple-500/30 to-transparent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Spiral Arms */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-32 h-0.5 origin-left bg-gradient-to-r from-white via-cyan-400 to-transparent"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-50%)`,
                }}
                animate={{
                  rotate: [i * 45, i * 45 + 360],
                  scaleX: [0.5, 1, 0.8, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.1,
                }}
              />
            ))}

            {/* Center Core */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)]"
              animate={{
                scale: [1, 1.5, 1],
                boxShadow: [
                  "0_0_30px_rgba(255,255,255,0.8)",
                  "0_0_60px_rgba(255,255,255,1)",
                  "0_0_30px_rgba(255,255,255,0.8)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Light Streaks during zoom */}
          {stage === 'zoom' && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-96 bg-gradient-to-t from-transparent via-white to-transparent origin-bottom"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-50%)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* White Flash */}
      {stage === 'flash' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-white"
        />
      )}

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CosmicPortal;
