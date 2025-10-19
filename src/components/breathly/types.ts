/**
 * Breathing pattern and step type definitions
 */

export interface StepMetadata {
  id: string;
  label: string;
  duration: number;
  showDots: boolean;
  skipped: boolean;
}

export interface PatternPreset {
  id: string;
  name: string;
  description: string;
  durations: [number, number, number, number]; // inhale, hold, exhale, hold
}
