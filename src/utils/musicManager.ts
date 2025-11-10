import { Audio } from 'expo-av';

const CROSSFADE_DURATION_MS = 6000; // 6 seconds
const RITUAL_FADE_IN_MS = 2000; // 2 seconds fade in at ritual start
const RITUAL_FADE_OUT_MS = 4000; // 4 seconds fade out at ritual end

/**
 * Maps music track names to their audio files
 */
export const getMusicSource = (trackName: string): any => {
	const musicMap: Record<string, any> = {
		"Ocean Waves": require("../assets/audio/music/ocean-waves.mp3"),
		// Add more tracks here as you add them
		// "Rain Sounds": require("../assets/audio/music/rain-sounds.mp3"),
		// "Forest Night": require("../assets/audio/music/forest-night.mp3"),
	};

	return musicMap[trackName] || null;
};

/**
 * Music Manager Class
 * Handles background music playback with seamless crossfade looping
 */
const PAUSE_FADE_OUT_MS = 1500; // 1.5 seconds fade out when pausing
const PAUSE_FADE_IN_MS = 2000; // 2 seconds fade in when resuming

export class MusicManager {
	private currentSound: Audio.Sound | null = null;
	private nextSound: Audio.Sound | null = null;
	private updateInterval: ReturnType<typeof setInterval> | null = null;
	private trackDurationMs: number = 0;
	private crossfadeStartMs: number = 0;
	private isLooping: boolean = false;
	private targetVolume: number = 1.0;
	private currentTrackName: string | null = null;
	private isFadingOut: boolean = false;
	private isPaused: boolean = false;

	/**
	 * Load and start playing a music track with fade in
	 */
	async start(trackName: string, volume: number = 1.0): Promise<void> {
		if (trackName === "No Music") {
			return;
		}

		// If already playing this track, just update volume
		if (this.currentTrackName === trackName && this.currentSound) {
			await this.setVolume(volume);
			return;
		}

		// Clean up any existing playback before starting new track
		await this.cleanup();

		this.targetVolume = volume;
		this.currentTrackName = trackName;

		try {
			// Configure audio session to allow mixing with narrator voice
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true,
				staysActiveInBackground: true,
				shouldDuckAndroid: false,
				interruptionModeIOS: 1, // INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS
				interruptionModeAndroid: 1, // INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
			});

			// Get audio source
			const audioSource = getMusicSource(trackName);
			if (!audioSource) {
				console.warn(`Music track not found: ${trackName}`);
				return;
			}

			// Load and create sound
			const { sound } = await Audio.Sound.createAsync(audioSource, {
				volume: 0, // Start at 0 for fade in
				isLooping: false,
			});

			this.currentSound = sound;

			// Get track duration
			const status = await sound.getStatusAsync();
			if (status.isLoaded) {
				this.trackDurationMs = status.durationMillis || 0;
				this.crossfadeStartMs = this.trackDurationMs - CROSSFADE_DURATION_MS;
			}

			// Start playback
			await sound.playAsync();

			// Fade in over 2 seconds
			await this.fadeIn(sound, this.targetVolume, RITUAL_FADE_IN_MS);

