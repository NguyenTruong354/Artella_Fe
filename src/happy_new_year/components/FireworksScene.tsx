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
  const shakeIntensity = useRef(0);
  const baseCameraPos = useRef(new THREE.Vector3(0, 20, 100));

  // Color Palettes
  const PALETTES = [
    [new THREE.Color('#FFD700'), new THREE.Color('#FFFFFF')], // Gold/White
    [new THREE.Color('#FF4500'), new THREE.Color('#FF8C00'), new THREE.Color('#FFFF00')], // Fire
    [new THREE.Color('#00FFFF'), new THREE.Color('#1E90FF'), new THREE.Color('#9400D3')], // Ice/Galaxy
    [new THREE.Color('#FF1493'), new THREE.Color('#FF69B4'), new THREE.Color('#FFFFFF')], // Pink
    [new THREE.Color('#32CD32'), new THREE.Color('#00FF00'), new THREE.Color('#F0FFF0')], // Nature
    [new THREE.Color('#FF0000'), new THREE.Color('#FFFFFF'), new THREE.Color('#0000FF')], // Tricolor
  ];

  useEffect(() => {
    isMountedRef.current = true;
    if (!containerRef.current) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005); // Very dark blue/black for depth

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.copy(baseCameraPos.current);
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
    bloomPass.strength = 2.0; // Enhanced bloom
    bloomPass.radius = 0.5;
    bloomPass.threshold = 0.2; // Catch more colors

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- 3. Particle Texture Generation (Atlas) ---
    const getParticleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Texture();
        
        // Helper: Glow Gradient
        const drawGlow = (x: number, y: number, color: string = 'rgba(255,255,255,1)') => {
            const grad = ctx.createRadialGradient(x+16, y+16, 0, x+16, y+16, 16);
            grad.addColorStop(0, color);
            grad.addColorStop(0.2, 'rgba(255,255,255,0.8)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, 32, 32);
        };

        // 1. Circle (Top Left) - 0
        drawGlow(0, 0);

        // 2. Star (Top Right) - 1
        ctx.save();
        ctx.translate(48, 16);
        ctx.beginPath();
        for(let i=0; i<5; i++){
            const angle = (i * 4 * Math.PI) / 5 - Math.PI/2;
            ctx.lineTo(Math.cos(angle)*12, Math.sin(angle)*12);
        }
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
        drawGlow(32, 0, 'rgba(255,255,255,0.5)');

        // 3. Diamond (Bottom Left) - 2
        ctx.save();
        ctx.translate(16, 48);
        ctx.rotate(Math.PI/4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-8, -8, 16, 16);
        ctx.restore();
        drawGlow(0, 32, 'rgba(255,255,255,0.5)');

        // 4. Cross (Bottom Right) - 3
        ctx.save();
        ctx.translate(48, 48);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-3, -12, 6, 24);
        ctx.fillRect(-12, -3, 24, 6);
        ctx.restore();
        drawGlow(32, 32, 'rgba(255,255,255,0.5)');
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };
    const particleTexture = getParticleTexture();

    // --- 4. Firework Logic ---
    
    // Types
    type FireworkType = 'sphere' | 'willow' | 'ring' | 'crossette' | 'heart' | 'palm' | 'dahlia' | 'kamuro' | 'spiral' | 'text';
    
    interface Particle {
        position: THREE.Vector3;
        velocity: THREE.Vector3;
        color: THREE.Color;
        baseColor: THREE.Color;
        secondaryColor?: THREE.Color;
        alpha: number;
        life: number;
        maxLife: number;
        size: number;
        type: 'rocket' | 'spark' | 'trail';
        palette?: THREE.Color[];
        shouldSparkle?: boolean;
        shapeIndex: number; // 0: Circle, 1: Star, 2: Diamond, 3: Cross
        behavior?: 'simple' | 'spiral' | 'text';
        textPayload?: string;
    }

    const particles: Particle[] = [];
    const gravity = new THREE.Vector3(0, -15, 0); 
    
    // Reusable geometry
    const geometry = new THREE.BufferGeometry();
    const maxParticles = 20000; 
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const shapeIndices = new Float32Array(maxParticles);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('shapeIndex', new THREE.BufferAttribute(shapeIndices, 1));

    // Custom ShaderMaterial with Atlas Support
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: particleTexture }
        },
        vertexShader: `
            attribute float size;
            attribute float shapeIndex;
            varying vec3 vColor;
            varying float vShapeIndex;
            void main() {
                vColor = color;
                vShapeIndex = shapeIndex;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            varying float vShapeIndex;
            void main() {
                vec2 uv = gl_PointCoord;
                // 2x2 Atlas
                float col = mod(vShapeIndex, 2.0);
                float row = floor(vShapeIndex / 2.0);
                
                float u = (uv.x * 0.5) + (col * 0.5);
                float v = (uv.y * 0.5) + (1.0 - (row + 1.0) * 0.5); 
                
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, vec2(u, v));
            }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Helper: Text Points Generation
    const getTextPoints = (text: string): THREE.Vector3[] => {
        const canvas = document.createElement('canvas');
        const size = 512; // Increased resolution for longer text
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [];

        const fontSize = text.length > 10 ? 60 : 100;
        ctx.font = `bold ${fontSize}px Arial`; 
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size/2, size/2);

        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        const points: THREE.Vector3[] = [];

        // Scan pixels
        for (let y = 0; y < size; y += 4) { // Step 4 for performance with larger canvas
            for (let x = 0; x < size; x += 4) {
                const i = (y * size + x) * 4;
                if (data[i] > 128) { 
                    // Map to world space
                    const wx = (x - size/2) * 0.25; // Scale down
                    const wy = -(y - size/2) * 0.25;
                    points.push(new THREE.Vector3(wx, wy, 0));
                }
            }
        }
        return points;
    };

    // Helper: Create Explosion
    const createExplosion = (position: THREE.Vector3, palette: THREE.Color[], type: FireworkType, text?: string) => {
        let count = type === 'ring' ? 600 : (type === 'crossette' ? 300 : (type === 'heart' ? 400 : 1500));
        let textPoints: THREE.Vector3[] = [];
        
        if (type === 'text' && text) {
            textPoints = getTextPoints(text);
            count = textPoints.length;
        }
        
        // Camera shake on explosion
        shakeIntensity.current += 0.5;

        for (let i = 0; i < count; i++) {
            if (particles.length >= maxParticles) break;

            const p = new THREE.Vector3().copy(position);
            const v = new THREE.Vector3();
            
            // Pick color from palette
            const targetColor = palette[Math.floor(Math.random() * palette.length)];
            const secondaryColor = palette[Math.floor(Math.random() * palette.length)];
            
            // Shape selection (mix shapes)
            let shapeIndex = 0; // Default circle
            if (Math.random() < 0.3) shapeIndex = 1; // Star
            else if (Math.random() < 0.1) shapeIndex = 2; // Diamond
            
            let behavior: 'simple' | 'spiral' | 'text' = 'simple';

            // Velocity distribution based on type
            if (type === 'text') {
                 behavior = 'text';
                 const pt = textPoints[i];
                 // Explode outwards to form the text
                 // We want them to reach 'pt' relative to center.
                 // Let's give them velocity proportional to distance
                 v.copy(pt).multiplyScalar(3.0); 
                 // Add some random jitter
                 v.x += (Math.random() - 0.5) * 0.5;
                 v.y += (Math.random() - 0.5) * 0.5;
                 v.z += (Math.random() - 0.5) * 0.5;
            } else if (type === 'sphere' || type === 'dahlia' || type === 'spiral') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const speed = 15 + Math.random() * 10; 
                
                v.x = speed * Math.sin(phi) * Math.cos(theta);
                v.y = speed * Math.sin(phi) * Math.sin(theta);
                v.z = speed * Math.cos(phi);
                
                if (type === 'dahlia') {
                    if (i % 2 === 0) v.multiplyScalar(0.6); 
                }
                if (type === 'spiral') {
                    behavior = 'spiral';
                    v.multiplyScalar(0.8); 
                }
            } else if (type === 'willow' || type === 'kamuro') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const speed = 10 + Math.random() * 10; 
                
                v.x = speed * Math.sin(phi) * Math.cos(theta);
                v.y = speed * Math.sin(phi) * Math.sin(theta);
                v.z = speed * Math.cos(phi);
            } else if (type === 'palm') {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 1) - 1) * 0.5; 
                const speed = 20 + Math.random() * 5;
                
                v.x = speed * Math.sin(phi) * Math.cos(theta);
                v.y = speed * Math.sin(phi) * Math.sin(theta);
                v.z = speed * Math.cos(phi);
            } else if (type === 'ring') {
                const theta = Math.random() * Math.PI * 2;
                const speed = 20; 
                v.x = speed * Math.cos(theta);
                v.y = speed * Math.sin(theta); 
                v.z = (Math.random() - 0.5) * 4; 
            } else if (type === 'crossette') {
                 const angle = (Math.floor(i / (count/4)) * Math.PI / 2) + (Math.random() * 0.2);
                 const speed = 25; 
                 v.x = Math.cos(angle) * speed;
                 v.y = Math.sin(angle) * speed;
                 v.z = (Math.random() - 0.5) * 10;
            } else if (type === 'heart') {
                const t = Math.random() * Math.PI * 2;
                const scale = 1.0 + Math.random() * 0.2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
                v.x = hx * scale;
                v.y = hy * scale;
                v.z = (Math.random() - 0.5) * 5;
                shapeIndex = 3; 
            }

            // Size variation
            let size = (type === 'willow' || type === 'kamuro') ? 0.8 : 1.5;
            if (Math.random() < 0.1) size *= 2.0; 

            particles.push({
                position: p,
                velocity: v,
                color: new THREE.Color(1, 1, 0.8), 
                baseColor: targetColor.clone(),
                secondaryColor: secondaryColor.clone(),
                alpha: 1.0,
                life: 0,
                maxLife: (type === 'willow' || type === 'kamuro') ? 3.5 : 2.0, 
                size: size,
                type: 'spark',
                shouldSparkle: Math.random() < 0.2,
                shapeIndex: shapeIndex,
                behavior: behavior
            });
        }
    };

    const WISHES = ["2026", "Happy New Year", "Sức Khỏe", "Thành Công", "Hạnh Phúc", "An Khang", "Thịnh Vượng"];
    let wishIndex = 0;

    // Helper: Launch Rocket
    const launchRocket = () => {
        const startX = (Math.random() - 0.5) * 150; 
        const targetY = 60 + Math.random() * 40; 
        const startPos = new THREE.Vector3(startX, -40, (Math.random() - 0.5) * 80);
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 8,
            50 + Math.random() * 15, 
            (Math.random() - 0.5) * 8
        );

        // Pick random palette
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        const color = palette[0]; // Use primary color for rocket

        let textPayload: string | undefined;
        // 20% chance for text firework
        if (Math.random() < 0.2) {
             textPayload = WISHES[wishIndex % WISHES.length];
             wishIndex++;
        }

        particles.push({
            position: startPos,
            velocity: velocity,
            color: color.clone(),
            baseColor: color,
            alpha: 1.0,
            life: 0,
            maxLife: 1.5 + Math.random() * 0.5, 
            size: 3.0, 
            type: 'rocket',
            palette: palette,
            shapeIndex: 0, // Rockets are always circles
            textPayload: textPayload
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

        // Camera Shake
        if (shakeIntensity.current > 0) {
            const shake = shakeIntensity.current;
            camera.position.x = baseCameraPos.current.x + (Math.random() - 0.5) * shake;
            camera.position.y = baseCameraPos.current.y + (Math.random() - 0.5) * shake;
            camera.position.z = baseCameraPos.current.z + (Math.random() - 0.5) * shake;
            shakeIntensity.current *= 0.9; // Decay
            if (shakeIntensity.current < 0.1) {
                shakeIntensity.current = 0;
                camera.position.copy(baseCameraPos.current);
            }
        }

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
            
            if (p.behavior === 'spiral') {
                // Add a small tangential force for spiral effect
                const up = new THREE.Vector3(0, 1, 0);
                const tangent = new THREE.Vector3().crossVectors(p.velocity, up).normalize();
                p.velocity.addScaledVector(tangent, 15 * delta);
            }

            // Air resistance (Drag)
            if (p.behavior === 'text') {
                 p.velocity.multiplyScalar(0.9); // High drag for text to keep shape
            } else {
                p.velocity.x *= 0.995; 
                p.velocity.z *= 0.995;
                p.velocity.y *= 0.995; 
            }

            p.position.addScaledVector(p.velocity, delta);

            // Sparkle Effect
            if (p.shouldSparkle) {
                p.size = (Math.sin(time * 20 + i) * 0.5 + 1.0) * (p.type === 'willow' ? 0.8 : 1.5);
            }

            // Color Transition for Sparks
            if (p.type === 'spark') {
                const progress = p.life / p.maxLife;
                
                if (progress < 0.15) {
                    // White -> Base
                    p.color.lerpColors(new THREE.Color(1, 1, 0.8), p.baseColor, progress * 6.6);
                } else if (progress < 0.6) {
                    // Base -> Secondary (Color Shift)
                    if (p.secondaryColor) {
                        const t = (progress - 0.15) / 0.45;
                        p.color.lerpColors(p.baseColor, p.secondaryColor, t);
                    } else {
                        p.color.copy(p.baseColor);
                    }
                } else if (progress > 0.7) {
                    // Fade out
                    p.alpha = 1.0 - ((progress - 0.7) / 0.3);
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
                         type: 'trail',
                         shapeIndex: 0 // Trails are always circles
                     });
                 }
            }

            // Lifecycle
            if (p.type === 'rocket') {
                if (p.velocity.y < 0 || p.life > p.maxLife) {
                    // Explode
                    const types: FireworkType[] = ['sphere', 'willow', 'ring', 'crossette', 'palm', 'dahlia', 'kamuro', 'heart', 'spiral'];
                    const type = p.textPayload ? 'text' : types[Math.floor(Math.random() * types.length)];
                    createExplosion(p.position, p.palette || [p.color], type, p.textPayload);
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

                colors[activeCount * 3] = p.color.r * p.alpha; 
                colors[activeCount * 3 + 1] = p.color.g * p.alpha;
                colors[activeCount * 3 + 2] = p.color.b * p.alpha;

                sizes[activeCount] = p.size;
                shapeIndices[activeCount] = p.shapeIndex;
                activeCount++;
            }
        }

        // Update Geometry
        geometry.setDrawRange(0, activeCount);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
        geometry.attributes.shapeIndex.needsUpdate = true;

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
