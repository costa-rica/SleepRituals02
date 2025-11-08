import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { BREATHING_EXERCISES_ARRAY } from '../../constants/breathingExercises';
import type { BreatheExercise } from '../../store';
import { colors, spacing, typography } from '../../constants/designTokens';
import SelectableCard from '../cards/SelectableCard';

interface ModalSelectBreathingExerciseProps {
  visible: boolean;
  onClose: () => void;
  currentSelection: string;
  onSelect: (exercise: BreatheExercise) => void;
}

const ModalSelectBreathingExercise: React.FC<ModalSelectBreathingExerciseProps> = ({
  visible,
  onClose,
  currentSelection,
  onSelect,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<string>(currentSelection);

  const handleSelect = () => {
    const exercise = BREATHING_EXERCISES_ARRAY.find(
      (ex) => ex.exerciseTitle === selectedExercise
    );
    if (exercise) {
      onSelect(exercise);
      onClose();
    }
  };

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
          <Text style={styles.title}>Select breathing exercise</Text>

          {/* Exercise Options */}
          <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
            {BREATHING_EXERCISES_ARRAY.map((exercise) => {
              const isSelected = exercise.exerciseTitle === selectedExercise;

              return (
                <View key={exercise.exerciseTitle} style={styles.optionWrapper}>
                  <SelectableCard
                    isSelected={isSelected}
                    onPress={() => setSelectedExercise(exercise.exerciseTitle)}
                    style={styles.exerciseCard}
                  >
                    <View style={styles.exerciseContent}>
                      <Text style={styles.optionTitle}>{exercise.exerciseTitle}</Text>
                      <Text style={styles.optionDescription}>
                        {exercise.exerciseDescription}
                      </Text>
                    </View>
                  </SelectableCard>
                </View>
              );
            })}
          </ScrollView>

          {/* Select Button */}
          <Pressable style={styles.selectButton} onPress={handleSelect}>
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
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 24,
  },
  optionWrapper: {
    marginBottom: 8,
  },
  exerciseCard: {
    padding: 16,
  },
  exerciseContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: colors.accentPurple,
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: typography.buttonText.fontSize,
    fontWeight: typography.buttonText.fontWeight,
    color: colors.textPrimary,
  },
});

export default ModalSelectBreathingExercise;