			// Start monitoring for crossfade point
			this.isLooping = true;
			this.startCrossfadeMonitoring();
		} catch (error) {
			console.error('Error starting music:', error);
		}
	}

	/**
	 * Monitor playback position and trigger crossfade when needed
	 */
	private startCrossfadeMonitoring(): void {
		if (this.updateInterval) {
			clearInterval(this.updateInterval);
		}

		this.updateInterval = setInterval(async () => {
			if (!this.currentSound || !this.isLooping || this.isFadingOut) {
				return;
			}

			try {
				const status = await this.currentSound.getStatusAsync();
				if (status.isLoaded && status.isPlaying) {
					const currentPositionMs = status.positionMillis;

					// Check if we've reached the crossfade point
					if (currentPositionMs >= this.crossfadeStartMs && !this.nextSound) {
						await this.startCrossfade();
					}
				}
			} catch (error) {
				console.error('Error monitoring playback:', error);
			}
		}, 100); // Check every 100ms for precision
	}

	/**
	 * Start the crossfade between current and next track
	 */
	private async startCrossfade(): Promise<void> {
		// Don't start crossfade if we're paused, fading out, or not looping
		if (!this.currentSound || !this.currentTrackName || !this.isLooping || this.isFadingOut || this.isPaused) {
			return;
		}

		try {
			// Double-check sound is still loaded
			const status = await this.currentSound.getStatusAsync();
			if (!status.isLoaded) {
				return;
			}

			// Load the same track again for looping
			const audioSource = getMusicSource(this.currentTrackName);
			if (!audioSource) return;

			// Check again if we should still be crossfading
			if (!this.isLooping || this.isFadingOut) {
				return;
			}

			const { sound: nextSound } = await Audio.Sound.createAsync(audioSource, {
				volume: 0, // Start at 0 for fade in
				isLooping: false,
			});

			// Final check before storing
			if (!this.isLooping || this.isFadingOut) {
				await nextSound.unloadAsync();
				return;
			}

			this.nextSound = nextSound;

			// Start playing the next track
			await nextSound.playAsync();

			// Perform crossfade over 6 seconds
			await this.performCrossfade(this.currentSound, nextSound, CROSSFADE_DURATION_MS);

			// Swap sounds: next becomes current
			const oldSound = this.currentSound;
			this.currentSound = nextSound;
			this.nextSound = null;

			// Unload old sound
			await oldSound.unloadAsync();

			// Continue monitoring with new current sound
			// (monitoring is already running in the interval)
		} catch (error) {
			console.error('Error during crossfade:', error);
		}
	}

	/**
	 * Perform equal power crossfade between two sounds
	 */
	private async performCrossfade(
		fadeOutSound: Audio.Sound,
		fadeInSound: Audio.Sound,
		durationMs: number
	): Promise<void> {
		const steps = 60; // 60 steps for smooth crossfade
		const stepDurationMs = durationMs / steps;

		for (let i = 0; i <= steps; i++) {
			const progress = i / steps; // 0 to 1

			// Equal power crossfade curves
			const fadeOutVolume = Math.cos(progress * Math.PI / 2) * this.targetVolume;
			const fadeInVolume = Math.sin(progress * Math.PI / 2) * this.targetVolume;

			// Set volumes
			await Promise.all([
				fadeOutSound.setVolumeAsync(fadeOutVolume),
				fadeInSound.setVolumeAsync(fadeInVolume),
			]);

			// Wait before next step
			if (i < steps) {
				await new Promise(resolve => setTimeout(resolve, stepDurationMs));
			}
		}
	}

	/**
	 * Fade in a sound over specified duration
	 */
	private async fadeIn(sound: Audio.Sound, targetVolume: number, durationMs: number): Promise<void> {
		const steps = 40;
		const stepDurationMs = durationMs / steps;

		for (let i = 0; i <= steps; i++) {
			const volume = (i / steps) * targetVolume;
			await sound.setVolumeAsync(volume);
			
			if (i < steps) {
				await new Promise(resolve => setTimeout(resolve, stepDurationMs));
			}
		}
	}

	/**
	 * Fade out and stop music (slower fade for ritual end)
	 */
	async fadeOutAndStop(durationMs: number = RITUAL_FADE_OUT_MS): Promise<void> {
		// Stop monitoring immediately to prevent new crossfades
		this.isLooping = false;
		this.isFadingOut = true;

		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}

		const sounds = [this.currentSound, this.nextSound].filter(s => s !== null) as Audio.Sound[];

		if (sounds.length === 0) {
			this.isFadingOut = false;
			return;
		}

		try {
			// Fade out all playing sounds
			const steps = 40;
			const stepDurationMs = durationMs / steps;

			for (let i = steps; i >= 0; i--) {
				const volume = (i / steps) * this.targetVolume;
				await Promise.all(sounds.map(s => s.setVolumeAsync(volume).catch(() => {})));
				
				if (i > 0) {
					await new Promise(resolve => setTimeout(resolve, stepDurationMs));
				}
			}

			// Stop and unload
			await Promise.all(sounds.map(s => s.stopAsync().catch(() => {})));
			await Promise.all(sounds.map(s => s.unloadAsync().catch(() => {})));
		} catch (error) {
			console.error('Error fading out music:', error);
		}

		this.currentSound = null;
		this.nextSound = null;
		this.currentTrackName = null;
		this.isFadingOut = false;
	}

	/**
	 * Update volume without interrupting playback
	 */
	async setVolume(volume: number): Promise<void> {
		this.targetVolume = volume;

		// Don't update volume if paused (it's at 0)
		if (this.isPaused) return;

		try {
			if (this.currentSound) {
				await this.currentSound.setVolumeAsync(volume);
			}
			if (this.nextSound) {
				await this.nextSound.setVolumeAsync(volume);
			}
		} catch (error) {
			console.error('Error setting music volume:', error);
		}
	}

	/**
	 * Pause music with 2-second fade out
	 */
	async pause(): Promise<void> {
		if (this.isPaused || !this.currentSound) return;

		this.isPaused = true;
		this.isLooping = false; // Stop crossfade monitoring

		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}

		try {
			const sounds = [this.currentSound, this.nextSound].filter(s => s !== null) as Audio.Sound[];

			// Fade out over 1.5 seconds
			const steps = 40;
			const stepDurationMs = PAUSE_FADE_OUT_MS / steps;

			for (let i = steps; i >= 0; i--) {
				const volume = (i / steps) * this.targetVolume;
				await Promise.all(sounds.map(s => s.setVolumeAsync(volume).catch(() => {})));
				
				if (i > 0) {
					await new Promise(resolve => setTimeout(resolve, stepDurationMs));
				}
			}

			// Pause playback (keep position)
			await Promise.all(sounds.map(s => s.pauseAsync().catch(() => {})));
		} catch (error) {
			console.error('Error pausing music:', error);
		}
	}

	/**
	 * Resume music with 2-second fade in
	 */
	async resume(): Promise<void> {
		if (!this.isPaused || !this.currentSound) return;

		this.isPaused = false;

		try {
			const sounds = [this.currentSound, this.nextSound].filter(s => s !== null) as Audio.Sound[];

			// Resume playback from paused position
			await Promise.all(sounds.map(s => s.playAsync().catch(() => {})));

			// Fade in over 2 seconds
			const steps = 40;
			const stepDurationMs = PAUSE_FADE_IN_MS / steps;

			for (let i = 0; i <= steps; i++) {
				const volume = (i / steps) * this.targetVolume;
				await Promise.all(sounds.map(s => s.setVolumeAsync(volume).catch(() => {})));
				
				if (i < steps) {
					await new Promise(resolve => setTimeout(resolve, stepDurationMs));
				}
			}

			// Resume crossfade monitoring
			this.isLooping = true;
			this.startCrossfadeMonitoring();
		} catch (error) {
			console.error('Error resuming music:', error);
		}
	}

	/**
	 * Clean up all resources immediately without fade
	 */
	async cleanup(): Promise<void> {
		this.isLooping = false;
		this.isFadingOut = false;

		if (this.updateInterval) {
			clearInterval(this.updateInterval);
			this.updateInterval = null;
		}

		try {
			const sounds = [this.currentSound, this.nextSound].filter(s => s !== null) as Audio.Sound[];
			
			await Promise.all(sounds.map(async (sound) => {
				try {
					await sound.stopAsync();
					await sound.unloadAsync();
				} catch (err) {
					// Ignore errors during cleanup
				}
			}));

			this.currentSound = null;
			this.nextSound = null;
			this.currentTrackName = null;
		} catch (error) {
			console.error('Error cleaning up music:', error);
		}
	}
}

