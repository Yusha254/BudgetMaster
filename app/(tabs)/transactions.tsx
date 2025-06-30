import { useState } from 'react';
import { StyleSheet } from 'react-native';
import TransactionsFilterTabs from '../../components/TransactionsFilterTabs';
import TransactionsSearchBar from '../../components/TransactionsSearchBar';
import TransactionList from '../../components/TransactionList';
import AddTransaction from '../../components/AddTransaction';
import { View } from '../../components/Themed';

export default function Transactions() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <TransactionsSearchBar search={search} onChange={setSearch} />
      <TransactionsFilterTabs selected={selectedFilter} onSelect={setSelectedFilter} />
      <TransactionList filter={selectedFilter} search={search} />
      <AddTransaction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
