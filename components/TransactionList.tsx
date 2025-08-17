import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView, View, useThemeColor } from './Themed';
import TransactionCard from './TransactionCard';
import { useTransactionContext } from '../context/TransactionContext';

type Props = {
  transactions?: {
    id: number;
    name: string;
    amount: number;
    isIncome: boolean | number | null;
    date: string;
    time: string;
    category?: string;
  }[];
  loading?: boolean;
  limit?: number;
  filter?: 'All' | 'Income' | 'Expense';
  search?: string;
};

export default function TransactionList({ transactions, loading, limit, filter, search = '' }: Props) {
  const context = useTransactionContext();
  const data = transactions ?? context.transactions;
  const isLoading = loading ?? context.loading;
  
  const surface = useThemeColor({}, 'surface');

  const filteredData = data.filter((tx) => {
    if (filter === 'Income') return tx.isIncome === 1 || tx.isIncome === true;
    if (filter === 'Expense') return tx.isIncome === 0 || tx.isIncome === false;
    return tx.isIncome !== null;
  });

  const searched = filteredData.filter((tx) =>
    tx.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleData = limit ? searched.slice(0, limit) : searched;

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.loadingText}>📊 Loading transactions...</Text>
      </View>
    );
  }

  if (visibleData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💸</Text>
        <Text style={styles.emptyTitle}>No transactions found</Text>
        <Text style={styles.emptySubtitle}>
          {search ? 'Try adjusting your search terms' : 'Your transactions will appear here'}
        </Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {visibleData.map((tx) => (
        <TransactionCard
          key={tx.id}
          name={tx.name}
          datetime={`${tx.date} • ${tx.time}`}
          amount={tx.amount}
          isIncome={!!tx.isIncome}
          category={tx.category}
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});