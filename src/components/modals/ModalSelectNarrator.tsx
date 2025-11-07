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
import { updateNarratorVoiceName } from "../../store/features/sound/soundSlice";
import { colors, spacing, typography } from "../../constants/designTokens";

interface ModalSelectNarratorProps {
	visible: boolean;
	onClose: () => void;
	currentNarrator: string;
}

const NARRATORS = ["Carla", "Michael", "Sira", "Walter", "Frederick"];

const ModalSelectNarrator: React.FC<ModalSelectNarratorProps> = ({
	visible,
	onClose,
	currentNarrator,
}) => {
	const dispatch = useAppDispatch();
	const [selectedNarrator, setSelectedNarrator] = useState(currentNarrator);
	const [playingNarrator, setPlayingNarrator] = useState<string | null>(null);
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	const handleSelect = (narrator: string) => {
		setSelectedNarrator(narrator);
	};

	const handleConfirm = () => {
		dispatch(updateNarratorVoiceName(selectedNarrator));
		onClose();
	};

	const handlePlayPreview = async (narrator: string) => {
		try {
			// Stop any currently playing sound
			if (sound) {
				await sound.stopAsync();
				await sound.unloadAsync();
				setSound(null);
				setPlayingNarrator(null);
			}

			// If clicking the same narrator that's playing, just stop
			if (playingNarrator === narrator) {
				return;
			}

			// Static mapping of preview audio files (Metro bundler requires static requires)
			const previewAudioMap: Record<string, any> = {
				carla: require("../../assets/audio/breathing/carla/inhale.mp3"),
				michael: require("../../assets/audio/breathing/micheal/inhale.mp3"),
				sira: require("../../assets/audio/breathing/sira/inhale.mp3"),
				walter: require("../../assets/audio/breathing/walter/inhale.mp3"),
				frederick: require("../../assets/audio/breathing/frederick/inhale.mp3"),
			};

			const narratorLowerCase = narrator.toLowerCase();
			const audioSource = previewAudioMap[narratorLowerCase];

			if (!audioSource) {
				console.error(`No preview audio found for narrator: ${narrator}`);
				return;
			}

			// Play the inhale sample for this narrator
			const { sound: newSound } = await Audio.Sound.createAsync(audioSource);

			setSound(newSound);
			setPlayingNarrator(narrator);

			// Play the sound
			await newSound.playAsync();

			// When sound finishes, reset playing state
			newSound.setOnPlaybackStatusUpdate((status) => {
				if (status.isLoaded && status.didJustFinish) {
					setPlayingNarrator(null);
				}
			});
		} catch (error) {
			console.error("Error playing preview:", error);
			setPlayingNarrator(null);
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
					{/* Title */}
					<Text style={styles.title}>Select your narrator</Text>

					{/* Narrator Options */}
					<ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
						{NARRATORS.map((narrator) => {
							const isSelected = selectedNarrator === narrator;
							const isPlaying = playingNarrator === narrator;

							return (
								<Pressable
									key={narrator}
									onPress={() => handleSelect(narrator)}
									style={styles.optionWrapper}
								>
									<View style={[
										styles.narratorItem,
										isSelected && styles.narratorItemSelected,
									]}>
										<Text style={styles.narratorText}>{narrator}</Text>
										{isSelected && (
											<Pressable
												style={styles.playButton}
												onPress={() => handlePlayPreview(narrator)}
											>
												<Ionicons
													name={isPlaying ? "pause" : "play"}
													size={20}
													color={colors.textPrimary}
												/>
											</Pressable>
										)}
									</View>
								</Pressable>
							);
						})}

						{/* "Use your own voice" option - locked for now */}
						<Pressable style={styles.customVoiceItem} disabled>
							<View style={styles.customVoiceContent}>
								<Ionicons name="sparkles" size={20} color={colors.accentPurple} />
								<Text style={styles.customVoiceText}>Use your own voice</Text>
							</View>
							<View style={styles.lockIcon}>
								<Ionicons name="lock-closed" size={16} color={colors.textMuted} />
							</View>
						</Pressable>
					</ScrollView>

					{/* Select Button */}
					<Pressable style={styles.selectButton} onPress={handleConfirm}>
						<Text style={styles.selectButtonText}>Select</Text>
					</Pressable>
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
		paddingTop: 40,
		paddingBottom: 40,
		paddingHorizontal: spacing.panelPaddingHorizontal,
	},
	title: {
		fontSize: typography.panelTitle.fontSize,
		fontWeight: typography.panelTitle.fontWeight,
		color: colors.textPrimary,
		textAlign: "center",
		marginBottom: 32,
	},
	optionsContainer: {
		flex: 1,
		marginBottom: 24,
	},
	optionWrapper: {
		marginBottom: 8,
	},
	narratorItem: {
		backgroundColor: colors.cardBackground,
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.cardBorder,
	},
	narratorItemSelected: {
		backgroundColor: colors.cardBackgroundLifted,
		borderColor: colors.accentPurple,
		borderWidth: 2,
	},
	narratorText: {
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
	customVoiceItem: {
		backgroundColor: colors.cardBackground,
		borderColor: colors.cardBorder,
		borderWidth: 1,
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
		opacity: 0.5,
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
	},
	selectButtonText: {
		fontSize: typography.buttonText.fontSize,
		fontWeight: typography.buttonText.fontWeight,
		color: colors.textPrimary,
	},
});

export default ModalSelectNarrator;
