import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import type { GoodTimesProps } from "../../types/navigation";
import ScreenFrame from "../../components/ScreenFrame";

interface Entry {
	id: number;
	text: string;
	disabled: boolean;
}

export default function GoodTimes({ navigation }: GoodTimesProps) {
	const [entries, setEntries] = useState<Entry[]>([
		{ id: 0, text: "", disabled: false }
	]);

	const handleTextChange = (id: number, text: string) => {
		setEntries((prevEntries) =>
			prevEntries.map((entry) =>
				entry.id === id ? { ...entry, text } : entry
			)
		);
	};

	const handleAddNew = () => {
		const currentEntry = entries.find((e) => !e.disabled);
		if (currentEntry && currentEntry.text.length > 0) {
			setEntries((prevEntries) => [
				...prevEntries.map((e) =>
					e.id === currentEntry.id ? { ...e, disabled: true } : e
				),
				{ id: Date.now(), text: "", disabled: false }
			]);
		}
	};

	const currentEntry = entries.find((e) => !e.disabled);
	const showNewButton = currentEntry && currentEntry.text.length > 0;

	// Next button is enabled when at least one entry has text
	const hasAtLeastOneEntry = entries.some((entry) => entry.text.length > 0);

	const handleNext = () => {
		if (hasAtLeastOneEntry) {
			navigation.navigate("Breathing");
		}
	};

	return (
		<ScreenFrame currentScreen="GoodTimes">
			<View style={styles.container}>
				<Text style={styles.questionText}>
					What are some things that made you happy today?
				</Text>

				<View style={styles.entriesContainer}>
					{entries.map((entry) => (
						<TextInput
							key={entry.id}
							style={[
								styles.input,
								entry.disabled && styles.inputDisabled
							]}
							value={entry.text}
							onChangeText={(text) => handleTextChange(entry.id, text)}
							placeholder={entry.id === 0 ? "My son laughed at my joke" : ""}
							placeholderTextColor="rgba(255, 255, 255, 0.3)"
							editable={!entry.disabled}
							multiline={false}
						/>
					))}

					{showNewButton && (
						<TouchableOpacity onPress={handleAddNew} style={styles.newButton}>
							<Text style={styles.newButtonText}>+ New</Text>
						</TouchableOpacity>
					)}
				</View>

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
		</ScreenFrame>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 40,
	},
	questionText: {
		color: "#FFFFFF",
		fontSize: 24,
		textAlign: "center",
		marginBottom: 40,
		lineHeight: 32,
	},
	entriesContainer: {
		width: "100%",
		flex: 1,
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
	inputDisabled: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
		borderColor: "rgba(255, 255, 255, 0.15)",
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
