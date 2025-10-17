import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import type { MantraProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";

export default function Mantra({ navigation }: MantraProps) {
	return (
		<ScreenFrame currentScreen="Mantra">
			<View style={styles.container}>
				<Text style={styles.text}>Mantra</Text>
				<TouchableOpacity onPress={() => navigation.navigate("GoodTimes")}>
					<Text style={styles.buttonText}>Back to Good Times</Text>
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
