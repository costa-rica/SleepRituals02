import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SoundState {
  narratorVoiceName: string;
  narratorVoiceVolume: number;
  musicName: string;
  musicVolume: number;
}

const initialState: SoundState = {
  narratorVoiceName: 'Sira',
  narratorVoiceVolume: 50,
  musicName: 'Ocean',
  musicVolume: 50,
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    updateNarratorVoiceName: (state, action: PayloadAction<string>) => {
      state.narratorVoiceName = action.payload;
    },
    updateNarratorVoiceVolume: (state, action: PayloadAction<number>) => {
      state.narratorVoiceVolume = action.payload;
    },
    updateMusicName: (state, action: PayloadAction<string>) => {
      state.musicName = action.payload;
    },
    updateMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = action.payload;
    },
  },
});

export const {
  updateNarratorVoiceName,
  updateNarratorVoiceVolume,
  updateMusicName,
  updateMusicVolume,
} = soundSlice.actions;

export default soundSlice.reducer;
