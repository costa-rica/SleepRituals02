import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Pressable,
	Dimensions,
} from "react-native";
import CustomizeCardSelector from "../customize-cards/CustomizeCardSelector";
import CustomizeCardPlusMinus from "../customize-cards/CustomizeCardPlusMinus";
import { useAppSelector, useAppDispatch, updateCycles } from "../../store";
import { colors, spacing, typography } from "../../constants/designTokens";

interface PanelUpdateRitualProps {
	visible: boolean;
	onClose: () => void;
	selectionName: string;
	handleSelectBreathingExercise: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const PanelUpdateRitual: React.FC<PanelUpdateRitualProps> = ({
	visible,
	onClose,
	selectionName,
	handleSelectBreathingExercise,
}) => {
	const dispatch = useAppDispatch();
	const cycles = useAppSelector((state) => state.breathing.cycles);
	const breatheIn = useAppSelector((state) => state.breathing.breatheIn);
	const holdIn = useAppSelector((state) => state.breathing.holdIn);
	const breatheOut = useAppSelector((state) => state.breathing.breatheOut);
	const holdOut = useAppSelector((state) => state.breathing.holdOut);

	const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
	const [shouldRender, setShouldRender] = React.useState(false);

	useEffect(() => {
		if (visible) {
			setShouldRender(true);
			// Slide up
			Animated.spring(translateY, {
				toValue: 0,
				useNativeDriver: true,
				tension: 50,
				friction: 10,
			}).start();
		} else {
			// Slide down
			Animated.spring(translateY, {
				toValue: SCREEN_HEIGHT,
				useNativeDriver: true,
				tension: 50,
				friction: 10,
			}).start(() => {
				setShouldRender(false);
			});
		}
	}, [visible, translateY]);

	if (!shouldRender) {
		return null;
	}

	const handleSave = () => {
		onClose();
	};

	const handleIncrementCycles = () => {
		dispatch(updateCycles(cycles + 1));
	};

	const handleDecrementCycles = () => {
		dispatch(updateCycles(cycles - 1));
	};

	const formatCyclesValue = (value: number) => {
		// Calculate total duration in seconds
		const secondsPerCycle = breatheIn + holdIn + breatheOut + holdOut;
		const totalSeconds = secondsPerCycle * value;
		const totalMinutes = Math.round(totalSeconds / 60);

		return `${value} cycles (~${totalMinutes}m)`;
	};

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ translateY }],
				},
			]}
		>
			<View style={styles.panel}>
				{/* Title */}
				<Text style={styles.title}>Update Ritual</Text>

				{/* Content area */}
				<View style={styles.content}>
					<CustomizeCardSelector
						panelSelectorTitle="Type"
						panelSelectorSelection={selectionName}
						handlePress={handleSelectBreathingExercise}
					/>
					<CustomizeCardPlusMinus
						panelSelectorTitle="Duration"
						value={cycles}
						onIncrement={handleIncrementCycles}
						onDecrement={handleDecrementCycles}
						formatValue={formatCyclesValue}
						minValue={1}
						maxValue={10}
					/>
				</View>

				{/* Save Button */}
				<Pressable style={styles.saveButton} onPress={handleSave}>
					<Text style={styles.saveButtonText}>Save</Text>
				</Pressable>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
		justifyContent: "flex-end",
	},
	panel: {
		backgroundColor: colors.backgroundPanel,
		borderTopLeftRadius: spacing.panelBorderRadius,
		borderTopRightRadius: spacing.panelBorderRadius,
		paddingTop: spacing.panelPaddingTop,
		paddingHorizontal: spacing.panelPaddingHorizontal,
		paddingBottom: spacing.panelPaddingBottom,
	},
	title: {
		fontSize: typography.panelTitle.fontSize,
		fontWeight: typography.panelTitle.fontWeight,
		color: colors.textPrimary,
		textAlign: "center",
		marginBottom: 32,
	},
	content: {
		marginBottom: 32,
	},
	saveButton: {
		backgroundColor: colors.accentPurple,
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
	},
	saveButtonText: {
		fontSize: typography.buttonText.fontSize,
		fontWeight: typography.buttonText.fontWeight,
		color: colors.textPrimary,
	},
});

export default PanelUpdateRitual;
