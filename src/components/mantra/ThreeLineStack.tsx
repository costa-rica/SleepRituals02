import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { MantraLine } from '../../types/mantra';

interface ThreeLineStackProps {
  currentLine: MantraLine | null;
  lineOpacity: Animated.Value;
}

export function ThreeLineStack({
  currentLine,
  lineOpacity,
}: ThreeLineStackProps) {
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.lineContainer, { opacity: lineOpacity }]}>
        <Text style={styles.lineText}>
          {currentLine?.text || ''}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lineContainer: {
    paddingHorizontal: 40,
  },
  lineText: {
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
