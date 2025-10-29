/**
 * Utility functions for managing breathing exercise audio
 */

/**
 * Maps step IDs from BreathlyExercise to audio file names
 * @param stepId - The step ID from stepsMetadata (inhale, afterInhale, exhale, afterExhale)
 * @returns The corresponding audio filename without extension
 */
export const getAudioFileNameForStep = (stepId: string): string | null => {
	const mapping: Record<string, string> = {
		inhale: "inhale",
		afterInhale: "hold",
		exhale: "exhale",
		afterExhale: "hold",
	};

	return mapping[stepId] || null;
};

/**
 * Gets the audio file path for a given narrator and step
 * @param narrator - The narrator name (e.g., "Carla", "Michael")
 * @param stepId - The step ID from stepsMetadata
 * @returns The require statement for the audio file, or null if not found
 */
export const getBreathingAudioSource = (
	narrator: string,
	stepId: string
): any => {
	const fileName = getAudioFileNameForStep(stepId);

	if (!fileName) {
		return null;
	}

	const narratorLowerCase = narrator.toLowerCase();

	// Map narrator names to their audio files
	const audioMap: Record<string, Record<string, any>> = {
		carla: {
			inhale: require("../assets/audio/breathing/carla/inhale.mp3"),
			hold: require("../assets/audio/breathing/carla/hold.mp3"),
			exhale: require("../assets/audio/breathing/carla/exhale.mp3"),
		},
		michael: {
			inhale: require("../assets/audio/breathing/micheal/inhale.mp3"),
			hold: require("../assets/audio/breathing/micheal/hold.mp3"),
			exhale: require("../assets/audio/breathing/micheal/exhale.mp3"),
		},
		sira: {
			inhale: require("../assets/audio/breathing/sira/inhale.mp3"),
			hold: require("../assets/audio/breathing/sira/hold.mp3"),
			exhale: require("../assets/audio/breathing/sira/exhale.mp3"),
		},
		walter: {
			inhale: require("../assets/audio/breathing/walter/inhale.mp3"),
			hold: require("../assets/audio/breathing/walter/hold.mp3"),
			exhale: require("../assets/audio/breathing/walter/exhale.mp3"),
		},
		frederick: {
			inhale: require("../assets/audio/breathing/frederick/inhale.mp3"),
			hold: require("../assets/audio/breathing/frederick/hold.mp3"),
			exhale: require("../assets/audio/breathing/frederick/exhale.mp3"),
		},
	};

	return audioMap[narratorLowerCase]?.[fileName] || null;
};
