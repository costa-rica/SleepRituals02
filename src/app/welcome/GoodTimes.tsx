import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import type { GoodTimesProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";

interface Entry {
	id: number;
	text: string;
}

// Array of inspiring placeholder prompts
const PLACEHOLDER_PROMPTS = [
	"Something that made you laugh",
	"A kind thing you did for someone",
	"Something that inspired you",
	"A moment of peace you experienced",
	"Something you're grateful for",
	"A person who brightened your day",
	"An accomplishment, big or small",
	"Something beautiful you noticed",
	"A pleasant surprise",
	"A good conversation you had",
	"Something you learned today",
	"A challenge you overcame",
	"Someone you helped",
	"A compliment you received",
	"Something that went better than expected",
	"A small victory",
	"Something that made you smile",
	"A moment of connection",
	"Something you enjoyed",
	"A reason to feel proud",
];

// Shuffle array function to randomize prompts each time
const shuffleArray = <T,>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export default function GoodTimes({ navigation }: GoodTimesProps) {
	const [entries, setEntries] = useState<Entry[]>([
		{ id: 0, text: "" }
	]);
	const inputRefs = useRef<Map<number, TextInput>>(new Map());
	const scrollViewRef = useRef<ScrollView>(null);
	const [focusId, setFocusId] = useState<number | null>(null);
	const [showGradient, setShowGradient] = useState(false);
	// Shuffle prompts once on mount
	const [shuffledPrompts] = useState(() => shuffleArray(PLACEHOLDER_PROMPTS));

	const handleTextChange = (id: number, text: string) => {
		setEntries((prevEntries) =>
			prevEntries.map((entry) =>
				entry.id === id ? { ...entry, text } : entry
			)
		);
	};

	const handleAddNew = () => {
		const newId = Date.now();
		setEntries((prevEntries) => [
			...prevEntries,
			{ id: newId, text: "" }
		]);
		setFocusId(newId);
		// Auto-scroll to bottom when new entry is added
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	useEffect(() => {
		if (focusId !== null) {
			const inputRef = inputRefs.current.get(focusId);
			if (inputRef) {
				inputRef.focus();
				setFocusId(null);
			}
		}
	}, [focusId, entries]);

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		setShowGradient(offsetY > 10);
	};

	const handleBlur = (id: number) => {
		const entry = entries.find((e) => e.id === id);
		// Only remove if the field is empty AND there's more than one entry
		if (entry && entry.text.trim() === "" && entries.length > 1) {
			setEntries((prevEntries) => prevEntries.filter((e) => e.id !== id));
		}
	};

	const handleSubmitEditing = (id: number) => {
		const entry = entries.find((e) => e.id === id);
		if (entry && entry.text.trim() !== "") {
			// Field has text, create a new field
			handleAddNew();
		} else if (entry && entry.text.trim() === "" && entries.length > 1) {
			// Field is empty, remove it
			setEntries((prevEntries) => prevEntries.filter((e) => e.id !== id));
		}
	};

	// Show "+ New" button when all fields have text
	const allFieldsHaveText = entries.every((entry) => entry.text.trim().length > 0);
	const showNewButton = allFieldsHaveText;

	// Next button is enabled when at least one entry has text
	const hasAtLeastOneEntry = entries.some((entry) => entry.text.trim().length > 0);

	const handleNext = () => {
		if (hasAtLeastOneEntry) {
			navigation.navigate("Breathing");
		}
	};

	return (
		<ScreenFrame>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.container}>
					<ScrollView
						ref={scrollViewRef}
						style={styles.scrollView}
						contentContainerStyle={styles.scrollViewContent}
						showsVerticalScrollIndicator={true}
						onScroll={handleScroll}
						scrollEventThrottle={16}
						keyboardShouldPersistTaps="handled"
					>
						<Text style={styles.questionText}>
							Positive moments from today
						</Text>

						{entries.map((entry, index) => (
							<TextInput
								key={entry.id}
								ref={(ref) => {
									if (ref) {
										inputRefs.current.set(entry.id, ref);
									} else {
										inputRefs.current.delete(entry.id);
									}
								}}
								style={styles.input}
								value={entry.text}
								onChangeText={(text) => handleTextChange(entry.id, text)}
								onBlur={() => handleBlur(entry.id)}
								onSubmitEditing={() => handleSubmitEditing(entry.id)}
								returnKeyType="done"
								blurOnSubmit={false}
								placeholder={shuffledPrompts[index % shuffledPrompts.length]}
								placeholderTextColor="rgba(255, 255, 255, 0.3)"
								multiline={false}
							/>
						))}

						{showNewButton && (
							<TouchableOpacity onPress={handleAddNew} style={styles.newButton}>
								<Text style={styles.newButtonText}>+ New</Text>
							</TouchableOpacity>
						)}
					</ScrollView>

					{showGradient && (
						<LinearGradient
							colors={['#0F1015', 'transparent']}
							style={styles.gradientOverlay}
							pointerEvents="none"
						/>
					)}

					<View style={styles.bottomContainer}>
						<TouchableOpacity
							style={[
								styles.nextButton,
								!hasAtLeastOneEntry && styles.nextButtonDisabled
							]}
							onPress={handleNext}
							disabled={!hasAtLeastOneEntry}
						>
							<Text
								style={[
									styles.nextButtonText,
									!hasAtLeastOneEntry && styles.nextButtonTextDisabled
								]}
							>
								Next
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingLeft: 24,
		paddingRight: 24,
		paddingTop: 40,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		paddingBottom: 68, // Space for bottom container (Next button area) + spacing
	},
	questionText: {
		color: "#FFFFFF",
		fontSize: 24,
		textAlign: "center",
		marginBottom: 40,
		lineHeight: 32,
	},
	gradientOverlay: {
		position: "absolute",
		top: 40, // Same as container paddingTop
		left: 0,
		right: 0,
		height: 60,
		zIndex: 10,
	},
	input: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 12,
		paddingHorizontal: 20,
		paddingVertical: 16,
		fontSize: 16,
		color: "#FFFFFF",
		marginBottom: 16,
		minHeight: 56,
	},
	newButton: {
		paddingVertical: 8,
	},
	newButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
	},
	bottomContainer: {
		paddingVertical: 24,
		width: "100%",
	},
	nextButton: {
		backgroundColor: "rgba(138, 86, 226, 1)",
		borderRadius: 28,
		paddingVertical: 20,
		paddingHorizontal: 40,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 56,
	},
	nextButtonDisabled: {
		backgroundColor: "rgba(138, 86, 226, 0.3)",
	},
	nextButtonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "600",
	},
	nextButtonTextDisabled: {
		color: "rgba(255, 255, 255, 0.4)",
	},
});
