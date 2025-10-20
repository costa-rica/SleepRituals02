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
import { LinearGradient } from 'expo-linear-gradient';
import { BREATHING_EXERCISES_ARRAY } from '../../constants/breathingExercises';
import type { BreatheExercise } from '../../store';

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
                <Pressable
                  key={exercise.exerciseTitle}
                  onPress={() => setSelectedExercise(exercise.exerciseTitle)}
                  style={styles.optionWrapper}
                >
                  {isSelected ? (
                    // Selected state with gradient border
                    <LinearGradient
                      colors={['#42098F', '#B53FFE']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBorder}
                    >
                      <LinearGradient
                        colors={['rgba(66, 9, 143, 0.3)', 'rgba(181, 63, 254, 0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.selectedOption}
                      >
                        <Text style={styles.optionTitle}>{exercise.exerciseTitle}</Text>
                        <Text style={styles.optionDescription}>
                          {exercise.exerciseDescription}
                        </Text>
                      </LinearGradient>
                    </LinearGradient>
                  ) : (
                    // Unselected state
                    <View style={styles.option}>
                      <Text style={styles.optionTitle}>{exercise.exerciseTitle}</Text>
                      <Text style={styles.optionDescription}>
                        {exercise.exerciseDescription}
                      </Text>
                    </View>
                  )}
                </Pressable>
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
    backgroundColor: '#0F1015',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
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
  option: {
    backgroundColor: '#212131',
    borderColor: '#3E2566',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 1,
    shadowColor: '#6913AC',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  selectedOption: {
    borderRadius: 15,
    padding: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: '#8B7FB8',
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ModalSelectBreathingExercise;
