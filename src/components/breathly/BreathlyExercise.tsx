/**
 * Main Breathly exercise component that combines all breathing animation parts
 */
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { BreathingAnimation } from './breathing-animation';
import { StepDescription } from './step-description';
import { AnimatedDots } from './animated-dots';
import { useExerciseLoop } from './use-exercise-loop';
import { StepMetadata } from './types';
import { useAppSelector } from '../../store';

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
  // Get breathing pattern from Redux state
  const breatheIn = useAppSelector((state) => state.breathing.breatheIn);
  const holdIn = useAppSelector((state) => state.breathing.holdIn);
  const breatheOut = useAppSelector((state) => state.breathing.breatheOut);
  const holdOut = useAppSelector((state) => state.breathing.holdOut);

  // Create step metadata from Redux values (convert seconds to milliseconds)
  const stepsMetadata: [StepMetadata, StepMetadata, StepMetadata, StepMetadata] = [
    {
      id: 'inhale',
      label: 'Breathe in',
      duration: breatheIn * 1000,
      showDots: false,
      skipped: breatheIn === 0,
    },
    {
      id: 'afterInhale',
      label: 'Hold',
      duration: holdIn * 1000,
      showDots: true,
      skipped: holdIn === 0,
    },
    {
      id: 'exhale',
      label: 'Breathe out',
      duration: breatheOut * 1000,
      showDots: false,
      skipped: breatheOut === 0,
    },
    {
      id: 'afterExhale',
      label: 'Hold',
      duration: holdOut * 1000,
      showDots: true,
      skipped: holdOut === 0,
    },
  ];

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
              isPaused={isPaused}
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
