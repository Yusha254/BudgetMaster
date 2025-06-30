import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { useRouter } from 'expo-router';
import TransactionList from './TransactionList';

export default function LatestTransactionCard() {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/(tabs)/transactions'); // 👈 Adjust path if different
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Transactions</Text>

      <TransactionList limit={3} />

      <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2f95dc',
  },
});
