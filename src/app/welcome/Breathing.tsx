import { View, Text, StyleSheet, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import SimpleBreathing from "../../components/breathing/SimpleBreathing";

const INTRO_DURATION = 4000; // 4 seconds
const TOTAL_CYCLES = 4;

export default function Breathing({ navigation }: BreathingProps) {
	const [isActive, setIsActive] = useState(false);
	const [showIntro, setShowIntro] = useState(true);
	const [cycleCount, setCycleCount] = useState(0);
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

	return (
		<ScreenFrame currentScreen="Breathing">
			<View style={styles.container}>
				{/* Breathing animation component */}
				<SimpleBreathing
					isActive={isActive}
					onCycleComplete={handleCycleComplete}
				/>

				{/* Intro text */}
				{showIntro && (
					<Animated.View
						style={[styles.introContainer, { opacity: introOpacity }]}
					>
						<Text style={styles.introText}>Let's begin to breathe</Text>
					</Animated.View>
				)}
			</View>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
