import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	ScrollView,
	SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useAppDispatch } from "../../store";
import { updateMusicName } from "../../store/features/sound/soundSlice";
import { colors, spacing, typography } from "../../constants/designTokens";
import SelectableCard from "../cards/SelectableCard";

interface ModalSelectMusicProps {
	visible: boolean;
	onClose: () => void;
	currentMusic: string;
}

const MUSIC_TRACKS = [
	"No Music",
	"Ocean Waves",
	"Rain Sounds", 
	"Forest Night",
	"White Noise",
	"Calm Piano",
	"Gentle Stream",
];

const ModalSelectMusic: React.FC<ModalSelectMusicProps> = ({
	visible,
	onClose,
	currentMusic,
}) => {
	const dispatch = useAppDispatch();
	const [selectedMusic, setSelectedMusic] = useState(currentMusic);
	const [playingMusic, setPlayingMusic] = useState<string | null>(null);
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	const handleSelect = (music: string) => {
		setSelectedMusic(music);
	};

	const handleConfirm = () => {
		dispatch(updateMusicName(selectedMusic));
		onClose();
	};

	const handlePlayPreview = async (music: string) => {
		try {
			// Stop any currently playing sound
			if (sound) {
				await sound.stopAsync();
				await sound.unloadAsync();
				setSound(null);
				setPlayingMusic(null);
			}

			// If clicking the same music that's playing, just stop
			if (playingMusic === music) {
				return;
			}

			// TODO: Add actual music preview files
			// For now, we'll just simulate the play state
			console.log(`Playing preview for: ${music}`);
			setPlayingMusic(music);

			// Simulate a preview duration (e.g., 5 seconds)
			setTimeout(() => {
				setPlayingMusic(null);
			}, 5000);

			/* When audio files are ready, use this pattern:
			const audioMap: Record<string, any> = {
				"ocean-waves": require("../../assets/audio/music/ocean-waves-preview.mp3"),
				"rain-sounds": require("../../assets/audio/music/rain-sounds-preview.mp3"),
				// ... etc
			};

			const musicKey = music.toLowerCase().replace(/\s+/g, "-");
			const audioSource = audioMap[musicKey];

			if (audioSource) {
				const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
				setSound(newSound);
				setPlayingMusic(music);
				await newSound.playAsync();

				newSound.setOnPlaybackStatusUpdate((status) => {
					if (status.isLoaded && status.didJustFinish) {
						setPlayingMusic(null);
					}
				});
			}
			*/
		} catch (error) {
			console.error("Error playing preview:", error);
			setPlayingMusic(null);
		}
	};

	// Cleanup sound when modal closes
	React.useEffect(() => {
		return () => {
			if (sound) {
				sound.unloadAsync();
			}
		};
	}, [sound]);

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<SafeAreaView style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					{/* Fixed Header */}
					<View style={styles.headerContainer}>
						<Text style={styles.title}>Select your music</Text>
					</View>

					{/* Music Options */}
					<ScrollView 
						style={styles.optionsContainer} 
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						{MUSIC_TRACKS.map((music) => {
							const isSelected = selectedMusic === music;
							const isPlaying = playingMusic === music;

							return (
								<View key={music} style={styles.optionWrapper}>
									<SelectableCard
										isSelected={isSelected}
										onPress={() => handleSelect(music)}
										fixedHeight={88}
									>
										<Text style={styles.musicText}>{music}</Text>
										{isSelected && music !== "No Music" && (
											<Pressable
												style={styles.playButton}
												onPress={() => handlePlayPreview(music)}
											>
												<Ionicons
													name={isPlaying ? "pause" : "play"}
													size={20}
													color={colors.textPrimary}
												/>
											</Pressable>
										)}
									</SelectableCard>
								</View>
							);
						})}
					</ScrollView>

					{/* Fixed Button Area */}
					<View style={styles.buttonContainer}>
						<Pressable style={styles.selectButton} onPress={handleConfirm}>
							<Text style={styles.selectButtonText}>Select</Text>
						</Pressable>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: colors.backgroundDark,
		justifyContent: 'center',
	},
	modalContainer: {
		flex: 1,
	},
	headerContainer: {
		backgroundColor: colors.backgroundDark,
		paddingTop: 40,
		paddingHorizontal: spacing.panelPaddingHorizontal,
		paddingBottom: 16,
		zIndex: 10,
	},
	title: {
		fontSize: typography.panelTitle.fontSize,
		fontWeight: typography.panelTitle.fontWeight,
		color: colors.textPrimary,
		textAlign: "center",
	},
	optionsContainer: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: spacing.panelPaddingHorizontal,
		paddingTop: 16,
		paddingBottom: 24,
	},
	buttonContainer: {
		backgroundColor: colors.backgroundDark,
		paddingHorizontal: spacing.panelPaddingHorizontal,
		paddingTop: 16,
		paddingBottom: 40,
		zIndex: 10,
	},
	optionWrapper: {
		marginBottom: 8,
	},
	musicText: {
		fontSize: 18,
		fontWeight: "500",
		color: colors.textPrimary,
	},
	playButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: colors.textPrimary,
		justifyContent: "center",
		alignItems: "center",
	},
	customVoiceContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	customVoiceText: {
		fontSize: 18,
		fontWeight: "500",
		color: colors.textPrimary,
	},
	lockIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.backgroundDark,
		justifyContent: "center",
		alignItems: "center",
	},
	selectButton: {
		backgroundColor: colors.accentPurple,
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
		width: "100%",
	},
	selectButtonText: {
		fontSize: typography.buttonText.fontSize,
		fontWeight: typography.buttonText.fontWeight,
		color: colors.textPrimary,
	},
});

export default ModalSelectMusic;

