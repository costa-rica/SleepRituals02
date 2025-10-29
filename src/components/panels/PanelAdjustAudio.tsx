import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Pressable,
	Dimensions,
	Alert,
} from "react-native";
import CustomizeCardSelectorSlider from "../customize-cards/CustomizeCardSelectorSlider";
import {
	useAppSelector,
	useAppDispatch,
	updateNarratorVoiceVolume,
	updateMusicVolume,
} from "../../store";

interface PanelAdjustAudioProps {
	visible: boolean;
	onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const PanelAdjustAudio: React.FC<PanelAdjustAudioProps> = ({
	visible,
	onClose,
}) => {
	const dispatch = useAppDispatch();
	const narratorVoiceName = useAppSelector(
		(state) => state.sound.narratorVoiceName
	);
	const narratorVoiceVolume = useAppSelector(
		(state) => state.sound.narratorVoiceVolume
	);
	const musicName = useAppSelector((state) => state.sound.musicName);
	const musicVolume = useAppSelector((state) => state.sound.musicVolume);

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

	const handleVoicePress = () => {
		Alert.alert(
			"Voice Selection",
			"Modal to select narrator voice will appear here"
		);
	};

	const handleMusicPress = () => {
		Alert.alert(
			"Music Selection",
			"Modal to select music track will appear here"
		);
	};

	const handleVoiceVolumeChange = (value: number) => {
		dispatch(updateNarratorVoiceVolume(Math.round(value)));
	};

	const handleMusicVolumeChange = (value: number) => {
		dispatch(updateMusicVolume(Math.round(value)));
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
				<Text style={styles.title}>Adjust Audio</Text>

				{/* Content area */}
				<View style={styles.content}>
					<CustomizeCardSelectorSlider
						title="Voice"
						selection={narratorVoiceName}
						volume={narratorVoiceVolume}
						onPress={handleVoicePress}
						onVolumeChange={handleVoiceVolumeChange}
					/>
					<CustomizeCardSelectorSlider
						title="Music"
						selection={musicName}
						volume={musicVolume}
						onPress={handleMusicPress}
						onVolumeChange={handleMusicVolumeChange}
					/>
				</View>

				{/* Close Button */}
				<Pressable style={styles.closeButton} onPress={onClose}>
					<Text style={styles.closeButtonText}>Close</Text>
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
	closeButton: {
		backgroundColor: "#8B7FB8",
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
	},
	closeButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

export default PanelAdjustAudio;
