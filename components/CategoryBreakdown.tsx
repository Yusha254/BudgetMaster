import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, ThemedPieChart, useChartColors } from './Themed';
import { useCategories } from '../hooks/UseCategories';

interface Props {
  selectedType: 'Expense' | 'Income';
  selectedRange: 'Day' | 'Week' | 'Month' | 'Year';
}

export default function CategoryBreakdown({ selectedType, selectedRange }: Props) {
  const isIncome = selectedType === 'Income';

  const categoryData = useCategories({
    isIncome,
    range: selectedRange,
  });

  const { chartColors, text } = useChartColors();

  const totalAmount = categoryData.reduce((sum, d) => sum + d.amount, 0);

  const topCategory =
    categoryData.length > 0
      ? categoryData.reduce((a, b) => (a.amount > b.amount ? a : b)).name
      : '—';

  if (!categoryData.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data for this period</Text>
      </View>
    );
  }

  const pieData = categoryData.map((d, i) => {
    const percentage = ((d.amount / totalAmount) * 100).toFixed(1);
    return {
      name: `${d.name} (${percentage}%)`,
      amount: d.amount,
      color: chartColors[i % chartColors.length],
      legendFontColor: text,
      legendFontSize: 12,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedType} by Category</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.label}>Total {selectedType}:</Text>
        <Text style={styles.value}>Ksh {totalAmount}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.label}>Top Category:</Text>
        <Text style={styles.value}>{topCategory}</Text>
      </View>

      <ThemedPieChart data={pieData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryRow: {
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
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
