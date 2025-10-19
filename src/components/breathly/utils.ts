/**
 * Utility functions for Breathly animations
 */
import { Animated, Easing } from 'react-native';

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
    easing: config.easing || Easing.linear,
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
