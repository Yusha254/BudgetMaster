// components/LatestTransactions.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import TransactionCard from './TransactionCard';
import { transactions } from '../data/Transactions';

export default function LatestTransactionCard() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Transactions</Text>

      {transactions.slice(0, 4).map((tx) => (
        <TransactionCard
          key={tx.id}
          name={tx.name}
          datetime={tx.datetime}
          amount={tx.amount}
          isIncome={tx.isIncome}
        />
      ))}

      <TouchableOpacity style={styles.viewAllButton}>
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
    textAlign: 'center'
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
