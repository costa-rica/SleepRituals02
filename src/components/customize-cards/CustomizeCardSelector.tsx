import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

interface CustomizeCardSelectorProps {
	panelSelectorTitle: string;
	panelSelectorSelection: string;
	handlePress: () => void;
}

const CustomizeCardSelector: React.FC<CustomizeCardSelectorProps> = ({
	panelSelectorTitle,
	panelSelectorSelection,
	handlePress,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{panelSelectorTitle}</Text>
			<Pressable onPress={handlePress} style={styles.selectionContainer}>
				<Text style={styles.selection}>{panelSelectorSelection}</Text>
			</Pressable>
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
		paddingVertical: 4,
	},
	selection: {
		fontSize: 18,
		fontWeight: "500",
		color: "#FFFFFF",
	},
});

export default CustomizeCardSelector;
