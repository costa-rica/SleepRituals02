import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import type { GoodTimesProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";

export default function GoodTimes({ navigation }: GoodTimesProps) {
	return (
		<ScreenFrame currentScreen="GoodTimes">
			<View style={styles.container}>
				<Text>GoodTimes</Text>
				<TouchableOpacity onPress={() => navigation.navigate("Splash")}>
					<Text>Splash</Text>
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
});
