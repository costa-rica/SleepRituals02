import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import type { MantraProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import { ThreeLineStack } from "../../components/mantra/ThreeLineStack";
import { useMantraAudio } from "../../components/mantra/useMantraAudio";
import PanelPlayerControls from "../../components/panels/PanelPlayerControls";
import PanelAdjustAudio from "../../components/panels/PanelAdjustAudio";
import { ProgressTabs } from "../../components/ProgressTabs";
import { useBackgroundMusic } from "../../hooks/useBackgroundMusic";
import { useAppSelector } from "../../store";

const INTRO_DURATION = 4000; // 4 seconds

export default function Mantra({ navigation }: MantraProps) {
	const isFocused = useIsFocused();

	const [isActive, setIsActive] = useState(false);
	const [showIntro, setShowIntro] = useState(true);
	const [showControls, setShowControls] = useState(false);
	const [showCompletion, setShowCompletion] = useState(false);
	const [showAdjustAudioPanel, setShowAdjustAudioPanel] = useState(false);
	const [sessionLoopCount, setSessionLoopCount] = useState(0); // Track loops in current session
	const introOpacity = useRef(new Animated.Value(0)).current;
	const prevIsFocusedRef = useRef(isFocused);
	const wasPlayingBeforePanelRef = useRef(false);
	const prevLoopCountRef = useRef(0); // Track previous loop count to detect increments

	// Redux state
	const loopCount = useAppSelector((state) => state.mantra.loopCount);
	const sessionDurationMs = useAppSelector((state) => state.mantra.sessionDurationMs);

	// Audio hook
	const {
		isLoading,
		error,
		isPlaying,
		activeLine,
		mantraData,
		play,
		pause,
		seekToLine,
		cleanup,
	} = useMantraAudio();

	// Session timer to track when to show completion
	const sessionStartTime = useRef<number | null>(null);
	const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Background music with crossfade looping
	useBackgroundMusic({
		isRitualActive: isActive && !showIntro && !showCompletion,
		isFocused,
		isPaused: !isPlaying,
	});

	// Pause mantra when audio panel opens, resume when it closes
	useEffect(() => {
		if (showAdjustAudioPanel) {
			// Panel opening - save current playing state and pause
			wasPlayingBeforePanelRef.current = isPlaying;
			if (isPlaying) {
				pause();
			}
		} else {
			// Panel closing - restore previous playing state
			if (wasPlayingBeforePanelRef.current) {
				play();
			}
		}
	}, [showAdjustAudioPanel, isPlaying, pause, play]);

	// Track loop count changes and update session count
	useEffect(() => {
		if (loopCount > prevLoopCountRef.current) {
			// Loop count increased, increment session count
			setSessionLoopCount((prev) => prev + 1);
		}
		prevLoopCountRef.current = loopCount;
	}, [loopCount]);

	// Handle screen focus/blur: pause when leaving, reset if completed
	useEffect(() => {
		const prevIsFocused = prevIsFocusedRef.current;
		prevIsFocusedRef.current = isFocused;

		// Screen just gained focus
		if (!prevIsFocused && isFocused) {
			// If session was completed, reset everything
			if (showCompletion) {
				setShowCompletion(false);
				setShowIntro(true);
				setIsActive(false);
				setSessionLoopCount(0);
				introOpacity.setValue(0);
			}
			// Otherwise, audio state is preserved by the audio hook
		}

		// Screen just lost focus (user navigated away)
		if (prevIsFocused && !isFocused) {
			// If session is in progress (not completed), pause audio
			if (isActive && !showCompletion && isPlaying) {
				pause();
			}
		}
	}, [isFocused, showCompletion, isActive, isPlaying, pause]);

	// Fade in intro text and start mantra after delay
	useEffect(() => {
		if (!isFocused) return; // Don't start if not focused

		// Fade in intro text
		Animated.timing(introOpacity, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true,
		}).start();

		// Wait 4 seconds then start mantra
		const timer = setTimeout(() => {
			// Fade out intro text
			Animated.timing(introOpacity, {
				toValue: 0,
				duration: 1000,
				useNativeDriver: true,
			}).start(() => {
				setShowIntro(false);
			});
			setIsActive(true);
			setSessionLoopCount(0); // Reset session loop count when starting
		}, INTRO_DURATION);

		return () => clearTimeout(timer);
	}, [isFocused, showCompletion]);

	// Start audio playback when active
	useEffect(() => {
		if (isActive && !isLoading && !error) {
			play();
			sessionStartTime.current = Date.now();

			// Set timer to check for session completion
			sessionTimerRef.current = setInterval(() => {
				if (sessionStartTime.current) {
					const elapsed = Date.now() - sessionStartTime.current;
					if (elapsed >= sessionDurationMs) {
						// Session complete - check if we're mid-line
						// For now, just show completion (we can refine this later to wait for line end)
						pause();
						setShowCompletion(true);
						if (sessionTimerRef.current) {
							clearInterval(sessionTimerRef.current);
							sessionTimerRef.current = null;
						}
					}
				}
			}, 1000); // Check every second
		}

		return () => {
			if (sessionTimerRef.current) {
				clearInterval(sessionTimerRef.current);
				sessionTimerRef.current = null;
			}
		};
	}, [isActive, isLoading, error]);

	// Cleanup audio on unmount
	useEffect(() => {
		return () => {
			cleanup();
		};
	}, []);

	// Toggle controls visibility
	const toggleControls = () => {
		setShowControls((prev) => !prev);
	};

	// Toggle pause/play
	const togglePause = () => {
		if (isPlaying) {
			pause();
		} else {
			play();
		}
	};

	// Navigate to previous line
	const handleTapPrevious = () => {
		if (!mantraData || !activeLine) return;
		const prevIndex = Math.max(0, activeLine.index - 1);
		seekToLine(prevIndex);
	};

	// Navigate to next line
	const handleTapNext = () => {
		if (!mantraData || !activeLine) return;
		const nextIndex = Math.min(mantraData.lines.length - 1, activeLine.index + 1);
		seekToLine(nextIndex);
	};

	// Get previous, current, and next lines for ThreeLineStack
	const getPreviousLine = () => {
		if (!mantraData || !activeLine || activeLine.index === 0) return null;
		return mantraData.lines[activeLine.index - 1];
	};

	const getNextLine = () => {
		if (!mantraData || !activeLine) return null;
		if (activeLine.index === mantraData.lines.length - 1) return null;
		return mantraData.lines[activeLine.index + 1];
	};

	// Error state
	if (error) {
		return (
			<ScreenFrame>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			</ScreenFrame>
		);
	}

	// Loading state
	if (isLoading) {
		return (
			<ScreenFrame>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>Loading mantra...</Text>
				</View>
			</ScreenFrame>
		);
	}

	return (
		<ScreenFrame>
			<Pressable
				style={styles.container}
				onPress={toggleControls}
			>
				{/* Three-line text stack */}
				{isActive && !showIntro && !showCompletion && activeLine && (
					<View style={styles.textContainer}>
						<ThreeLineStack
							previousLine={getPreviousLine()}
							currentLine={activeLine.line}
							nextLine={getNextLine()}
							onTapPrevious={handleTapPrevious}
							onTapNext={handleTapNext}
						/>
					</View>
				)}

				{/* Loop progress tabs */}
				{showControls && <ProgressTabs total={10} current={sessionLoopCount} />}

				{/* Control buttons */}
				{showControls && (
					<PanelPlayerControls
						isPaused={!isPlaying}
						onCustomizeAudio={() => {
							setShowAdjustAudioPanel(true);
						}}
						onTogglePlayPause={togglePause}
						onOpenControls={() => {
							// Future: open settings panel
						}}
					/>
				)}

				{/* Intro text */}
				{showIntro && (
					<Animated.View
						style={[styles.introContainer, { opacity: introOpacity }]}
					>
						<Text style={styles.introText}>Let's begin your mantra</Text>
					</Animated.View>
				)}

				{/* Completion overlay - will be replaced with MantraCompletionOverlay component */}
				{showCompletion && (
					<View style={styles.completionContainer}>
						<Text style={styles.completionText}>Session Complete</Text>
						<Pressable
							onPress={() => {
								navigation.navigate("GoodTimes");
							}}
							style={styles.completionButton}
						>
							<Text style={styles.completionButtonText}>Restart Ritual</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								// Future: Navigate to Home screen
								console.log("Close - navigate to Home");
							}}
							style={styles.completionButton}
						>
							<Text style={styles.completionButtonText}>Close</Text>
						</Pressable>
					</View>
				)}
			</Pressable>

			{/* Adjust Audio Panel */}
			<PanelAdjustAudio
				visible={showAdjustAudioPanel}
				onClose={() => {
					setShowAdjustAudioPanel(false);
				}}
			/>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	introContainer: {
		position: "absolute",
		bottom: 200,
		left: 40,
		right: 40,
		alignItems: "center",
	},
	introText: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "300",
		textAlign: "center",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		color: "#FFFFFF",
		fontSize: 18,
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 40,
	},
	errorText: {
		color: "#FF6B6B",
		fontSize: 16,
		textAlign: "center",
	},
	completionContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
	},
	completionText: {
		color: "#FFFFFF",
		fontSize: 24,
		fontWeight: "400",
		marginBottom: 20,
	},
	completionButton: {
		paddingHorizontal: 32,
		paddingVertical: 12,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 8,
	},
	completionButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "400",
	},
});
