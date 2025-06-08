import React, { Suspense, useRef } from 'react'; // Removed useCallback, Engine
import * as THREE from 'three'; // Explicit THREE import
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import Particles from 'react-tsparticles';
import type { IOptions, RecursivePartial } from '@tsparticles/engine'; // Ensure all tsparticles types are from @tsparticles/engine
import { MoveDirection } from '@tsparticles/engine'; 
import useDarkMode from '../../hooks/useDarkMode'; 

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
      <meshStandardMaterial color="#5E5CE6" emissive="#5E5CE6" emissiveIntensity={0.3} roughness={0.4} metalness={0.1} />
    </Sphere>
  );
};

const FloatingAvatar: React.FC = () => {
  const { isDark } = useDarkMode();

  // Removing particlesInit for now to simplify engine type issues.
  // react-tsparticles should handle basic initialization.
  // const particlesInit = useCallback(async (engine: Engine) => {
  // }, []);

  const particlesOptionsLight: RecursivePartial<IOptions> = { 
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: { enable: true }, // Corrected: resize is an object
      },
      modes: {
        repulse: {
          distance: 80,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#FF9800', 
      },
      links: {
        color: '#FFB74D', 
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: MoveDirection.none, // Using MoveDirection enum from @tsparticles/engine
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        // density: { // Removing density configuration to avoid type issues
        //   enable: true,
        //   value_area: 800, 
        // },
        value: 50, // Keep the particle count
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  const particlesOptionsDark: RecursivePartial<IOptions> = { // Explicitly typed with @tsparticles/engine IOptions
    ...particlesOptionsLight,
    particles: {
      ...(particlesOptionsLight.particles ?? {}),
      color: {
        value: '#007BFF', // Blue for dark mode
      },
      links: {
        ...(particlesOptionsLight.particles?.links ?? {}),
        color: '#64B5F6', // Lighter Blue
      },
    },
  };

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl">
      <Particles
        id="tsparticles"
        // init={particlesInit} // Removed init
        options={isDark ? particlesOptionsDark : particlesOptionsLight}
        className="absolute inset-0 z-0"
      />
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
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#FFBF00" />
        <Suspense fallback={null}>
          <AvatarMesh />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default FloatingAvatar;
