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
import SelectableCard from "../cards/SelectableCard";

interface ModalSelectNarratorProps {
	visible: boolean;
	onClose: () => void;
	currentNarrator: string;
}

const NARRATORS = [
	"No Voice",
	// "Carla", // Temporarily hidden - audio quality needs improvement
	// "Michael", // Temporarily hidden - audio quality needs improvement
	"Sira",
	// "Walter", // Temporarily hidden - audio quality needs improvement
	"Frederick",
];

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
					{/* Fixed Header */}
					<View style={styles.headerContainer}>
						<Text style={styles.title}>Select your narrator</Text>
					</View>

					{/* Narrator Options */}
					<ScrollView 
						style={styles.optionsContainer} 
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						{NARRATORS.map((narrator) => {
							const isSelected = selectedNarrator === narrator;
							const isPlaying = playingNarrator === narrator;

							return (
								<View key={narrator} style={styles.optionWrapper}>
									<SelectableCard
										isSelected={isSelected}
										onPress={() => handleSelect(narrator)}
										fixedHeight={88}
									>
										<Text style={styles.narratorText}>{narrator}</Text>
										{isSelected && narrator !== "No Voice" && (
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
									</SelectableCard>
								</View>
							);
						})}

						{/* "Use your own voice" option - locked for now */}
						<View style={styles.optionWrapper}>
							<SelectableCard
								isSelected={false}
								onPress={() => {}}
								disabled={true}
								fixedHeight={88}
							>
								<View style={styles.customVoiceContent}>
									<Ionicons name="sparkles" size={20} color={colors.accentPurple} />
									<Text style={styles.customVoiceText}>Use your own voice</Text>
								</View>
								<View style={styles.lockIcon}>
									<Ionicons name="lock-closed" size={16} color={colors.textMuted} />
								</View>
							</SelectableCard>
						</View>
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

export default ModalSelectNarrator;
