import React from 'react';
import { getParticleCount } from './performanceConfig';

interface ParticleEffectsProps {
  performanceMode?: boolean;
}

const ParticleEffects: React.FC<ParticleEffectsProps> = ({ performanceMode = false }) => {
  const floatingCount = getParticleCount('floating', performanceMode);
  const orbCount = getParticleCount('energyOrbs', performanceMode);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles with pure CSS animations */}
        {[...Array(floatingCount)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 6}s`,
            }}
          />
        ))}

        {/* Energy orbs - minimal count */}
        {!performanceMode && [...Array(orbCount)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute w-1 h-1 rounded-full opacity-50 animate-pulse-slow"
            style={{
              backgroundColor: [
                'rgba(0, 255, 255, 0.6)',
                'rgba(255, 20, 147, 0.6)',
                'rgba(138, 43, 226, 0.6)',
              ][i % 3],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* CSS animations for optimal performance */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
            transform: scale(1);
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-120px) translateX(30px) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ParticleEffects;
