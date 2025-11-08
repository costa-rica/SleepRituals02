import React from "react";
import { View, StyleSheet, Pressable, ViewStyle } from "react-native";
import { colors, spacing } from "../../constants/designTokens";

interface SelectableCardProps {
	isSelected: boolean;
	onPress: () => void;
	children: React.ReactNode;
	fixedHeight?: number; // Optional fixed height for cards with varying content
	disabled?: boolean;
	style?: ViewStyle;
}

/**
 * Reusable selectable card component for all selection UIs.
 * Provides consistent styling and behavior across narrator, breathing exercise,
 * and future selection modals (mantra audio, settings, etc.)
 * 
 * Key features:
 * - Consistent border pattern (borderWidth: 2 always, color changes on selection)
 * - No layout shift when selecting/deselecting
 * - Optional fixed height for cards with dynamic content (e.g., play buttons)
 * - Flexible children for custom content
 */
const SelectableCard: React.FC<SelectableCardProps> = ({
	isSelected,
	onPress,
	children,
	fixedHeight,
	disabled = false,
	style,
}) => {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
				styles.card,
				fixedHeight ? { height: fixedHeight } : undefined,
				isSelected && styles.cardSelected,
				disabled && styles.cardDisabled,
				pressed && !disabled && styles.cardPressed,
				style,
			]}
		>
			{children}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: colors.cardBorder,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	cardSelected: {
		backgroundColor: colors.cardBackgroundLifted,
		borderColor: colors.accentPurple,
	},
	cardDisabled: {
		opacity: 0.5,
	},
	cardPressed: {
		opacity: 0.8,
	},
});

export default SelectableCard;

