import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import SimpleBreathing from "../../components/breathing/SimpleBreathing";
import {
	CustomizeAudioIcon,
	PauseButtonIcon,
	ControlsButtonIcon,
} from "../../components/breathing/BreathingIcons";

const INTRO_DURATION = 4000; // 4 seconds
const TOTAL_CYCLES = 4;

export default function Breathing({ navigation }: BreathingProps) {
	const [isActive, setIsActive] = useState(false);
	const [showIntro, setShowIntro] = useState(true);
	const [cycleCount, setCycleCount] = useState(0);
	const [showControls, setShowControls] = useState(false);
	const introOpacity = useRef(new Animated.Value(0)).current;

	// Fade in intro text and start breathing after delay
	useEffect(() => {
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
	}, []);

	// Handle cycle completion
	const handleCycleComplete = () => {
		const newCycleCount = cycleCount + 1;
		setCycleCount(newCycleCount);

		if (newCycleCount >= TOTAL_CYCLES) {
			// Navigate to Mantra screen after 4 cycles
			navigation.navigate("Mantra");
		}
	};

	// Toggle controls visibility
	const toggleControls = () => {
		setShowControls((prev) => !prev);
	};

	return (
		<ScreenFrame currentScreen="Breathing">
			<Pressable style={styles.container} onPress={toggleControls}>
				{/* Breathing animation component */}
				<SimpleBreathing
					isActive={isActive}
					onCycleComplete={handleCycleComplete}
				/>

				{/* Cycle progress bars */}
				{showControls && (
					<View style={styles.progressContainer}>
						{[...Array(TOTAL_CYCLES)].map((_, index) => (
							<View
								key={index}
								style={[
									styles.progressBar,
									index < cycleCount && styles.progressBarActive,
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
							<CustomizeAudioIcon width={30} height={30} />
						</Pressable>

						<Pressable
							style={styles.controlButton}
							onPress={(e) => {
								e.stopPropagation();
								// Pause action (placeholder)
							}}
						>
							<PauseButtonIcon width={40} height={46} />
						</Pressable>

						<Pressable
							style={styles.controlButton}
							onPress={(e) => {
								e.stopPropagation();
								// Controls action (placeholder)
							}}
						>
							<ControlsButtonIcon width={32} height={30} />
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
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	progressContainer: {
		position: "absolute",
		top: 80,
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
		bottom: 200,
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
	introContainer: {
		position: "absolute",
		bottom: 120,
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
