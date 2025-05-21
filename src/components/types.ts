// Common types for Grid Gallery components

export interface GridItem {
  id: string;
  area: string; // CSS grid-area string or named area
  className?: string; // Additional classnames if needed
  animationDelay?: number; // Delay for animation (in seconds)
  animationType?: 'zoom' | 'fade' | 'slide' | 'rotate' | 'none'; // Type of animation
  backgroundColor?: string; // Background color for the grid item
  slideDirection?: 'up' | 'down' | 'left' | 'right'; // Direction for slide animation
}

export type TransitionAnimationState = 'initial' | 'animate' | 'exit';
export type TransitionEffectType = 'fade' | 'slide' | 'zoom' | 'flip';
export type AnimationDirection = 1 | -1; // 1 for forward, -1 for backward

export interface AnimationProperties {
  [key: string]: number | string | boolean | undefined;
}

export interface TransitionAnimations {
  fade: { 
    initial: AnimationProperties;
    animate: AnimationProperties;
    exit: AnimationProperties;
  };
  slide: {
    initial: AnimationProperties;
    animate: AnimationProperties;
    exit: AnimationProperties;
  };
  zoom: {
    initial: AnimationProperties;
    animate: AnimationProperties;
    exit: AnimationProperties;
  };
  flip: {
    initial: AnimationProperties;
    animate: AnimationProperties;
    exit: AnimationProperties;
  };
}
