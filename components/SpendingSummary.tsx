import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, useThemeColor } from './Themed';
import { useBudgetContext } from '../context/BudgetContext';
import { useTransactionContext } from '../context/TransactionContext';
import { useCategories } from '../hooks/UseCategories';

export default function SpendingSummary() {
  const { budget } = useBudgetContext();
  const { transactions } = useTransactionContext();
  const categoryData = useCategories({ isIncome: false });
  
  const surface = useThemeColor({}, 'surface');
  const shadow = useThemeColor({}, 'shadow');
  const secondary = useThemeColor({}, 'secondary');
  const accent = useThemeColor({}, 'accent');
  const error = useThemeColor({}, 'error');

  if (!budget) return null;

  const totalSpent = budget.spentAmount;
  const totalBudget = budget.totalAmount;
  const savings = totalBudget - totalSpent;

  const highestCategory = categoryData.length > 0
    ? categoryData.sort((a, b) => b.amount - a.amount)[0].name
    : 'No expenses yet';

  const totalCosts = transactions
    .filter(tx => !tx.isIncome)
    .reduce((sum, tx) => sum + (tx.cost || 0), 0);

  const summaryItems = [
    {
      label: 'Total Spent',
      value: `Ksh ${totalSpent.toLocaleString()}`,
      color: error,
      icon: '📊',
    },
    {
      label: 'Remaining',
      value: `Ksh ${Math.abs(savings).toLocaleString()}`,
      color: savings >= 0 ? secondary : error,
      icon: savings >= 0 ? '💰' : '⚠️',
    },
    {
      label: 'Top Category',
      value: highestCategory,
      color: accent,
      icon: '🏆',
    },
    {
      label: 'Transaction Fees',
      value: `Ksh ${totalCosts.toLocaleString()}`,
      color: '#6B7280',
      icon: '💳',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: surface, shadowColor: shadow }]}>
      <Text style={styles.title}>Spending Overview</Text>
      
      <View style={styles.grid}>
        {summaryItems.map((item, index) => (
          <View key={index} style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={[styles.value, { color: item.color }]} numberOfLines={1}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});