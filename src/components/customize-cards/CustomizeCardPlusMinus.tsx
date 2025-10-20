import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

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
		<View style={styles.container}>
			<Text style={styles.title}>{panelSelectorTitle}</Text>
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
	contentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 4,
	},
	value: {
		fontSize: 18,
		fontWeight: "500",
		color: "#FFFFFF",
		flex: 1,
	},
	buttonGroup: {
		flexDirection: "row",
		gap: 12,
	},
	button: {
		width: 48,
		height: 48,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#312A43",
		backgroundColor: "#1E182E",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.3,
	},
	buttonText: {
		fontSize: 24,
		fontWeight: "400",
		color: "#FFFFFF",
	},
	buttonTextDisabled: {
		opacity: 0.3,
	},
});

export default CustomizeCardPlusMinus;
