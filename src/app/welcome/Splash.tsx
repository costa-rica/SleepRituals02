import React from "react";
import type { SplashScreenProps } from "../../types/navigation";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Splash({ navigation }: SplashScreenProps) {
	return (
		<View style={styles.container}>
			<Text>Splash</Text>
			<TouchableOpacity onPress={() => navigation.navigate("GoodTimes")}>
				<Text>GoodTimes</Text>
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		justifyContent: "center",
		alignItems: "center",
	},
});
