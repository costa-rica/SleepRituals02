/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Adapted from: https://github.com/mmazzarolo/breathly-app
 * Original author: Matteo Mazzarolo
 */

import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { animate } from "./utils";
import { StepMetadata } from "./types";

// Since loops using the native driver cannot contain Animated.sequence
// we create a custom function that goes trough them
export const loopAnimations = (
  createAnimations: () => Animated.CompositeAnimation[],
  onStepStart: (stepIndex: number) => void
) => {
  let animations = createAnimations();
  let currentAnimationIndex = 0;
  const animateStep = () => {
    animations[currentAnimationIndex].start(({ finished }) => {
      if (!finished) return;
      currentAnimationIndex++;
      if (currentAnimationIndex >= animations.length) {
        currentAnimationIndex = 0;
        animations = createAnimations();
      }
      onStepStart(currentAnimationIndex);
      animateStep();
    });
  };
  onStepStart(currentAnimationIndex);
  animateStep();
  const stopLoop = () => {
    animations.forEach((animation) => animation.stop());
  };
  return stopLoop;
};

const textAnimDuration = 400;

export const useExerciseLoop = (
  stepsMetadata: [StepMetadata, StepMetadata, StepMetadata, StepMetadata],
  isPaused: boolean = false,
  onCycleComplete?: () => void
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const textAnimVal = useRef(new Animated.Value(0)).current;
  const exerciseAnimVal = useRef(new Animated.Value(0)).current;
  const cleanupRef = useRef<(() => void) | null>(null);
  const isInitialStepRef = useRef(true); // Track if this is the first call to step 0
  const activeSteps = stepsMetadata.filter((step) => !step.skipped);
  const currentStep: StepMetadata | undefined = activeSteps[currentStepIndex];

  const animateStep = (toValue: number, duration: number) => {
    return Animated.stagger(duration - textAnimDuration, [
      Animated.parallel([
        animate(exerciseAnimVal, {
          toValue: toValue,
          duration: duration,
        }),
        animate(textAnimVal, {
          toValue: 1,
          duration: textAnimDuration,
        }),
      ]),
      animate(textAnimVal, {
        toValue: 0,
        duration: textAnimDuration,
      }),
    ]);
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);

    // Check if we completed a full cycle (back to step 0)
    if (stepIndex === 0 && onCycleComplete) {
      if (isInitialStepRef.current) {
        // This is the first call after mount/resume, don't trigger callback
        isInitialStepRef.current = false;
      } else {
        // This is a real cycle completion
        onCycleComplete();
      }
    }
  };

  useEffect(() => {
    if (isPaused) {
      // Stop animations when paused
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }

    // Mark as initial step when starting/resuming
    isInitialStepRef.current = true;

    // Start or resume animations when not paused
    const createStepAnimations = () =>
      activeSteps.map((x) =>
        animateStep(x.id === "inhale" || x.id === "afterInhale" ? 1 : 0, x.duration)
      );

    const cleanupExerciseLoop = loopAnimations(createStepAnimations, handleStepChange);
    cleanupRef.current = cleanupExerciseLoop;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isPaused]);

  return { currentStep, exerciseAnimVal, textAnimVal };
};
