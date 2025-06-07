import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * A custom React hook that detects if the user has a system preference for reduced motion.
 * @returns {boolean} True if reduced motion is preferred, false otherwise.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    // Set the initial state
    setPrefersReducedMotion(mediaQueryList.matches);

    // Define a listener for changes
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add the listener
    mediaQueryList.addEventListener('change', listener);

    // Clean up the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
