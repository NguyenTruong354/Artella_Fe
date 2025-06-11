import React from 'react';
import { getParticleCount } from './performanceConfig';

interface BackgroundNebulaProps {
  performanceMode?: boolean;
}

const BackgroundNebula: React.FC<BackgroundNebulaProps> = ({ performanceMode = false }) => {
  const dustCount = getParticleCount('cosmicDust', performanceMode);

  if (performanceMode) {
    // Minimal background for performance mode
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-blue-900/5 to-pink-900/5" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static nebula clouds for better performance */}
      <div className="nebula-container">
        <div className="nebula-cloud nebula-purple" />
        <div className="nebula-cloud nebula-blue" />
        <div className="nebula-cloud nebula-pink" />
      </div>

      {/* Minimal cosmic dust */}
      {[...Array(dustCount)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-px h-px bg-white/20 rounded-full animate-dust-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
          }}
        />
      ))}

      {/* Simple distant galaxy */}
      <div className="distant-galaxy" />      {/* Optimized CSS animations */}
      <style>{`
        .nebula-container {
          animation: slow-rotate 400s linear infinite;
        }
        
        .nebula-cloud {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
        }
        
        .nebula-purple {
          width: 500px;
          height: 300px;
          top: 15%;
          left: 10%;
          background: radial-gradient(circle, rgba(138,43,226,0.3) 0%, transparent 70%);
        }
        
        .nebula-blue {
          width: 400px;
          height: 500px;
          top: 45%;
          right: 20%;
          background: radial-gradient(circle, rgba(0,100,200,0.25) 0%, transparent 70%);
        }
        
        .nebula-pink {
          width: 450px;
          height: 250px;
          bottom: 25%;
          left: 35%;
          background: radial-gradient(circle, rgba(255,20,147,0.2) 0%, transparent 70%);
        }
        
        .distant-galaxy {
          position: absolute;
          top: 20%;
          right: 25%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
          border-radius: 50%;
          opacity: 0.15;
          animation: galaxy-pulse 15s ease-in-out infinite;
        }
        
        .animate-dust-float {
          animation: dust-float 20s ease-in-out infinite;
        }
        
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes dust-float {
          0%, 100% {
            transform: translateX(0) translateY(0);
            opacity: 0.1;
          }
          50% {
            transform: translateX(40px) translateY(-20px);
            opacity: 0.25;
          }
        }
        
        @keyframes galaxy-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundNebula;
