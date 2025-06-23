import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from './Themed';
import TransactionCard from './TransactionCard';
import { transactions } from '../data/Transactions';

export default function TransactionList() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {transactions.map((tx) => (
        <TransactionCard
          key={tx.id}
          name={tx.name}
          datetime={tx.datetime}
          amount={tx.amount}
          isIncome={tx.isIncome}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 4,
  },
});
