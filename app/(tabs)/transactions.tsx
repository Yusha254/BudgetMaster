import { StyleSheet } from 'react-native';

import TransactionsFilterTabs from '../../components/TransactionsFilterTabs';
import TransactionsSearchBar from '../../components/TransactionsSearchBar';
import TransactionList from '../../components/TransactionList';
import { View } from '../../components/Themed';
import AddTransaction from '../../components/AddTransaction';


export default function Transactions() {
  return (
    <View style={styles.container}>
      <TransactionsSearchBar />
      <TransactionsFilterTabs selected="Income" />
      <AddTransaction />
      <TransactionList />
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
