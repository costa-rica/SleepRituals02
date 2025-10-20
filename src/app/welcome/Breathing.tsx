import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import { BreathlyExercise } from "../../components/breathly/BreathlyExercise";
import PanelUpdateRitual from "../../components/panels/PanelUpdateRitual";
import PanelPlayerControls from "../../components/panels/PanelPlayerControls";
import ModalSelectBreathingExercise from "../../components/modals/ModalSelectBreathingExercise";
import {
	useAppSelector,
	useAppDispatch,
	updateBreatheExercise,
} from "../../store";
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
	const wasPausedBeforePanelRef = useRef(false);
	const exerciseTitle = useAppSelector(
		(state) => state.breathing.exerciseTitle
	);
	const breatheIn = useAppSelector((state) => state.breathing.breatheIn);
	const holdIn = useAppSelector((state) => state.breathing.holdIn);
	const breatheOut = useAppSelector((state) => state.breathing.breatheOut);
	const holdOut = useAppSelector((state) => state.breathing.holdOut);

	// Pause breathing when panel opens, resume when it closes
	useEffect(() => {
		if (showUpdateRitualPanel) {
			// Panel opening - save current pause state and pause breathing
			wasPausedBeforePanelRef.current = isPaused;
			setIsPaused(true);
		} else {
			// Panel closing - restore previous pause state
			setIsPaused(wasPausedBeforePanelRef.current);
		}
	}, [showUpdateRitualPanel]);

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

	// Reset exercise when breathing pattern changes
	const isFirstRenderRef = useRef(true);
	useEffect(() => {
		// Skip reset on initial mount
		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
			return;
		}

		// When breathing pattern changes, restart the exercise
		setCycleCount(0);
		setHasCompleted(false);
		setShowIntro(true);
		setIsPaused(false);
		setShowControls(false);
		setShowUpdateRitualPanel(false);
		setShowExerciseModal(false);

		// Manually trigger intro animation sequence
		introOpacity.setValue(0);

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
	}, [breatheIn, holdIn, breatheOut, holdOut]);

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
					<PanelPlayerControls
						isPaused={isPaused}
						onTogglePlayPause={togglePause}
						onOpenControls={() => {
							setShowUpdateRitualPanel(true);
						}}
					/>
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
			<PanelUpdateRitual
				visible={showUpdateRitualPanel}
				selectionName={exerciseTitle}
				handleSelectBreathingExercise={handleSelectBreathingExercise}
				onClose={() => {
					setShowUpdateRitualPanel(false);
				}}
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
