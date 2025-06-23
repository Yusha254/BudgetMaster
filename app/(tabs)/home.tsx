import React from 'react';
import { StyleSheet } from 'react-native';
import BudgetHeader from '../../components/BudgetHeader';
import SpendingSummary from '../../components/SpendingSummary';
import LatestTransactionCard from '../../components/LatestTransactionCard';
import { ScrollView } from '../../components/Themed';


export default function Home() {
  const hasBudget = true; // Toggle this to false to preview the 'no budget' screen

  if (!hasBudget) {

  }

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
 
});
