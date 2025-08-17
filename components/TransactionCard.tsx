import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, useThemeColor } from './Themed';

type TransactionCardProps = {
  name: string;
  datetime: string;
  amount: number;
  isIncome: boolean;
  category?: string;
};

export default function TransactionCard({ name, datetime, amount, isIncome, category }: TransactionCardProps) {
  const surface = useThemeColor({}, 'surface');
  const secondary = useThemeColor({}, 'secondary');
  const error = useThemeColor({}, 'error');
  const outline = useThemeColor({}, 'outline');

  const getTransactionIcon = () => {
    if (isIncome) return '💰';
    
    // Category-based icons
    const categoryIcons: { [key: string]: string } = {
      'Food': '🍽️',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills': '📄',
      'Health': '🏥',
      'Education': '📚',
      'Fuel': '⛽',
      'Airtime': '📱',
      'Transfer': '💸',
    };
    
    return categoryIcons[category || ''] || '💳';
  };

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: outline }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTransactionIcon()}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.datetime}>{datetime}</Text>
          {category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: isIncome ? secondary : error }]}>
            {isIncome ? '+' : '-'}Ksh {amount.toLocaleString()}
          </Text>
          <View style={[styles.indicator, { backgroundColor: isIncome ? secondary : error }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 4,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  datetime: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366F1',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});