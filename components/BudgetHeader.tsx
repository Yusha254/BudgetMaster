import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import ThemedIcon from './Themed';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetHeader() {
  const budgetAmount = 5200;
  const currentMonth = 'April';

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>Ksh {budgetAmount} left</Text>

      <View style={styles.monthSelector}>
        <TouchableOpacity>
          <ThemedIcon name="angle-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.month}>{currentMonth}</Text>
        <TouchableOpacity>
          <ThemedIcon name="angle-right" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
    borderRadius: 8,
    padding: 16,
  },
  amount: {
    fontSize: 35,
    fontWeight: '700',
    marginBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  month: {
    fontSize: 24,
    fontWeight: '500',
    marginHorizontal: 8,
  },
});
