/**
 * Utility functions for Breathly animations
 */
import { Animated, Easing, Dimensions } from 'react-native';
import { useRef, useEffect } from 'react';

export const animate = (
  value: Animated.Value,
  config: {
    toValue: number;
    duration: number;
    easing?: (value: number) => number;
  }
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    ...config,
    easing: config.easing || Easing.bezier(0.37, 0, 0.8, 1), // More pronounced ease-in-out with slower, gentler ending
    useNativeDriver: true,
  });
};

export const interpolateTranslateY = (
  animValue: Animated.Value,
  config: {
    inputRange: number[];
    outputRange: number[];
  }
): { translateY: Animated.AnimatedInterpolation<string | number> } => {
  return {
    translateY: animValue.interpolate(config),
  };
};

export const interpolateScale = (
  animValue: Animated.Value,
  config: {
    inputRange: number[];
    outputRange: number[];
  }
): { scale: Animated.AnimatedInterpolation<string | number> } => {
  return {
    scale: animValue.interpolate(config),
  };
};

/**
 * Create an array of numbers from 0 to n-1
 */
export const times = (n: number): number[] => {
  return Array.from({ length: n }, (_, i) => i);
};

/**
 * Get the shortest dimension of the device screen
 */
export const getShortestDeviceDimension = (): number => {
  const { width, height } = Dimensions.get('window');
  return Math.min(width, height);
};

/**
 * Hook that calls a function when a value updates (like componentDidUpdate)
 */
export const useOnUpdate = <T>(callback: (prevValue: T) => void, value: T) => {
  const prevValueRef = useRef<T>(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (prevValue !== value) {
      callback(prevValue);
    }
    prevValueRef.current = value;
  }, [value, callback]);
};
