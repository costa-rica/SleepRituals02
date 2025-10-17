import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";
import SimpleBreathing from "../../components/breathing/SimpleBreathing";
import { ENVIRONMENT } from "@env";

export default function Breathing({ navigation }: BreathingProps) {
	const [isActive, setIsActive] = useState(false);
	const isDevelopment = ENVIRONMENT === "development";

	const handleBegin = () => {
		setIsActive(true);
	};

	const handleCustomize = () => {
		// Placeholder for customize functionality
		console.log("Customize button pressed");
	};

	const handleMantra = () => {
		// Development only: stop animation and navigate to Mantra
		setIsActive(false);
		navigation.navigate("Mantra");
	};

	return (
		<ScreenFrame currentScreen="Breathing">
			<View style={styles.container}>
				{/* Breathing animation component */}
				<SimpleBreathing isActive={isActive} />

				{/* Bottom section with buttons - only show when not active */}
				{!isActive && (
					<View style={styles.bottomSection}>
						<Text style={styles.infoText}>Box (4-4-4-4) • 4 Cycles</Text>

						<TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
							<Text style={styles.beginButtonText}>Begin</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.customizeButton} onPress={handleCustomize}>
							<Text style={styles.customizeButtonText}>Customize</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Development-only Mantra button - show during animation */}
				{isDevelopment && isActive && (
					<View style={styles.devButtonContainer}>
						<TouchableOpacity style={styles.mantraButton} onPress={handleMantra}>
							<Text style={styles.mantraButtonText}>Mantra</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</ScreenFrame>
	);
}

const screenHeight = Dimensions.get('window').height;
const bottomSectionHeight = screenHeight * 0.2;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bottomSection: {
		height: bottomSectionHeight,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingHorizontal: 40,
		paddingBottom: 40,
	},
	infoText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "400",
		marginBottom: 24,
	},
	beginButton: {
		width: "100%",
		backgroundColor: "#7B6BA8",
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
		marginBottom: 16,
	},
	beginButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "500",
	},
	customizeButton: {
		width: "100%",
		backgroundColor: "transparent",
		paddingVertical: 18,
		borderRadius: 28,
		borderWidth: 1,
		borderColor: "#FFFFFF",
		alignItems: "center",
	},
	customizeButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "400",
	},
	devButtonContainer: {
		position: "absolute",
		bottom: 40,
		left: 40,
		right: 40,
	},
	mantraButton: {
		width: "100%",
		backgroundColor: "#7B6BA8",
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
	},
	mantraButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "500",
	},
});
