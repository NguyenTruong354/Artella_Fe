// Performance configuration for ExploreMore components
export const PERFORMANCE_CONFIG = {
  // Particle counts (reduced for 8 NFTs)
  particles: {
    floating: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 15 : 10,
    energyOrbs: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 4 : 2,
    cosmicDust: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 10 : 6,
    stars: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 25 : 15,
  },
  
  // Animation settings
  animations: {
    reducedMotion: false,
    enableComplexEffects: true,
    particleDelay: 2000, // ms to delay particle rendering
  },
  
  // Quality settings
  quality: {
    imageSize: '200x200', // Smaller images for better performance
    blurIntensity: 'sm', // Reduced blur effects
    shadowIntensity: 'light', // Lighter shadows
  },
  
  // Performance thresholds
  thresholds: {
    lowEndCPU: 4, // cores
    slowConnection: '2g',
  }
};

// Auto-detect performance mode
export const detectPerformanceMode = (): boolean => {
  // Check hardware concurrency (CPU cores)
  const isLowEndCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < PERFORMANCE_CONFIG.thresholds.lowEndCPU;
  
  // Check connection speed if available
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && connection.effectiveType?.includes(PERFORMANCE_CONFIG.thresholds.slowConnection);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return isLowEndCPU || isSlowConnection || prefersReducedMotion;
};

// Get optimized particle count based on performance mode
export const getParticleCount = (type: keyof typeof PERFORMANCE_CONFIG.particles, performanceMode: boolean): number => {
  const baseCount = PERFORMANCE_CONFIG.particles[type];
  return performanceMode ? Math.ceil(baseCount * 0.4) : baseCount; // 60% reduction in performance mode
};
