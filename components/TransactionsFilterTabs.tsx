import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Pressable } from './Themed';

type FilterOption = 'All' | 'Expense' | 'Income';

type Props = {
  selected?: FilterOption;
  onSelect?: (option: FilterOption) => void;
};

const options: FilterOption[] = ['All', 'Expense', 'Income'];

export default function TransactionsFilterTabs({ selected = 'All', onSelect }: Props) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          isSelected={selected === option}
          onPress={() => onSelect?.(option)}
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
    marginBottom: 12,
    justifyContent: 'center',
  },
});
