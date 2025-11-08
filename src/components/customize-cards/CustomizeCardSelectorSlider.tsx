import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import CustomizeCardBase from "./CustomizeCardBase";
import { colors, typography } from "../../constants/designTokens";

interface CustomizeCardSelectorSliderProps {
	title: string;
	selection: string;
	volume: number;
	onPress: () => void;
	onVolumeChange: (value: number) => void;
	disabled?: boolean;
	spacing?: 'compact' | 'default';
}

const CustomizeCardSelectorSlider: React.FC<
	CustomizeCardSelectorSliderProps
> = ({ title, selection, volume, onPress, onVolumeChange, disabled = false, spacing = 'default' }) => {
	return (
		<CustomizeCardBase title={title} spacing={spacing}>
			<Pressable onPress={onPress} style={styles.selectionContainer}>
				<Text style={[styles.selection, disabled && styles.selectionDisabled]}>{selection}</Text>
				<Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
			</Pressable>
			<Slider
				style={[styles.slider, disabled && styles.sliderDisabled]}
				minimumValue={0}
				maximumValue={100}
				value={volume}
				onValueChange={onVolumeChange}
				minimumTrackTintColor={disabled ? colors.cardBorderDisabled : colors.accentPurple}
				maximumTrackTintColor={colors.cardBorderDisabled}
				thumbTintColor={disabled ? colors.cardBorderDisabled : colors.accentPurple}
				disabled={disabled}
			/>
		</CustomizeCardBase>
	);
};

const styles = StyleSheet.create({
	selectionContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 4,
		marginBottom: 8,
	},
	selection: {
		fontSize: typography.cardValue.fontSize,
		fontWeight: typography.cardValue.fontWeight,
		color: colors.textPrimary,
	},
	selectionDisabled: {
		opacity: 0.5,
	},
	slider: {
		width: "100%",
		height: 40,
	},
	sliderDisabled: {
		opacity: 0.5,
	},
});

export default CustomizeCardSelectorSlider;
