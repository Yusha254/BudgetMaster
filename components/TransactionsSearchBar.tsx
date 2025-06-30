import React from 'react';
import { StyleSheet } from 'react-native';
import { View, TextInput,} from './Themed';
import ThemedIcon from './Themed';

type Props = {
  search: string;
  onChange: (text: string) => void;
};

export default function TransactionsSearchBar({ search, onChange }: Props) {
  return (
    <View style={styles.container}>
      <ThemedIcon name="search" style={styles.icon} />
      <TextInput
        placeholder="Search by name"
        value={search}
        onChangeText={onChange}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    margin: 12,
  },
  icon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
