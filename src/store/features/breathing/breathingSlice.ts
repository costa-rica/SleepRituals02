import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BreatheExercise {
	exerciseTitle: string;
	exerciseDescription: string;
	breatheIn: number;
	holdIn: number;
	breatheOut: number;
	holdOut: number;
}

export interface BreathingState {
	exerciseTitle: string;
	exerciseDescription: string;
	breatheIn: number;
	holdIn: number;
	breatheOut: number;
	holdOut: number;
	showInstructions: boolean;
}

const initialState: BreathingState = {
	exerciseTitle: "Box 4-4-4-4",
	exerciseDescription:
		"Inhale, hold, exhale, and hold for four counts each to calm your body and mind.",
	breatheIn: 4,
	holdIn: 4,
	breatheOut: 4,
	holdOut: 4,
	showInstructions: true,
};

const breathingSlice = createSlice({
	name: "breathing",
	initialState,
	reducers: {
		updateBreatheExercise: (state, action: PayloadAction<BreatheExercise>) => {
			state.exerciseTitle = action.payload.exerciseTitle;
			state.exerciseDescription = action.payload.exerciseDescription;
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

export const { updateBreatheExercise, updateShowBreatheInstructions } =
	breathingSlice.actions;

export default breathingSlice.reducer;
