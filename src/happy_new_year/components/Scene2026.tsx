import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// @ts-ignore
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

interface Scene2026Props {
  onComplete?: () => void;
}

const Scene2026: React.FC<Scene2026Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000); 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Resize handler
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize, false);

    // 2. Load Font and Create Particles
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font: any) => {
      if (!isMountedRef.current) return;
      
      // Create Text Geometry
      const textGeometry = new TextGeometry('2026', {
        font: font,
        size: 50,
        height: 5, // Full 3D depth
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 3
      });

      textGeometry.center();

      // Create a mesh to sample from (we don't add this to scene)
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Sample points
      const sampler = new MeshSurfaceSampler(textMesh).build();
      
      // Create edge points for sharper definition
      const edgesGeometry = new THREE.EdgesGeometry(textGeometry, 1); 
      const edgePositionsAttribute = edgesGeometry.attributes.position.array;
      const edgePoints: THREE.Vector3[] = [];
      
      for (let i = 0; i < edgePositionsAttribute.length; i += 6) {
        const start = new THREE.Vector3(edgePositionsAttribute[i], edgePositionsAttribute[i+1], edgePositionsAttribute[i+2]);
        const end = new THREE.Vector3(edgePositionsAttribute[i+3], edgePositionsAttribute[i+4], edgePositionsAttribute[i+5]);
        const length = start.distanceTo(end);
        const steps = Math.max(1, Math.ceil(length / 0.8)); // Reduced density for softer edges
        
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          edgePoints.push(new THREE.Vector3().lerpVectors(start, end, t));
        }
      }

      const surfaceParticleCount = 200000; 
      const particleCount = surfaceParticleCount + edgePoints.length;
      
      const geometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(particleCount * 3);
      const targetPositions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      
      const tempPosition = new THREE.Vector3();
      const tempNormal = new THREE.Vector3();
      const color = new THREE.Color();

      // Helper to set color based on depth (Z) and normal
      const setColor = (z: number, normal: THREE.Vector3, index: number, isEdge: boolean = false) => {
        // Normalize Z from approx -2.5 to 2.5 (text depth is 5)
        const normalizedZ = (z + 2.5) / 5; 
        const clampedZ = Math.max(0, Math.min(1, normalizedZ));
        
        // Base lightness from depth
        let lightness = 0.2 + (clampedZ * 0.4); 
        
        // Highlight side faces (where normal Z is small) or edges
        if (isEdge) {
            lightness = Math.min(1.0, lightness + 0.2); // Subtle edge highlight
        } else if (Math.abs(normal.z) < 0.5) {
            lightness = Math.min(1.0, lightness + 0.3); // Boost brightness for sides
        }
        
        // Make 2026 Gold/Orange to differentiate
        color.setHSL(0.08, 1.0, lightness); 
        
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
      };

      // 1. Generate Edge Particles
      for (let i = 0; i < edgePoints.length; i++) {
          const p = edgePoints[i];
          targetPositions[i * 3] = p.x;
          targetPositions[i * 3 + 1] = p.y;
          targetPositions[i * 3 + 2] = p.z;

          positions[i * 3] = (Math.random() - 0.5) * 800; 
          positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

          setColor(p.z, tempNormal, i, true);
      }

      // 2. Generate Surface Particles
      for (let i = edgePoints.length; i < particleCount; i++) {
        // Sample uniformly from all surfaces (front, back, sides)
        sampler.sample(tempPosition, tempNormal);

        targetPositions[i * 3] = tempPosition.x;
        targetPositions[i * 3 + 1] = tempPosition.y;
        targetPositions[i * 3 + 2] = tempPosition.z;

        positions[i * 3] = (Math.random() - 0.5) * 800; // Wider scatter
        positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

        setColor(tempPosition.z, tempNormal, i, false);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.2, // Reduced size for dense coverage
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 1.0 
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const clock = new THREE.Clock();
      let animationPhase = 'forming';
      
      const animate = () => {
        if (!isMountedRef.current) return;
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        const positions = particles.geometry.attributes.position.array as Float32Array;

        if (animationPhase === 'forming' && time > 2.0) {
            animationPhase = 'holding';
        }
        
        if (animationPhase === 'holding' && time > 8.0) {
            animationPhase = 'exploding';
            
            // Initialize explosion velocities
            for (let i = 0; i < particleCount; i++) {
                velocities[i * 3] = (Math.random() - 0.5) * 10; 
                velocities[i * 3 + 1] = (Math.random() - 0.5) * 10 + 5; 
                velocities[i * 3 + 2] = (Math.random() - 0.5) * 10; 
            }
        }

        if (animationPhase !== 'exploding') {
            particles.rotation.y = Math.sin(time * 0.1) * 0.1;
            particles.rotation.x = Math.cos(time * 0.1) * 0.1;
        } else {
             // Global Fade out during explosion
             if (material.opacity > 0) {
                 material.opacity -= 0.005; 
             } else {
                 if (onComplete && !hasCompletedRef.current) {
                     hasCompletedRef.current = true;
                     onComplete();
                 }
             }
        }

        for (let i = 0; i < particleCount; i++) {
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const pz = positions[i * 3 + 2];

          if (animationPhase === 'exploding') {
             // Gravity
             velocities[i * 3 + 1] -= 0.2; 
             
             // Apply velocity
             positions[i * 3] += velocities[i * 3];
             positions[i * 3 + 1] += velocities[i * 3 + 1];
             positions[i * 3 + 2] += velocities[i * 3 + 2];
          } else {
              const tx = targetPositions[i * 3];
              const ty = targetPositions[i * 3 + 1];
              const tz = targetPositions[i * 3 + 2];

              positions[i * 3] += (tx - px) * 0.05; // Slower formation
              positions[i * 3 + 1] += (ty - py) * 0.05;
              positions[i * 3 + 2] += (tz - pz) * 0.05;
              
              positions[i * 3] += Math.sin(time * 2 + i) * 0.005;
              positions[i * 3 + 1] += Math.cos(time * 1.5 + i) * 0.005;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', onWindowResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden', 
        backgroundColor: 'black',
      }} 
    />
  );
};

export default Scene2026;