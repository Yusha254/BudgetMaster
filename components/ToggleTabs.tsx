// components/ToggleTabs.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Pressable } from './Themed';

interface ToggleTabsProps<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}

export default function ToggleTabs<T extends string>({
  options,
  selected,
  onSelect,
}: ToggleTabsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          isSelected={selected === option}
          onPress={() => onSelect(option)}
        >
          {option}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
