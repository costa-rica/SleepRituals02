import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import CustomizeCardBase from "./CustomizeCardBase";
import { colors, spacing, typography } from "../../constants/designTokens";

interface CustomizeCardPlusMinusProps {
	panelSelectorTitle: string;
	value: number;
	onIncrement: () => void;
	onDecrement: () => void;
	formatValue?: (value: number) => string;
	minValue?: number;
	maxValue?: number;
	spacing?: 'compact' | 'default';
}

const CustomizeCardPlusMinus: React.FC<CustomizeCardPlusMinusProps> = ({
	panelSelectorTitle,
	value,
	onIncrement,
	onDecrement,
	formatValue,
	minValue,
	maxValue,
	spacing = 'default',
}) => {
	const isAtMin = minValue !== undefined && value <= minValue;
	const isAtMax = maxValue !== undefined && value >= maxValue;

	return (
		<CustomizeCardBase title={panelSelectorTitle} spacing={spacing}>
			<View style={styles.contentRow}>
				<Text style={styles.value}>
					{formatValue ? formatValue(value) : value}
				</Text>
				<View style={styles.buttonGroup}>
					<Pressable
						onPress={onDecrement}
						style={[styles.button, isAtMin && styles.buttonDisabled]}
						disabled={isAtMin}
					>
						<Text style={[styles.buttonText, isAtMin && styles.buttonTextDisabled]}>
							−
						</Text>
					</Pressable>
					<Pressable
						onPress={onIncrement}
						style={[styles.button, isAtMax && styles.buttonDisabled]}
						disabled={isAtMax}
					>
						<Text style={[styles.buttonText, isAtMax && styles.buttonTextDisabled]}>
							+
						</Text>
					</Pressable>
				</View>
			</View>
		</CustomizeCardBase>
	);
};

const styles = StyleSheet.create({
	contentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	value: {
		fontSize: typography.cardValue.fontSize,
		fontWeight: typography.cardValue.fontWeight,
		color: colors.textPrimary,
		flex: 1,
	},
	buttonGroup: {
		flexDirection: "row",
		gap: spacing.buttonGap,
	},
	button: {
		width: 40,
		height: 40,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.cardBorder,
		backgroundColor: colors.cardBackground,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: -4, // Negative margin allows larger touch target without affecting card height
	},
	buttonDisabled: {
		opacity: 0.3,
	},
	buttonText: {
		fontSize: typography.buttonIcon.fontSize,
		fontWeight: typography.buttonIcon.fontWeight,
		color: colors.textPrimary,
		lineHeight: 24, // Explicit line height to control vertical centering
	},
	buttonTextDisabled: {
		opacity: 0.3,
	},
});

export default CustomizeCardPlusMinus;
