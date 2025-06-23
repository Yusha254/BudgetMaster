import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { FontAwesome5 } from '@expo/vector-icons';

type TransactionCardProps = {
  name: string;
  datetime: string;
  amount: number;
  isIncome: boolean;
};

export default function TransactionCard({ name, datetime, amount, isIncome }: TransactionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={isIncome ? 'arrow-down' : 'arrow-up'}
          size={20}
          color={isIncome ? 'green' : 'red'}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.datetime}>{datetime}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? 'green' : 'red' }]}>
          KES {amount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  datetime: {
    fontSize: 12,
    opacity: 0.6,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
