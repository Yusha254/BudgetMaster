import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, useThemeColor } from './Themed';
import { useRouter } from 'expo-router';
import TransactionList from './TransactionList';

export default function LatestTransactionCard() {
  const router = useRouter();
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const shadow = useThemeColor({}, 'shadow');

  const handleViewAll = () => {
    router.push('/(tabs)/transactions');
  };

  return (
    <View style={[styles.container, { backgroundColor: surface, shadowColor: shadow }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      <TransactionList limit={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    paddingTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});