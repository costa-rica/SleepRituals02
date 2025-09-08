import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import type { LoginScreenProps } from "../../types/navigation";

export default function Login({ navigation }: LoginScreenProps) {
	return (
		<View style={styles.container}>
			<Text>Login</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Splash")}>
				<Text>Splash</Text>
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "green",
		justifyContent: "center",
		alignItems: "center",
	},
});
