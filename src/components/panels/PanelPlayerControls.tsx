import { View, StyleSheet, Pressable, Alert } from "react-native";
import React from "react";
import {
	CustomizeAudioIcon,
	PauseButtonIcon,
	PlayButtonIcon,
	ControlsButtonIcon,
} from "../breathing/BreathingIcons";

interface PanelPlayerControlsProps {
	isPaused: boolean;
	onCustomizeAudio?: () => void;
	onTogglePlayPause?: () => void;
	onOpenControls?: () => void;
}

export default function PanelPlayerControls({
	isPaused,
	onCustomizeAudio = () =>
		Alert.alert(
			"Not Set Up",
			"The CustomizeAudioIcon button function has not been set up yet"
		),
	onTogglePlayPause = () =>
		Alert.alert(
			"Not Set Up",
			"The TogglePlayPause button function has not been set up yet"
		),
	onOpenControls = () =>
		Alert.alert(
			"Not Set Up",
			"The ControlsButtonIcon button function has not been set up yet"
		),
}: PanelPlayerControlsProps) {
	return (
		<View style={styles.controlsContainer}>
			{/* Left button - Customize Audio */}
			<Pressable
				style={styles.controlButton}
				onPress={(e) => {
					e.stopPropagation();
					onCustomizeAudio();
				}}
			>
				<View style={styles.buttonCircle}>
					<CustomizeAudioIcon width={30} height={30} />
				</View>
			</Pressable>

			{/* Center button - Play/Pause */}
			<Pressable
				style={styles.controlButtonLarge}
				onPress={(e) => {
					e.stopPropagation();
					onTogglePlayPause();
				}}
			>
				<View style={styles.buttonCircleLarge}>
					{isPaused ? (
						<PlayButtonIcon width={50} height={58} color="#E5D6F5" />
					) : (
						<PauseButtonIcon width={50} height={58} />
					)}
				</View>
			</Pressable>

			{/* Right button - Controls */}
			<Pressable
				style={styles.controlButton}
				onPress={(e) => {
					e.stopPropagation();
					onOpenControls();
				}}
			>
				<View style={styles.buttonCircle}>
					<ControlsButtonIcon width={32} height={30} />
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	controlsContainer: {
		position: "absolute",
		bottom: 48,
		left: 40,
		right: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	controlButton: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	controlButtonLarge: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonCircle: {
		width: 60,
		height: 60,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonCircleLarge: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
});
