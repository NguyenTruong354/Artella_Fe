import React, { Suspense, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import Particles from 'react-tsparticles';
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";
import useDarkMode from '../../hooks/useDarkMode';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Custom interface để bypass TypeScript errors
interface ParticlesConfig {
  fpsLimit: number;
  interactivity: {
    events: {
      onHover: {
        enable: boolean;
        mode: string;
      };
      resize: boolean;
    };
    modes: {
      repulse: {
        distance: number;
        duration: number;
      };
    };
  };
  particles: {
    color: {
      value: string;
    };
    links: {
      color: string;
      distance: number;
      enable: boolean;
      opacity: number;
      width: number;
    };
    move: {
      direction: string;
      enable: boolean;
      outModes: {
        default: string;
      };
      random: boolean;
      speed: number;
      straight: boolean;
    };
    number: {
      value: number;
    };
    opacity: {
      value: number;
    };
    shape: {
      type: string;
    };
    size: {
      value: {
        min: number;
        max: number;
      };
    };
  };
  detectRetina: boolean;
}

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

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Sử dụng custom interface thay vì any
  const particlesOptionsLight: ParticlesConfig = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 80,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: "#FF9800"
      },
      links: {
        color: "#FFB74D",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: true,
        speed: 0.5,
        straight: false
      },
      number: {
        value: 50
      },
      opacity: {
        value: 0.4
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 }
      }
    },
    detectRetina: true
  };

  const particlesOptionsDark: ParticlesConfig = {
    ...particlesOptionsLight,
    particles: {
      ...particlesOptionsLight.particles,
      color: {
        value: "#007BFF"
      },
      links: {
        ...particlesOptionsLight.particles.links,
        color: "#64B5F6"
      }
    }
  };

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={(isDark ? particlesOptionsDark : particlesOptionsLight) as any}
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