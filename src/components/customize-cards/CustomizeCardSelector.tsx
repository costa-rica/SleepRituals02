import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import CustomizeCardBase from "./CustomizeCardBase";
import { colors, typography } from "../../constants/designTokens";

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
		<CustomizeCardBase title={panelSelectorTitle}>
			<Pressable onPress={handlePress} style={styles.selectionContainer}>
				<Text style={styles.selection}>{panelSelectorSelection}</Text>
			</Pressable>
		</CustomizeCardBase>
	);
};

const styles = StyleSheet.create({
	selectionContainer: {
		paddingVertical: 4,
	},
	selection: {
		fontSize: typography.cardValue.fontSize,
		fontWeight: typography.cardValue.fontWeight,
		color: colors.textPrimary,
	},
});

export default CustomizeCardSelector;
