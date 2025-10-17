import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import type { BreathingProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";

export default function Breathing({ navigation }: BreathingProps) {
	return (
		<ScreenFrame currentScreen="Breathing">
			<View style={styles.container}>
				<Text style={styles.text}>Breathing</Text>
				<TouchableOpacity onPress={() => navigation.navigate("Mantra")}>
					<Text style={styles.buttonText}>Go to Mantra</Text>
				</TouchableOpacity>
			</View>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "#FFFFFF",
		fontSize: 18,
		marginBottom: 20,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 16,
	},
});
