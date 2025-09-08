import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

// const Splash = () => {
export default function Login({ navigation }: any) {
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
