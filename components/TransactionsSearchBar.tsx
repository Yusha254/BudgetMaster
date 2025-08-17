import React from 'react';
import { StyleSheet } from 'react-native';
import { View, TextInput, useThemeColor } from './Themed';
import ThemedIcon from './Themed';

type Props = {
  search: string;
  onChange: (text: string) => void;
};

export default function TransactionsSearchBar({ search, onChange }: Props) {
  const surface = useThemeColor({}, 'surface');
  const outline = useThemeColor({}, 'outline');
  const shadow = useThemeColor({}, 'shadow');

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: outline, shadowColor: shadow }]}>
      <ThemedIcon name="search" style={styles.icon} />
      <TextInput
        placeholder="Search transactions..."
        value={search}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
});