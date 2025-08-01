// components/SpendingTrendChart.tsx
import React, { useMemo } from 'react';
import { View, Text, ThemedLineChart } from './Themed';
import { StyleSheet } from 'react-native';
import { useTransactionContext } from '../context/TransactionContext';

interface Props {
  selectedType: 'Expense' | 'Income';
  selectedRange: 'Day' | 'Week' | 'Month' | 'Year';
}

export default function SpendingTrendChart({ selectedType, selectedRange }: Props) {
  const { transactions } = useTransactionContext();
  const isIncome = selectedType === 'Income';
  const currentYear = new Date().getFullYear();

  const { chartData, label } = useMemo(() => {
    const filteredTxs = transactions.filter(
      (tx) => Boolean(tx.isIncome) === isIncome
    );
  
    const now = new Date();
    let labels: string[] = [];
    let data: number[] = [];
  
    if (selectedRange === 'Day') {
      labels = [...Array(24).keys()].map(h => `${h}:00`);
      data = new Array(24).fill(0);
  
      filteredTxs.forEach(tx => {
        const txDate = new Date(`${tx.date}T${tx.time}`);
        if (txDate.toDateString() === now.toDateString()) {
          const hour = txDate.getHours();
          if (!isNaN(hour)) data[hour] += tx.amount;
        }
      });
    }
  
    else if (selectedRange === 'Week') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = new Array(7).fill(0);
  
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
  
      filteredTxs.forEach(tx => {
        const txDate = new Date(tx.date);
        const diff = (txDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24);
        const day = txDate.getDay();
        if (diff >= 0 && diff < 7 && !isNaN(day)) {
          data[day] += tx.amount;
        }
      });
    }
  
    else if (selectedRange === 'Month') {
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      if (isNaN(daysInMonth) || daysInMonth <= 0) {
        labels = [];
        data = [];
      } else {
        labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        data = new Array(daysInMonth).fill(0);
  
        filteredTxs.forEach(tx => {
          const [txYear, txMonth, txDay] = tx.date.split('-').map(Number);
          if (
            txYear === year &&
            txMonth === month + 1 &&
            txDay &&
            txDay >= 1 &&
            txDay <= daysInMonth
          ) {
            data[txDay - 1] += tx.amount;
          }
        });
      }
    }
  
    else if (selectedRange === 'Year') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = new Array(12).fill(0);
  
      filteredTxs.forEach(tx => {
        const [txYear, txMonth] = tx.date.split('-').map(Number);
        if (txYear === now.getFullYear() && txMonth && txMonth >= 1 && txMonth <= 12) {
          data[txMonth - 1] += tx.amount;
        }
      });
    }

    const labelSpacing = selectedRange === 'Year' ? 3 : selectedRange === 'Month' ? 5 : selectedRange === 'Day' ? 5 : 1;
    const filteredLabels = labels.map((label, i) =>
      i % labelSpacing === 0 ? label : ''
    );
    
  
    return {
      label: `${selectedType} by ${selectedRange}`,
      chartData: {
        labels: filteredLabels,
        datasets: [{ data }],
      },
    };    
  }, [transactions, selectedRange, selectedType]);

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>
        {label}
      </Text>
      <ThemedLineChart data={chartData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});
