import { useEffect, useRef } from 'react';
import { MusicManager } from '../utils/musicManager';
import { useAppSelector } from '../store';

interface UseBackgroundMusicOptions {
	isRitualActive: boolean; // True when ritual is running (not intro, not completed)
	isFocused: boolean; // True when screen is focused
	isPaused: boolean; // True when ritual is paused
}

/**
 * Hook to manage background music playback during rituals
 * Handles automatic fade in/out, crossfade looping, and volume control
 */
export const useBackgroundMusic = ({ isRitualActive, isFocused, isPaused }: UseBackgroundMusicOptions) => {
	const musicManagerRef = useRef<MusicManager | null>(null);
	const isMusicPlayingRef = useRef(false);
	const musicName = useAppSelector((state) => state.sound.musicName);
	const musicVolume = useAppSelector((state) => state.sound.musicVolume);

	// Initialize music manager
	useEffect(() => {
		musicManagerRef.current = new MusicManager();

		return () => {
			if (musicManagerRef.current) {
				musicManagerRef.current.cleanup();
				musicManagerRef.current = null;
			}
		};
	}, []);

	// Start/stop music based on ritual state and track selection
	useEffect(() => {
		const musicManager = musicManagerRef.current;
		if (!musicManager) return;

		const handleMusicState = async () => {
			const shouldPlay = isRitualActive && isFocused && musicName !== "No Music";

			if (shouldPlay && !isMusicPlayingRef.current) {
				// Start music for the first time
				await musicManager.start(musicName, musicVolume / 100);
				isMusicPlayingRef.current = true;
			} else if (!shouldPlay && isMusicPlayingRef.current) {
				// Stop music
				await musicManager.fadeOutAndStop();
				isMusicPlayingRef.current = false;
			}
		};

		handleMusicState();

		// Cleanup: Stop music when unmounting or when ritual/focus/track changes
		return () => {
			if (isMusicPlayingRef.current) {
				musicManager.fadeOutAndStop();
				isMusicPlayingRef.current = false;
			}
		};
	}, [isRitualActive, isFocused, musicName]); // ✅ Volume changes handled separately

	// Update volume when slider changes (without interrupting playback)
	useEffect(() => {
		const musicManager = musicManagerRef.current;
		if (!musicManager || !isMusicPlayingRef.current) return;

		// Convert volume from 0-100 to 0-1
		musicManager.setVolume(musicVolume / 100);
	}, [musicVolume]);

	// Handle pause/resume with fade
	useEffect(() => {
		const musicManager = musicManagerRef.current;
		if (!musicManager || !isMusicPlayingRef.current) return;

		if (isPaused) {
			// Pause with 2-second fade out
			musicManager.pause();
		} else {
			// Resume with 2-second fade in
			musicManager.resume();
		}
	}, [isPaused]);

	return {
		// Could expose manual controls if needed in the future
		// For now, everything is automatic
	};
};

