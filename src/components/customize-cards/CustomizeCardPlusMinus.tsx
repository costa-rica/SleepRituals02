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
}

const CustomizeCardPlusMinus: React.FC<CustomizeCardPlusMinusProps> = ({
	panelSelectorTitle,
	value,
	onIncrement,
	onDecrement,
	formatValue,
	minValue,
	maxValue,
}) => {
	const isAtMin = minValue !== undefined && value <= minValue;
	const isAtMax = maxValue !== undefined && value >= maxValue;

	return (
		<CustomizeCardBase title={panelSelectorTitle}>
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
		paddingVertical: 4,
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
		width: spacing.buttonSize,
		height: spacing.buttonSize,
		borderRadius: spacing.buttonBorderRadius,
		borderWidth: 1,
		borderColor: colors.cardBorder,
		backgroundColor: colors.cardBackground,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.3,
	},
	buttonText: {
		fontSize: typography.buttonIcon.fontSize,
		fontWeight: typography.buttonIcon.fontWeight,
		color: colors.textPrimary,
	},
	buttonTextDisabled: {
		opacity: 0.3,
	},
});

export default CustomizeCardPlusMinus;
