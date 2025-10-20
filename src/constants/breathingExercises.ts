import type { BreatheExercise } from '../store';

export const BREATHING_EXERCISES: Record<string, BreatheExercise> = {
  'Box 4-4-4-4': {
    exerciseTitle: 'Box 4-4-4-4',
    exerciseDescription: 'Inhale, hold, exhale, and hold for four counts each to calm your body and mind.',
    breatheIn: 4,
    holdIn: 4,
    breatheOut: 4,
    holdOut: 4,
  },
  '4-7-8': {
    exerciseTitle: '4-7-8',
    exerciseDescription: 'Breathe in for four, hold for seven, and exhale for eight to ease tension and invite rest.',
    breatheIn: 4,
    holdIn: 7,
    breatheOut: 8,
    holdOut: 0,
  },
  'Equal Breathing (5-5)': {
    exerciseTitle: 'Equal Breathing (5-5)',
    exerciseDescription: 'Match the length of your inhale and exhale to create a steady, balanced rhythm.',
    breatheIn: 5,
    holdIn: 0,
    breatheOut: 5,
    holdOut: 0,
  },
  'Extended Exhale (4-6)': {
    exerciseTitle: 'Extended Exhale (4-6)',
    exerciseDescription: 'Inhale softly for four and exhale for six to settle your thoughts and relax your body.',
    breatheIn: 4,
    holdIn: 0,
    breatheOut: 6,
    holdOut: 0,
  },
};

// Helper to get exercises as an array
export const BREATHING_EXERCISES_ARRAY = Object.values(BREATHING_EXERCISES);
