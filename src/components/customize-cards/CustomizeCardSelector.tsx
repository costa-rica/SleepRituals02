import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomizeCardBase from "./CustomizeCardBase";
import { colors, typography } from "../../constants/designTokens";

interface CustomizeCardSelectorProps {
	panelSelectorTitle: string;
	panelSelectorSelection: string;
	handlePress: () => void;
	spacing?: 'compact' | 'default';
}

const CustomizeCardSelector: React.FC<CustomizeCardSelectorProps> = ({
	panelSelectorTitle,
	panelSelectorSelection,
	handlePress,
	spacing = 'default',
}) => {
	return (
		<CustomizeCardBase title={panelSelectorTitle} spacing={spacing}>
			<Pressable onPress={handlePress} style={styles.selectionContainer}>
				<Text style={styles.selection}>{panelSelectorSelection}</Text>
			</Pressable>
			<Ionicons 
				name="chevron-forward" 
				size={24} 
				color={colors.textSecondary}
				style={styles.chevron}
			/>
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
	chevron: {
		position: "absolute",
		right: 16, // Matches card padding from designTokens
		top: "50%",
		marginTop: 4, // Slight adjustment to account for title at top
	},
});

export default CustomizeCardSelector;
