import { StyleSheet } from 'react-native';
import TransactionsFilterTabs from '../../components/TransactionsFilterTabs';
import TransactionsSearchBar from '../../components/TransactionsSearchBar';
import TransactionList from '../../components/TransactionList';
import AddTransaction from '../../components/AddTransaction';
import { View } from '../../components/Themed';


export default function Transactions() {
  return (
    <View style={styles.container}>
      <TransactionsSearchBar />
      <TransactionsFilterTabs selected="Income" />
      <AddTransaction /> {/* context will refetch automatically */}
      <TransactionList /> {/* will use context automatically */}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
