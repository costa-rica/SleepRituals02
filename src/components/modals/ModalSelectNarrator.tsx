import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Pressable,
	FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useAppDispatch } from "../../store";
import { updateNarratorVoiceName } from "../../store/features/sound/soundSlice";

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

	const renderNarrator = ({ item }: { item: string }) => {
		const isSelected = selectedNarrator === item;
		const isPlaying = playingNarrator === item;

		return (
			<Pressable
				style={[
					styles.narratorItem,
					isSelected && styles.narratorItemSelected,
				]}
				onPress={() => handleSelect(item)}
			>
				<Text style={styles.narratorText}>{item}</Text>
				{isSelected && (
					<Pressable
						style={styles.playButton}
						onPress={() => handlePlayPreview(item)}
					>
						<Ionicons
							name={isPlaying ? "pause" : "play"}
							size={20}
							color="#FFFFFF"
						/>
					</Pressable>
				)}
			</Pressable>
		);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.modalContainer}>
					<Text style={styles.title}>Select your narrator</Text>

					<FlatList
						data={NARRATORS}
						renderItem={renderNarrator}
						keyExtractor={(item) => item}
						style={styles.list}
						contentContainerStyle={styles.listContent}
					/>

					{/* "Use your own voice" option - locked for now */}
					<Pressable style={styles.customVoiceItem} disabled>
						<View style={styles.customVoiceContent}>
							<Ionicons name="sparkles" size={20} color="#8B7FB8" />
							<Text style={styles.customVoiceText}>Use your own voice</Text>
						</View>
						<View style={styles.lockIcon}>
							<Ionicons name="lock-closed" size={16} color="#8B8B8B" />
						</View>
					</Pressable>

					<Pressable style={styles.selectButton} onPress={handleConfirm}>
						<Text style={styles.selectButtonText}>Select</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	modalContainer: {
		backgroundColor: "#1A1625",
		borderRadius: 24,
		padding: 24,
		width: "100%",
		maxWidth: 400,
	},
	title: {
		fontSize: 24,
		fontWeight: "600",
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 24,
	},
	list: {
		maxHeight: 400,
	},
	listContent: {
		gap: 12,
	},
	narratorItem: {
		backgroundColor: "#2A2535",
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
	},
	narratorItemSelected: {
		backgroundColor: "#3D2F5A",
		borderColor: "#8B7FB8",
	},
	narratorText: {
		fontSize: 18,
		fontWeight: "500",
		color: "#FFFFFF",
	},
	playButton: {
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
	},
	customVoiceItem: {
		backgroundColor: "#2A2535",
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 12,
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
		color: "#FFFFFF",
	},
	lockIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#1A1625",
		justifyContent: "center",
		alignItems: "center",
	},
	selectButton: {
		backgroundColor: "#8B7FB8",
		paddingVertical: 18,
		borderRadius: 28,
		alignItems: "center",
		marginTop: 24,
	},
	selectButtonText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
	},
});

export default ModalSelectNarrator;
