/**
 * Breathing pattern presets
 */
import { PatternPreset, StepMetadata } from './types';

export const patternPresets: Record<string, PatternPreset> = {
  square: {
    id: 'square',
    name: 'Square Breathing',
    description: 'Equal timing for all phases. Can help you slow down your breathing and reduce stress.',
    durations: [4000, 4000, 4000, 4000], // 4s inhale, 4s hold, 4s exhale, 4s hold
  },
};

/**
 * Convert a pattern preset into step metadata array
 */
export const createStepsFromPattern = (
  pattern: PatternPreset
): [StepMetadata, StepMetadata, StepMetadata, StepMetadata] => {
  const [inhale, hold, exhale, holdOut] = pattern.durations;

  return [
    {
      id: 'inhale',
      label: 'Breathe in',
      duration: inhale,
      showDots: true,
      skipped: false,
    },
    {
      id: 'afterInhale',
      label: 'Hold',
      duration: hold,
      showDots: true,
      skipped: false,
    },
    {
      id: 'exhale',
      label: 'Breathe out',
      duration: exhale,
      showDots: true,
      skipped: false,
    },
    {
      id: 'afterExhale',
      label: 'Hold',
      duration: holdOut,
      showDots: false,
      skipped: false,
    },
  ];
};
