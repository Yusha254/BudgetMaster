import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import BudgetHeader from '../../components/BudgetHeader';
import SpendingSummary from '../../components/SpendingSummary';
import LatestTransactionCard from '../../components/LatestTransactionCard';
import NoBudget from '../../components/NoBudget';
import { useBudgetContext } from '../../context/BudgetContext';
import { ScrollView, Text, View, useThemeColor } from '../../components/Themed';
import { DatabaseReadyContext } from '../../context/DatabaseProvider';
import { isPastMonth } from '../../utils/DateUtils';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Home() {
  const isDbReady = useContext(DatabaseReadyContext);
  const { budget, refresh, loading } = useBudgetContext();
  const background = useThemeColor({}, 'background');

  const now = new Date();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    refresh(monthNames[selectedMonthIndex], selectedYear);
  }, [selectedMonthIndex, selectedYear]);

  if (!isDbReady || loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: background }]}>
        <Text style={styles.loadingText}>💰 Loading BudgetMaster...</Text>
      </View>
    );
  }

  const isPast = isPastMonth(selectedMonthIndex, selectedYear);
  const hasBudget = !!budget;

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          <View style={styles.pastMonthContainer}>
            <Text style={styles.pastMonthIcon}>📅</Text>
            <Text style={styles.pastMonthTitle}>No Budget Found</Text>
            <Text style={styles.pastMonthText}>
              No budget was set for {monthNames[selectedMonthIndex]} {selectedYear}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  pastMonthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  pastMonthIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  pastMonthTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  pastMonthText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
});