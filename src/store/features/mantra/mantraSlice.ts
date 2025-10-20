import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MantraState {
  theme: string;          // e.g., "calm"
  voice: string;          // e.g., "sira"
  sessionDurationMs: number; // Duration in milliseconds
  currentLineIndex: number;  // Current active line index
  loopCount: number;         // Number of times mantra has looped
}

const initialState: MantraState = {
  theme: 'calm',
  voice: 'sira',
  sessionDurationMs: 30 * 60 * 1000, // Default 30 minutes
  currentLineIndex: 0,
  loopCount: 0,
};

const mantraSlice = createSlice({
  name: 'mantra',
  initialState,
  reducers: {
    setMantraTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    setMantraVoice: (state, action: PayloadAction<string>) => {
      state.voice = action.payload;
    },
    setSessionDuration: (state, action: PayloadAction<number>) => {
      state.sessionDurationMs = action.payload;
    },
    setCurrentLineIndex: (state, action: PayloadAction<number>) => {
      state.currentLineIndex = action.payload;
    },
    incrementLoopCount: (state) => {
      state.loopCount += 1;
    },
    resetMantraSession: (state) => {
      state.currentLineIndex = 0;
      state.loopCount = 0;
    },
  },
});

export const {
  setMantraTheme,
  setMantraVoice,
  setSessionDuration,
  setCurrentLineIndex,
  incrementLoopCount,
  resetMantraSession,
} = mantraSlice.actions;

export default mantraSlice.reducer;
