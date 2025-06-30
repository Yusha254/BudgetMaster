import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import BudgetHeader from '../../components/BudgetHeader';
import SpendingSummary from '../../components/SpendingSummary';
import LatestTransactionCard from '../../components/LatestTransactionCard';
import NoBudget from '../../components/NoBudget';
import { useBudgetContext } from '../../context/BudgetContext';
import { ScrollView, Text, View } from '../../components/Themed';
import { DatabaseReadyContext } from '../../context/DatabaseProvider';
import { isPastMonth } from '../../utils/DateUtils';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Home() {
  const isDbReady = useContext(DatabaseReadyContext);
  const { budget, refresh, loading } = useBudgetContext();

  const now = new Date();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    refresh(monthNames[selectedMonthIndex], selectedYear);
  }, [selectedMonthIndex, selectedYear]);

  if (!isDbReady || loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const isPast = isPastMonth(selectedMonthIndex, selectedYear);
  const hasBudget = !!budget;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <BudgetHeader
        selectedMonthIndex={selectedMonthIndex}
        setSelectedMonthIndex={setSelectedMonthIndex}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      {hasBudget ? (
        <>
          <SpendingSummary />
          <LatestTransactionCard />
        </>
      ) : !isPast ? (
        <NoBudget />
      ) : (
        <Text style={{ padding: 12, fontSize: 14, opacity: 0.7 }}>
          No budget exists for this past month.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  loading: {
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
});
