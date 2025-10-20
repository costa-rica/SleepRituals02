import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import type { MantraLine } from '../../types/mantra';

interface ThreeLineStackProps {
  previousLine: MantraLine | null;
  currentLine: MantraLine;
  nextLine: MantraLine | null;
  onTapPrevious?: () => void;
  onTapNext?: () => void;
}

export function ThreeLineStack({
  previousLine,
  currentLine,
  nextLine,
  onTapPrevious,
  onTapNext,
}: ThreeLineStackProps) {
  // Animated values for smooth transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  // Trigger animation when currentLine changes
  useEffect(() => {
    // Reset and animate
    fadeAnim.setValue(0);
    translateAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentLine]);

  return (
    <View style={styles.container}>
      {/* Previous line (faint, top) */}
      {previousLine && (
        <Pressable
          onPress={onTapPrevious}
          style={styles.lineContainer}
        >
          <Text style={[styles.lineText, styles.faintText]}>
            {previousLine.text}
          </Text>
        </Pressable>
      )}

      {/* Current line (bright, center) */}
      <Animated.View
        style={[
          styles.lineContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        <Text style={[styles.lineText, styles.activeText]}>
          {currentLine.text}
        </Text>
      </Animated.View>

      {/* Next line (faint, bottom) */}
      {nextLine && (
        <Pressable
          onPress={onTapNext}
          style={styles.lineContainer}
        >
          <Text style={[styles.lineText, styles.faintText]}>
            {nextLine.text}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  lineContainer: {
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  lineText: {
    fontSize: 20,
    textAlign: 'center',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  faintText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: '300',
  },
});
