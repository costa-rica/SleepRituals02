/**
 * Main Breathly exercise component that combines all breathing animation parts
 */
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { BreathingAnimation } from './breathing-animation';
import { StepDescription } from './step-description';
import { AnimatedDots } from './animated-dots';
import { useExerciseLoop } from './use-exercise-loop';
import { patternPresets, createStepsFromPattern } from './pattern-presets';

interface Props {
  color?: string;
  isPaused?: boolean;
  onCycleComplete?: () => void;
}

export const BreathlyExercise: FC<Props> = ({
  color = '#8B7FB8',
  isPaused = false,
  onCycleComplete
}) => {
  // Get square breathing pattern
  const squarePattern = patternPresets.square;
  const stepsMetadata = createStepsFromPattern(squarePattern);

  // Use the exercise loop hook
  const { currentStep, exerciseAnimVal, textAnimVal } = useExerciseLoop(
    stepsMetadata,
    isPaused,
    onCycleComplete
  );

  return (
    <View style={styles.container}>
      {/* Breathing animation */}
      <BreathingAnimation animationValue={exerciseAnimVal} color={color} />

      {/* Step description text */}
      {currentStep && (
        <View style={styles.descriptionContainer}>
          <StepDescription label={currentStep.label} animationValue={textAnimVal} />
          {currentStep.showDots && (
            <AnimatedDots
              visible={true}
              numberOfDots={Math.floor(currentStep.duration / 1000)}
              totalDuration={currentStep.duration}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -136, // Move animation up 136 pixels
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 200,
    alignItems: 'center',
  },
});
