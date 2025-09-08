import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Splash({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text>Splash</Text>
			<Text>Classic</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Login")}>
				<Text>Login</Text>
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
