import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Pressable,
	Dimensions,
} from "react-native";
import PanelSelector from "./PanelSelector";
import { useAppSelector } from "../../store";

interface SlideUpLayoutUpdateRitualProps {
	visible: boolean;
	onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SlideUpLayoutUpdateRitual: React.FC<SlideUpLayoutUpdateRitualProps> = ({
	visible,
	onClose,
}) => {
	const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
	const [shouldRender, setShouldRender] = React.useState(false);
	const exerciseTitle = useAppSelector(
		(state) => state.breathing.exerciseTitle
	);

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
					<PanelSelector
						panelSelectorTitle="Type"
						panelSelectorSelection={exerciseTitle}
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
		backgroundColor: "#0F1015",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 32,
		paddingHorizontal: 24,
		paddingBottom: 48,
	},
	title: {
		fontSize: 24,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 32,
	},
	content: {
		marginBottom: 32,
	},
	saveButton: {
		backgroundColor: "#8B7FB8",
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
	},
	saveButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

export default SlideUpLayoutUpdateRitual;
