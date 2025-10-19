import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BreathePatternTimes {
  breatheIn: number;
  holdIn: number;
  breatheOut: number;
  holdOut: number;
}

export interface BreathingState {
  breatheIn: number;
  holdIn: number;
  breatheOut: number;
  holdOut: number;
  showInstructions: boolean;
}

const initialState: BreathingState = {
  breatheIn: 4,
  holdIn: 7,
  breatheOut: 8,
  holdOut: 0,
  showInstructions: true,
};

const breathingSlice = createSlice({
  name: 'breathing',
  initialState,
  reducers: {
    updateBreathePatternTimes: (state, action: PayloadAction<BreathePatternTimes>) => {
      state.breatheIn = action.payload.breatheIn;
      state.holdIn = action.payload.holdIn;
      state.breatheOut = action.payload.breatheOut;
      state.holdOut = action.payload.holdOut;
    },
    updateShowBreatheInstructions: (state, action: PayloadAction<boolean>) => {
      state.showInstructions = action.payload;
    },
  },
});

export const {
  updateBreathePatternTimes,
  updateShowBreatheInstructions,
} = breathingSlice.actions;

export default breathingSlice.reducer;
