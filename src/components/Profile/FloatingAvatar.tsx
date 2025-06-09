import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import useDarkMode from '../../hooks/useDarkMode';

// Custom Particles Component using CSS animations
const CustomParticles: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle}
          className={`absolute w-1 h-1 rounded-full animate-pulse ${
            isDark ? 'bg-blue-400' : 'bg-orange-400'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
      
      {/* Floating connecting lines effect */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {Array.from({ length: 10 }, (_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke={isDark ? '#64B5F6' : '#FFB74D'}
            strokeWidth="1"
            className="animate-pulse"
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Custom interface để bypass TypeScript errors - không cần nữa vì đã bỏ tsparticles
// interface ParticlesConfig { ... }

const AvatarMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} castShadow receiveShadow>
      <meshStandardMaterial 
        color="#5E5CE6" 
        emissive="#5E5CE6" 
        emissiveIntensity={0.3} 
        roughness={0.4} 
        metalness={0.1} 
      />
    </Sphere>
  );
};

const FloatingAvatar: React.FC = () => {
  const { isDark } = useDarkMode();

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl">
      <CustomParticles isDark={isDark} />
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        className="absolute inset-0 z-10"
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight 
          position={[-5, -5, -5]} 
          intensity={0.3} 
          color="#FFBF00" 
        />
        <Suspense fallback={null}>
          <AvatarMesh />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
    </div>
  );
};

export default FloatingAvatar;