import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { useBudgetContext } from '../context/BudgetContext';
import { useTransactionContext } from '../context/TransactionContext';
import { useCategories } from '../hooks/UseCategories';

export default function SpendingSummary() {
  const { budget } = useBudgetContext();
  const { transactions } = useTransactionContext();
  const categoryData = useCategories({ isIncome: false });

  if (!budget) return null;

  const totalSpent = budget.spentAmount;
  const totalBudget = budget.totalAmount;
  const savings = totalBudget - totalSpent;

  const highestCategory = categoryData.length > 0
    ? categoryData.sort((a, b) => b.amount - a.amount)[0].name
    : '—';

  // ✅ Calculate total transaction cost (e.g., withdrawal charges, etc.)
  const totalCosts = transactions
    .filter(tx => !tx.isIncome)
    .reduce((sum, tx) => sum + (tx.cost || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Total Spent</Text>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Spent:</Text>
        <Text style={styles.value}>Ksh {totalSpent}</Text>
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Remaining:</Text>
        <Text style={styles.value}>Ksh {savings}</Text>
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Highest Expense:</Text>
        <Text style={styles.value}>{highestCategory}</Text>
      </View>

      <View style={styles.itemRow}>
        <Text style={styles.label}>Transaction Costs:</Text>
        <Text style={styles.value}>Ksh {totalCosts}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
});
