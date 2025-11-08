/**
 * Main Breathly exercise component that combines all breathing animation parts
 */
import React, { FC, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { BreathingAnimation } from './breathing-animation';
import { StepDescription } from './step-description';
import { AnimatedDots } from './animated-dots';
import { useExerciseLoop } from './use-exercise-loop';
import { StepMetadata } from './types';
import { useAppSelector } from '../../store';
import { getBreathingAudioSource } from '../../utils/breathingAudio';

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

  // Get narrator voice and volume from Redux state
  const narratorVoiceName = useAppSelector((state) => state.sound.narratorVoiceName);
  const narratorVoiceVolume = useAppSelector((state) => state.sound.narratorVoiceVolume);

  // Reference to current sound object
  const soundRef = useRef<Audio.Sound | null>(null);

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

  // Play audio when step changes
  useEffect(() => {
    let isCancelled = false; // Track if effect was cleaned up

    const playStepAudio = async () => {
      // Don't play audio if paused or no current step
      if (isPaused || !currentStep) {
        return;
      }

      // Don't play audio for steps with duration 0
      if (currentStep.duration === 0) {
        return;
      }

      try {
        // Unload any previous sound
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Check if effect was cancelled while we were unloading
        if (isCancelled) return;

        // Get the audio source for this step and narrator
        const audioSource = getBreathingAudioSource(narratorVoiceName, currentStep.id);

        if (!audioSource) {
          console.warn(`No audio found for narrator: ${narratorVoiceName}, step: ${currentStep.id}`);
          return;
        }

        // Create and play the sound
        const { sound } = await Audio.Sound.createAsync(audioSource);
        
        // Check again if effect was cancelled during sound creation
        if (isCancelled) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;

        // Set volume (convert 0-100 to 0-1)
        await sound.setVolumeAsync(narratorVoiceVolume / 100);

        // Play the sound
        await sound.playAsync();
      } catch (error) {
        console.error('Error playing breathing audio:', error);
      }
    };

    playStepAudio();

    // Cleanup function to unload sound when component unmounts or dependencies change
    return () => {
      isCancelled = true; // Mark as cancelled
      if (soundRef.current) {
        soundRef.current.stopAsync().then(() => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        }).catch(err => console.error('Error stopping audio:', err));
      }
    };
  }, [currentStep?.id, isPaused, narratorVoiceName, narratorVoiceVolume]);

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
