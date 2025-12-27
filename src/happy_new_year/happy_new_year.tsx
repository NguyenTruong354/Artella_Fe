import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// @ts-ignore
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

const HappyNewYear: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Mouse interaction
    // const mouse = new THREE.Vector2(10000, 10000); // Initialize far away to avoid initial hole
    // const target = new THREE.Vector2();
    // const windowHalfX = window.innerWidth / 2;
    // const windowHalfY = window.innerHeight / 2;

    // const onDocumentMouseMove = (event: MouseEvent) => {
    //   mouse.x = (event.clientX - windowHalfX);
    //   mouse.y = (event.clientY - windowHalfY);
    // };
    // document.addEventListener('mousemove', onDocumentMouseMove, false);

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
      const textGeometry = new TextGeometry('2025', {
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
        const steps = Math.max(1, Math.ceil(length / 1)); // Reduced density for softer edges
        
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
            lightness = Math.min(1.0, lightness + 0.1); // Subtle edge highlight
        } else if (Math.abs(normal.z) < 0.5) {
            lightness = Math.min(1.0, lightness + 0.1); // Boost brightness for sides
        }
        
        color.setHSL(0.5, 1.0, lightness);
        
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
        opacity: 1.0 // Base opacity, controlled by vertex color lightness
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const clock = new THREE.Clock();
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        const positions = particles.geometry.attributes.position.array as Float32Array;

        particles.rotation.y = Math.sin(time * 0.1) * 0.1;
        particles.rotation.x = Math.cos(time * 0.1) * 0.1;

        for (let i = 0; i < particleCount; i++) {
          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const pz = positions[i * 3 + 2];

          const tx = targetPositions[i * 3];
          const ty = targetPositions[i * 3 + 1];
          const tz = targetPositions[i * 3 + 2];

          positions[i * 3] += (tx - px) * 0.1;
          positions[i * 3 + 1] += (ty - py) * 0.1;
          positions[i * 3 + 2] += (tz - pz) * 0.1;
          
          positions[i * 3] += Math.sin(time * 2 + i) * 0.005;
          positions[i * 3 + 1] += Math.cos(time * 1.5 + i) * 0.005;

          // Mouse interaction removed
          /*
          const mouseXWorld = (mouse.x / windowHalfX) * 100; 
          const mouseYWorld = -(mouse.y / windowHalfY) * 60; 

          const dx = mouseXWorld - px;
          const dy = mouseYWorld - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 20) {
             const force = (20 - dist) / 20;
             positions[i * 3] -= dx * force * 0.5;
             positions[i * 3 + 1] -= dy * force * 0.5;
          }
          */
        }

        particles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', onWindowResize);
      // document.removeEventListener('mousemove', onDocumentMouseMove);
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
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden', 
        backgroundColor: 'black',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999 // Ensure it's on top if used as an overlay, or remove if it's a page
      }} 
    />
  );
};

export default HappyNewYear;
