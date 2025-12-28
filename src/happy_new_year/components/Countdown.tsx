import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// @ts-ignore
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// @ts-ignore
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

interface CountdownProps {
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  // Update ref if prop changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    isMountedRef.current = true;
    if (!containerRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Particles Setup
    const particleCount = 100000; // High density for single digit
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Initialize positions randomly
    for(let i=0; i<particleCount*3; i++) {
        positions[i] = (Math.random() - 0.5) * 500;
        targetPositions[i] = (Math.random() - 0.5) * 500; 
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Font Loader & Logic
    const loader = new FontLoader();
    let fontData: any = null;

    const updateText = (text: string) => {
        if (!fontData) return;

        const textGeometry = new TextGeometry(text, {
            font: fontData,
            size: 60,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelOffset: 0,
            bevelSegments: 3
        });
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        const sampler = new MeshSurfaceSampler(textMesh).build();
        
        const tempPosition = new THREE.Vector3();
        const tempNormal = new THREE.Vector3();
        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            sampler.sample(tempPosition, tempNormal);
            targetPositions[i * 3] = tempPosition.x;
            targetPositions[i * 3 + 1] = tempPosition.y;
            targetPositions[i * 3 + 2] = tempPosition.z;

            // Color logic
             const normalizedZ = (tempPosition.z + 2.5) / 5; 
             let lightness = 0.3 + (normalizedZ * 0.5);
             if (Math.abs(tempNormal.z) < 0.5) lightness += 0.2;
             
             // Gold/Yellow color for countdown
             color.setHSL(0.1, 1.0, lightness);
             colors[i*3] = color.r;
             colors[i*3+1] = color.g;
             colors[i*3+2] = color.b;
        }
        geometry.attributes.color.needsUpdate = true;
    };

    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font: any) => {
        if (!isMountedRef.current) return;
        fontData = font;
        updateText('5'); // Start with 5
        
        // Start Countdown Logic
        let count = 5;
        intervalRef.current = setInterval(() => {
            count--;
            if (count > 0) {
                updateText(count.toString());
            } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (onCompleteRef.current && !hasCompletedRef.current) {
                    hasCompletedRef.current = true;
                    onCompleteRef.current();
                }
            }
        }, 2000);
    });

    // 4. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
        if (!isMountedRef.current) return;
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Morphing
        for (let i = 0; i < particleCount; i++) {
            const px = positions[i * 3];
            const py = positions[i * 3 + 1];
            const pz = positions[i * 3 + 2];
            const tx = targetPositions[i * 3];
            const ty = targetPositions[i * 3 + 1];
            const tz = targetPositions[i * 3 + 2];

            // Smooth interpolation
            positions[i * 3] += (tx - px) * 0.1;
            positions[i * 3 + 1] += (ty - py) * 0.1;
            positions[i * 3 + 2] += (tz - pz) * 0.1;
            
            // Slight noise/vibration
            positions[i * 3] += Math.sin(time * 10 + i) * 0.02;
            positions[i * 3 + 1] += Math.cos(time * 8 + i) * 0.02;
        }
        
        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    };
    animate();

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
        isMountedRef.current = false;
        window.removeEventListener('resize', onWindowResize);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, []); // Empty dependency array to prevent re-runs

  return <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />;
};

export default Countdown;