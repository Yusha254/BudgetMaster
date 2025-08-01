// app/(tabs)/analysis.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from '../../components/Themed';
import TimeToggle from '../../components/TimeToggle';
import TypeToggle from '../../components/TypeToggle';
import SpendingTrendChart from '../../components/SpendingTrendChart';
import CategoryBreakdown from '../../components/CategoryBreakdown';

export default function Analysis() {

  const [selectedType, setSelectedType] = useState<'Expense' | 'Income'>('Expense');
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TypeToggle selectedType={selectedType} onSelect={setSelectedType} />
      <TimeToggle selectedRange={selectedPeriod} onSelect={setSelectedPeriod} />
      <SpendingTrendChart selectedType={selectedType} selectedRange={selectedPeriod}></SpendingTrendChart>
      <CategoryBreakdown selectedType={selectedType} selectedRange={selectedPeriod} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
