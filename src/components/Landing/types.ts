export type TransitionEffectType = 'fade' | 'slide' | 'zoom' | 'flip';
export type AnimationDirection = 1 | -1;

export interface GridItem {
  id: string;
  area: string;
  className?: string;
  animationDelay?: number;
  animationType?: 'zoom' | 'fade' | 'slide' | 'rotate' | 'none';
  backgroundColor?: string;
  slideDirection?: 'up' | 'down' | 'left' | 'right';
}

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