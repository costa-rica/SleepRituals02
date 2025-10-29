import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

interface CustomizeCardSelectorSliderProps {
	title: string;
	selection: string;
	volume: number;
	onPress: () => void;
	onVolumeChange: (value: number) => void;
}

const CustomizeCardSelectorSlider: React.FC<
	CustomizeCardSelectorSliderProps
> = ({ title, selection, volume, onPress, onVolumeChange }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<Pressable onPress={onPress} style={styles.selectionContainer}>
				<Text style={styles.selection}>{selection}</Text>
				<Ionicons name="chevron-forward" size={24} color="#8B8B8B" />
			</Pressable>
			<Slider
				style={styles.slider}
				minimumValue={0}
				maximumValue={100}
				value={volume}
				onValueChange={onVolumeChange}
				minimumTrackTintColor="#8B7FB8"
				maximumTrackTintColor="#312A43"
				thumbTintColor="#8B7FB8"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#312A43",
		backgroundColor: "#1E182E",
		opacity: 0.5,
		padding: 16,
	},
	title: {
		fontSize: 14,
		fontWeight: "400",
		color: "#8B8B8B",
		marginBottom: 8,
	},
	selectionContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 4,
		marginBottom: 8,
	},
	selection: {
		fontSize: 18,
		fontWeight: "500",
		color: "#FFFFFF",
	},
	slider: {
		width: "100%",
		height: 40,
	},
});

export default CustomizeCardSelectorSlider;
