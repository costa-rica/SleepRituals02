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
  updateBreathePatternTimes,
  updateShowBreatheInstructions,
} from './features/breathing/breathingSlice';
export type { BreathingState, BreathePatternTimes } from './features/breathing/breathingSlice';
