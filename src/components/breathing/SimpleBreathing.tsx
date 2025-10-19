import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle as SvgCircle } from 'react-native-svg';

// Breathing phase enum
export enum BreathingPhase {
  BREATHE_IN = 'breatheIn',
  HOLD = 'hold',
  BREATHE_OUT = 'breatheOut',
  HOLD_OUT = 'holdOut',
}

// Props interface for SimpleBreathing component
export interface SimpleBreathingProps {
  isActive?: boolean;
  isPaused?: boolean;
  breatheInDuration?: number;
  holdDuration?: number;
  breatheOutDuration?: number;
  holdOutDuration?: number;
  primaryColor?: string;
  showInstructions?: boolean;
  onCycleComplete?: () => void;
  onPhaseChange?: (phase: BreathingPhase) => void;
}

// Animation constants
const TRANSITION_DURATION = 1200; // Text transition duration in ms
const HOLD_OSCILLATION_DURATION = 800; // Subtle pulse during hold phases

const SimpleBreathing: React.FC<SimpleBreathingProps> = ({
  isActive = false,
  isPaused = false,
  breatheInDuration = 4000,
  holdDuration = 4000,
  breatheOutDuration = 4000,
  holdOutDuration = 4000,
  primaryColor = '#8B7FB8',
  showInstructions = true,
  onCycleComplete,
  onPhaseChange,
}) => {
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>(BreathingPhase.BREATHE_IN);
  const [instructionText, setInstructionText] = useState<string>('Breathe in');
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);

  // Animated values
  const breathingScale = useRef(new Animated.Value(0)).current; // 0 = small, 1 = large
  const textOpacity = useRef(new Animated.Value(0)).current;
  const holdPulse = useRef(new Animated.Value(1)).current;

  const screenWidth = Dimensions.get('window').width;

  // Get phase duration
  const getPhaseDuration = (phase: BreathingPhase): number => {
    switch (phase) {
      case BreathingPhase.BREATHE_IN:
        return breatheInDuration;
      case BreathingPhase.HOLD:
        return holdDuration;
      case BreathingPhase.BREATHE_OUT:
        return breatheOutDuration;
      case BreathingPhase.HOLD_OUT:
        return holdOutDuration;
    }
  };

  // Get instruction text for phase
  const getInstructionText = (phase: BreathingPhase): string => {
    switch (phase) {
      case BreathingPhase.BREATHE_IN:
        return 'Breathe in';
      case BreathingPhase.HOLD:
        return 'Hold';
      case BreathingPhase.BREATHE_OUT:
        return 'Breathe out';
      case BreathingPhase.HOLD_OUT:
        return 'Hold';
    }
  };

  // Get target scale for phase
  const getTargetScale = (phase: BreathingPhase): number => {
    switch (phase) {
      case BreathingPhase.BREATHE_IN:
      case BreathingPhase.HOLD:
        return 1; // Large state
      case BreathingPhase.BREATHE_OUT:
      case BreathingPhase.HOLD_OUT:
        return 0; // Small state
    }
  };

  // Get next phase
  const getNextPhase = (phase: BreathingPhase): BreathingPhase => {
    switch (phase) {
      case BreathingPhase.BREATHE_IN:
        return BreathingPhase.HOLD;
      case BreathingPhase.HOLD:
        return BreathingPhase.BREATHE_OUT;
      case BreathingPhase.BREATHE_OUT:
        return BreathingPhase.HOLD_OUT;
      case BreathingPhase.HOLD_OUT:
        return BreathingPhase.BREATHE_IN;
    }
  };

  // Handle phase change
  const handlePhaseChange = (newPhase: BreathingPhase) => {
    // Notify parent of phase change
    onPhaseChange?.(newPhase);

    // Update instruction text with fade transition
    if (showInstructions) {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: TRANSITION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setInstructionText(getInstructionText(newPhase));
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: TRANSITION_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }

    // Start hold pulse animation if in hold phase
    const isHoldPhase = newPhase === BreathingPhase.HOLD || newPhase === BreathingPhase.HOLD_OUT;
    if (isHoldPhase) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(holdPulse, {
            toValue: 1.02,
            duration: HOLD_OSCILLATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(holdPulse, {
            toValue: 1,
            duration: HOLD_OSCILLATION_DURATION,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      holdPulse.stopAnimation();
      holdPulse.setValue(1);
    }

    // Animate breathing scale after text transition delay
    const dotAnimationDelay = 2000; // Wait for text to be 80% visible
    setTimeout(() => {
      const targetScale = getTargetScale(newPhase);
      const duration = getPhaseDuration(newPhase);

      Animated.timing(breathingScale, {
        toValue: targetScale,
        duration: duration,
        useNativeDriver: true,
      }).start();
    }, dotAnimationDelay);

    // Check for cycle completion
    if (newPhase === BreathingPhase.BREATHE_IN && hasCompletedFirstCycle) {
      onCycleComplete?.();
    }

    // Mark first cycle as shown after first hold phase
    if (newPhase === BreathingPhase.HOLD && !hasCompletedFirstCycle) {
      setHasCompletedFirstCycle(true);
    }
  };

  // Initialize when isActive becomes true
  useEffect(() => {
    if (!isActive) {
      // Reset to small state when not active
      breathingScale.setValue(0);
      textOpacity.setValue(0);
      return;
    }

    // Fade in initial text
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: TRANSITION_DURATION,
      useNativeDriver: true,
    }).start();

    // Start initial breathe in animation
    Animated.timing(breathingScale, {
      toValue: 1,
      duration: breatheInDuration,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  // Phase progression effect
  useEffect(() => {
    if (!isActive || isPaused) return;

    const currentDuration = getPhaseDuration(currentPhase);
    const timer = setTimeout(() => {
      const nextPhase = getNextPhase(currentPhase);
      setCurrentPhase(nextPhase);
      handlePhaseChange(nextPhase);
    }, currentDuration);

    return () => clearTimeout(timer);
  }, [currentPhase, isActive, isPaused]);

  // Calculate current circle size
  const minSize = screenWidth * 0.19125; // 19.125% of screen width (decreased by 15%)
  const maxSize = screenWidth * 0.729; // 72.9% of screen width (decreased by 10% again)

  // Calculate current scale value for gradient logic
  const [currentScaleValue, setCurrentScaleValue] = useState(0);
  useEffect(() => {
    const listenerId = breathingScale.addListener(({ value }) => {
      setCurrentScaleValue(value);
    });
    return () => breathingScale.removeListener(listenerId);
  }, []);

  // Render radial gradient circle
  const renderBreathingCircle = () => {
    const AnimatedSvg = Animated.createAnimatedComponent(Svg);
    // Calculate diameter by interpolating between min and max sizes
    const diameter = minSize + (maxSize - minSize) * currentScaleValue;
    const radius = diameter / 2;

    // Gradient configuration based on scale
    const isSmallState = currentScaleValue < 0.3;

    return (
      <Animated.View
        style={{
          transform: [
            { scale: holdPulse },
          ],
        }}
      >
        <AnimatedSvg height={diameter} width={diameter}>
          <Defs>
            <RadialGradient
              id="breathingGradient"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              {isSmallState ? (
                [
                  <Stop key="start" offset="0%" stopColor={primaryColor} stopOpacity={0.36} />,
                  <Stop key="end" offset="100%" stopColor={primaryColor} stopOpacity={0.6} />,
                ]
              ) : (
                [
                  <Stop key="start" offset="0%" stopColor={primaryColor} stopOpacity={0} />,
                  <Stop key="mid1" offset="50%" stopColor={primaryColor} stopOpacity={0.1} />,
                  <Stop key="mid2" offset="80%" stopColor={primaryColor} stopOpacity={0.35} />,
                  <Stop key="mid3" offset="95%" stopColor={primaryColor} stopOpacity={0.7} />,
                  <Stop key="end" offset="100%" stopColor={primaryColor} stopOpacity={1.0} />,
                ]
              )}
            </RadialGradient>
          </Defs>
          <SvgCircle
            cx={radius}
            cy={radius}
            r={radius}
            fill="url(#breathingGradient)"
          />
        </AnimatedSvg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Breathing circle */}
      <View style={styles.circleContainer}>{renderBreathingCircle()}</View>

      {/* Instruction text */}
      {showInstructions && isActive && (
        <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
          <Text style={styles.instructionText}>{instructionText}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -96,
  },
  textContainer: {
    position: 'absolute',
    bottom: 200,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '200',
    color: 'rgba(255, 255, 255, 0.95)',
  },
});

export default SimpleBreathing;
