// components/TimeToggle.tsx
import React, { useState } from 'react';
import { View, ThemedMenu, ThemedButton, ThemedMenuItem } from './Themed';

const timeOptions = ['Day', 'Week', 'Month', 'Year'] as const;
export type TimeRange = typeof timeOptions[number];

interface TimeToggleProps {
  selectedRange: TimeRange;
  onSelect: (range: TimeRange) => void;
}

export default function TimeToggle({ selectedRange, onSelect }: TimeToggleProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <ThemedMenu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <ThemedButton onPress={() => setVisible(true)}>
            {selectedRange}
          </ThemedButton>
        }
      >
        {timeOptions.map(option => (
          <ThemedMenuItem
            key={option}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
            title={option}
          />
        ))}
      </ThemedMenu>
    </View>
  );
}
