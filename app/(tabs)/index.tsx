import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import BudgetHeader from '../../components/BudgetHeader';
import SpendingSummary from '../../components/SpendingSummary';
import LatestTransactionCard from '../../components/LatestTransactionCard';
import { ScrollView, Text } from '../../components/Themed';
import { DatabaseReadyContext } from '../../context/DatabaseProvider'; // ✅ import it

export default function Home() {
  const isDbReady = useContext(DatabaseReadyContext); // ✅ read readiness

  if (!isDbReady) {
    return <Text style={styles.loading}>Initializing database...</Text>;
  }

  const hasBudget = true;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <BudgetHeader />
      <SpendingSummary />
      <LatestTransactionCard />
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
