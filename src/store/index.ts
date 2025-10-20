// Store configuration
export { store, persistor } from './store';
export type { RootState, AppDispatch } from './store';

// Typed hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Sound slice
export {
  updateNarratorVoiceName,
  updateNarratorVoiceVolume,
  updateMusicName,
  updateMusicVolume,
} from './features/sound/soundSlice';
export type { SoundState } from './features/sound/soundSlice';

// Breathing slice
export {
  updateBreatheExercise,
  updateShowBreatheInstructions,
} from './features/breathing/breathingSlice';
export type { BreathingState, BreatheExercise } from './features/breathing/breathingSlice';

// Mantra slice
export {
  setMantraTheme,
  setMantraVoice,
  setSessionDuration,
  setCurrentLineIndex,
  incrementLoopCount,
  resetMantraSession,
} from './features/mantra/mantraSlice';
export type { MantraState } from './features/mantra/mantraSlice';
