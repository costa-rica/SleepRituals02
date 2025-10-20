import {
	View,
	Text,
	StyleSheet,
	Animated,
	Pressable,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import { BreathlyExercise } from "../../components/breathly/BreathlyExercise";
import {
	CustomizeAudioIcon,
	PauseButtonIcon,
	PlayButtonIcon,
	ControlsButtonIcon,
} from "../../components/breathing/BreathingIcons";
import SlideUpLayoutUpdateRitual from "../../components/panels/SlideUpLayoutUpdateRitual";
import ModalSelectBreathingExercise from "../../components/modals/ModalSelectBreathingExercise";
import { useAppSelector, useAppDispatch, updateBreatheExercise } from "../../store";
import type { BreatheExercise } from "../../store";
const INTRO_DURATION = 4000; // 4 seconds
const TOTAL_CYCLES = 4;

export default function Breathing({ navigation }: BreathingProps) {
	const isFocused = useIsFocused();
	const dispatch = useAppDispatch();

	const [isActive, setIsActive] = useState(false);
	const [showIntro, setShowIntro] = useState(true);
	const [cycleCount, setCycleCount] = useState(0);
	const [showControls, setShowControls] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [hasCompleted, setHasCompleted] = useState(false);
	const [showUpdateRitualPanel, setShowUpdateRitualPanel] = useState(false);
	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const introOpacity = useRef(new Animated.Value(0)).current;
	const prevIsFocusedRef = useRef(isFocused);
	const exerciseTitle = useAppSelector(
		(state) => state.breathing.exerciseTitle
	);

	// Reset state when screen becomes focused after completion
	useEffect(() => {
		const prevIsFocused = prevIsFocusedRef.current;
		prevIsFocusedRef.current = isFocused;

		// If screen just became focused and exercise was completed, reset everything
		if (!prevIsFocused && isFocused && hasCompleted) {
			setCycleCount(0);
			setHasCompleted(false);
			setShowIntro(true);
			setIsActive(false);
			setIsPaused(false);
			introOpacity.setValue(0);
		}
	}, [isFocused, hasCompleted]);

	// Fade in intro text and start breathing after delay
	useEffect(() => {
		if (!isFocused) return; // Don't start if not focused

		// Fade in intro text
		Animated.timing(introOpacity, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true,
		}).start();

		// Wait 4 seconds then start breathing
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
		}, INTRO_DURATION);

		return () => clearTimeout(timer);
	}, [isFocused, hasCompleted]);

	// Handle cycle completion
	const handleCycleComplete = () => {
		setCycleCount((prevCount) => {
			const newCycleCount = prevCount + 1;

			if (newCycleCount >= TOTAL_CYCLES) {
				setHasCompleted(true);
				// Only navigate to Mantra screen if this screen is currently visible
				if (isFocused) {
					navigation.navigate("Mantra");
				}
			}

			return newCycleCount;
		});
	};

	// Toggle controls visibility
	const toggleControls = () => {
		setShowControls((prev) => !prev);
	};

	// Toggle pause/play
	const togglePause = () => {
		setIsPaused((prev) => !prev);
	};

	const handleSelectBreathingExercise = () => {
		setShowExerciseModal(true);
	};

	const handleExerciseSelect = (exercise: BreatheExercise) => {
		dispatch(updateBreatheExercise(exercise));
	};

	return (
		<ScreenFrame>
			<Pressable style={styles.container} onPress={toggleControls}>
				{/* Breathing animation component */}
				{isActive && !showIntro && !hasCompleted && (
					<BreathlyExercise
						color="#8B7FB8"
						isPaused={isPaused}
						onCycleComplete={handleCycleComplete}
					/>
				)}

				{/* Cycle progress bars */}
				{showControls && (
					<View style={styles.progressContainer}>
						{[...Array(TOTAL_CYCLES)].map((_, index) => (
							<View
								key={index}
								style={[
									styles.progressBar,
									index === cycleCount && styles.progressBarActive,
								]}
							/>
						))}
					</View>
				)}

				{/* Control buttons */}
				{showControls && (
					<View style={styles.controlsContainer}>
						<Pressable
							style={styles.controlButton}
							onPress={(e) => {
								e.stopPropagation();
								// Audio customize action (placeholder)
							}}
						>
							<View style={styles.buttonCircle}>
								<CustomizeAudioIcon width={30} height={30} />
							</View>
						</Pressable>

						<Pressable
							style={styles.controlButtonLarge}
							onPress={(e) => {
								e.stopPropagation();
								togglePause();
							}}
						>
							<View style={styles.buttonCircleLarge}>
								{isPaused ? (
									<PlayButtonIcon width={50} height={58} color="#E5D6F5" />
								) : (
									<PauseButtonIcon width={50} height={58} />
								)}
							</View>
						</Pressable>

						<Pressable
							style={styles.controlButton}
							onPress={(e) => {
								e.stopPropagation();
								setShowUpdateRitualPanel(true);
							}}
						>
							<View style={styles.buttonCircle}>
								<ControlsButtonIcon width={32} height={30} />
							</View>
						</Pressable>
					</View>
				)}

				{/* Intro text */}
				{showIntro && (
					<Animated.View
						style={[styles.introContainer, { opacity: introOpacity }]}
					>
						<Text style={styles.introText}>Let's begin to breathe</Text>
					</Animated.View>
				)}
			</Pressable>

			{/* Update Ritual Panel */}
			<SlideUpLayoutUpdateRitual
				visible={showUpdateRitualPanel}
				selectionName={exerciseTitle}
				handleSelectBreathingExercise={handleSelectBreathingExercise}
				onClose={() => setShowUpdateRitualPanel(false)}
			/>

			{/* Breathing Exercise Selection Modal */}
			<ModalSelectBreathingExercise
				visible={showExerciseModal}
				currentSelection={exerciseTitle}
				onSelect={handleExerciseSelect}
				onClose={() => setShowExerciseModal(false)}
			/>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	progressContainer: {
		position: "absolute",
		top: 32,
		left: 40,
		right: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	progressBar: {
		flex: 1,
		height: 4,
		backgroundColor: "rgba(255, 255, 255, 0.3)",
		borderRadius: 2,
	},
	progressBarActive: {
		backgroundColor: "#FFFFFF",
	},
	controlsContainer: {
		position: "absolute",
		bottom: 48,
		left: 40,
		right: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	controlButton: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	controlButtonLarge: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonCircle: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonCircleLarge: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
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
});
