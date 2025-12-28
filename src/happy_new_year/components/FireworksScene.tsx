import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const FireworksScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (!containerRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 100);
    camera.lookAt(0, 20, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Enable tone mapping for better bloom handling
    renderer.toneMapping = THREE.ReinhardToneMapping;
    containerRef.current.appendChild(renderer.domElement);

    // --- 2. Post-Processing (Bloom) ---
    const renderScene = new RenderPass(scene, camera);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.3;
    bloomPass.threshold = 0.6;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- 3. Particle Texture Generation ---
    const getParticleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (!context) return new THREE.Texture();
        
        // Radial gradient for soft particle
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };
    const particleTexture = getParticleTexture();

    // --- 4. Firework Logic ---
    
    // Types
    type FireworkType = 'sphere' | 'willow' | 'ring' | 'crossette';
    
    interface Particle {
        position: THREE.Vector3;
        velocity: THREE.Vector3;
        color: THREE.Color;
        baseColor: THREE.Color;
        alpha: number;
        life: number;
        maxLife: number;
        size: number;
        type: 'rocket' | 'spark' | 'trail';
    }

    const particles: Particle[] = [];
    const gravity = new THREE.Vector3(0, -15, 0); // Stronger gravity
    
    // Reusable geometry for drawing particles
    const geometry = new THREE.BufferGeometry();
    const maxParticles =20000; // Limit active particles
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom ShaderMaterial for per-particle size and soft texture
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Helper: Create Explosion
    const createExplosion = (position: THREE.Vector3, color: THREE.Color, type: FireworkType) => {
        const count = type === 'ring' ? 600 : (type === 'crossette' ? 300 : 1500);
        
        for (let i = 0; i < count; i++) {
            if (particles.length >= maxParticles) break;

            const p = new THREE.Vector3().copy(position);
            const v = new THREE.Vector3();
            
            // Velocity distribution based on type
            if (type === 'sphere') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const speed = 15 + Math.random() * 10; // Reduced speed (15-25)
                
                v.x = speed * Math.sin(phi) * Math.cos(theta);
                v.y = speed * Math.sin(phi) * Math.sin(theta);
                v.z = speed * Math.cos(phi);
            } else if (type === 'willow') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const speed = 10 + Math.random() * 10; // Slower for willow
                
                v.x = speed * Math.sin(phi) * Math.cos(theta);
                v.y = speed * Math.sin(phi) * Math.sin(theta);
                v.z = speed * Math.cos(phi);
            } else if (type === 'ring') {
                const theta = Math.random() * Math.PI * 2;
                const speed = 20; // Reduced speed
                // Flat ring in XZ plane or XY plane
                v.x = speed * Math.cos(theta);
                v.y = speed * Math.sin(theta); // Vertical ring
                v.z = (Math.random() - 0.5) * 4; // Slight thickness
            } else if (type === 'crossette') {
                 // 4 directions
                 const angle = (Math.floor(i / (count/4)) * Math.PI / 2) + (Math.random() * 0.2);
                 const speed = 25; // Reduced speed
                 v.x = Math.cos(angle) * speed;
                 v.y = Math.sin(angle) * speed;
                 v.z = (Math.random() - 0.5) * 10;
            }

            particles.push({
                position: p,
                velocity: v,
                color: new THREE.Color(1, 1, 0.8), // Start bright white/yellow
                baseColor: color.clone(),
                alpha: 1.0,
                life: 0,
                maxLife: type === 'willow' ? 3.0 : 2.0, // Reduced max life
                size: type === 'willow' ? 0.8 : 1.5,
                type: 'spark'
            });
        }
    };

    // Helper: Launch Rocket
    const launchRocket = () => {
        const startX = (Math.random() - 0.5) * 150; // Wider launch area
        const targetY = 60 + Math.random() * 40; // Higher targets
        const startPos = new THREE.Vector3(startX, -40, (Math.random() - 0.5) * 80);
        
        // Calculate velocity to reach target height approx
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            50 + Math.random() * 15, // Faster launch
            (Math.random() - 0.5) * 8
        );

        const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);

        particles.push({
            position: startPos,
            velocity: velocity,
            color: color.clone(),
            baseColor: color,
            alpha: 1.0,
            life: 0,
            maxLife: 1.5 + Math.random() * 0.5, // Time until explosion
            size: 3.0, // Bigger rocket
            type: 'rocket'
        });
    };

    // --- 5. Animation Loop ---
    const clock = new THREE.Clock();
    let lastLaunchTime = 0;
    let frameCount = 0;

    const animate = () => {
        if (!isMountedRef.current) return;
        requestAnimationFrame(animate);

        frameCount++;
        const delta = Math.min(clock.getDelta(), 0.1); // Cap delta
        const time = clock.getElapsedTime();

        // Launch logic
        if (time - lastLaunchTime > 0.4) { // Launch more frequently (every 0.4s)
            launchRocket();
            lastLaunchTime = time;
        }

        // Update particles
        let activeCount = 0;
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life += delta;

            // Physics
            p.velocity.addScaledVector(gravity, delta);
            
            // Air resistance (Drag)
            // Apply stronger drag to horizontal movement for graceful fall
            p.velocity.x *= 0.995; // Reduced drag (was 0.96)
            p.velocity.z *= 0.995;
            p.velocity.y *= 0.995; 

            p.position.addScaledVector(p.velocity, delta);

            // Color Transition for Sparks
            if (p.type === 'spark') {
                const progress = p.life / p.maxLife;
                
                if (progress < 0.15) {
                    p.color.lerpColors(new THREE.Color(1, 1, 0.8), p.baseColor, progress * 6.6);
                } else if (progress > 0.7) {
                    p.color.copy(p.baseColor);
                    p.alpha = 1.0 - ((progress - 0.7) / 0.3);
                } else {
                    p.color.copy(p.baseColor);
                    p.alpha = 1.0;
                }
            } else if (p.type === 'trail') {
                 p.alpha = 1.0 - (p.life / p.maxLife);
            }

            // Trail spawning - Optimized
            if (p.type === 'rocket' || (p.type === 'spark')) {
                 // Rockets: every frame. Sparks: every 6 frames + random chance
                 const shouldSpawn = p.type === 'rocket' || (frameCount % 6 === 0 && Math.random() < 0.3);
                 
                 if (shouldSpawn && particles.length < maxParticles) {
                     particles.push({
                         position: p.position.clone(),
                         velocity: new THREE.Vector3(0,0,0), // Static trail
                         color: p.color.clone(),
                         baseColor: p.baseColor.clone(),
                         alpha: p.alpha * 0.5,
                         life: 0,
                         maxLife: 0.3, // Short life for continuous trail look
                         size: p.size * 0.6,
                         type: 'trail'
                     });
                 }
            }

            // Lifecycle
            if (p.type === 'rocket') {
                if (p.velocity.y < 0 || p.life > p.maxLife) {
                    // Explode
                    const types: FireworkType[] = ['sphere', 'willow', 'ring', 'crossette'];
                    const type = types[Math.floor(Math.random() * types.length)];
                    createExplosion(p.position, p.color, type);
                    particles[i] = particles[particles.length - 1];
                    particles.pop();
                    continue;
                }
            } else {
                // Fade out
                if (p.alpha <= 0 || p.life > p.maxLife) {
                    particles[i] = particles[particles.length - 1];
                    particles.pop();
                    continue;
                }
            }

            // Update Buffer Arrays
            if (activeCount < maxParticles) {
                positions[activeCount * 3] = p.position.x;
                positions[activeCount * 3 + 1] = p.position.y;
                positions[activeCount * 3 + 2] = p.position.z;

                colors[activeCount * 3] = p.color.r * p.alpha; // Premultiply alpha roughly or just use opacity?
                // Actually PointsMaterial vertexColors uses the color attribute. 
                // To handle alpha per particle in a single draw call is tricky without custom shader.
                // Standard PointsMaterial uses the texture alpha * material opacity * vertex color.
                // But vertex color is usually RGB. 
                // We can simulate fade by darkening the color (fade to black)
                colors[activeCount * 3] = p.color.r * p.alpha;
                colors[activeCount * 3 + 1] = p.color.g * p.alpha;
                colors[activeCount * 3 + 2] = p.color.b * p.alpha;

                sizes[activeCount] = p.size;
                activeCount++;
            }
        }

        // Update Geometry
        geometry.setDrawRange(0, activeCount);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;

        // Render
        composer.render();
    };

    animate();

    // Resize
    const onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
        isMountedRef.current = false;
        window.removeEventListener('resize', onWindowResize);
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        composer.dispose();
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

export default FireworksScene;
