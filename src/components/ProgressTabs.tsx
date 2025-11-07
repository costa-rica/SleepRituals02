import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressTabsProps {
  total: number;
  current: number;
}

export function ProgressTabs({ total, current }: ProgressTabsProps) {
  return (
    <View style={styles.container}>
      {[...Array(total)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.tab,
            index <= current && styles.tabActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 32,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tab: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
});
