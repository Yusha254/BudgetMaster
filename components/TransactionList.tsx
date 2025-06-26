import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from './Themed';
import TransactionCard from './TransactionCard';
import { useTransactionContext } from '../context/TransactionContext';

type Props = {
  transactions?: {
    id: number;
    name: string;
    amount: number;
    isIncome: boolean | null;
    date: string;
    time: string;
  }[];
  loading?: boolean;
  limit?: number;
};

export default function TransactionList({ transactions, loading, limit }: Props) {
  const context = useTransactionContext();
  const data = transactions ?? context.transactions;
  const isLoading = loading ?? context.loading;

  const visibleData = limit ? data.slice(0, limit) : data;

  if (isLoading) {
    return <Text style={styles.message}>Loading transactions...</Text>;
  }

  if (visibleData.length === 0) {
    return <Text style={styles.message}>No transactions available.</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {visibleData
        .filter((tx) => tx.isIncome !== null)
        .map((tx) => (
          <TransactionCard
            key={tx.id}
            name={tx.name}
            datetime={`${tx.date} • ${tx.time}`}
            amount={tx.amount}
            isIncome={!!tx.isIncome}
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
  message: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
  },
});
