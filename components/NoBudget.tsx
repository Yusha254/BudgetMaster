import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View, Text, TextInput, Pressable, useThemeColor } from './Themed';
import { insertBudget } from '../data/Database';
import { useBudgetContext } from '../context/BudgetContext';

type Props = {
  onCreate?: () => void;
};

export default function NoBudget({ onCreate }: Props) {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const { refresh } = useBudgetContext();
  
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const shadow = useThemeColor({}, 'shadow');

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();

    setMonth(currentMonth);
    setYear(currentYear);
  }, []);

  const handleCreateBudget = async () => {
    const parsedAmount = parseFloat(amount);
  
    if (!month || !year || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid budget amount greater than 0.');
      return;
    }
  
    try {
      await insertBudget({
        month,
        year,
        totalAmount: parsedAmount,
        spentAmount: 0,
      });
  
      await refresh();
      onCreate?.();
    } catch (error) {
      console.error('❌ Failed to insert budget:', error);
      Alert.alert('Error', 'Could not create budget. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: surface, shadowColor: shadow }]}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💰</Text>
        </View>
        
        <Text style={styles.title}>Set Your Budget</Text>
        <Text style={styles.subtitle}>
          Create a budget for {month} {year} to start tracking your expenses
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Budget Amount</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>Ksh</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        <Pressable 
          onPress={handleCreateBudget} 
          style={[styles.button, { backgroundColor: primary }]}
        >
          <Text style={styles.buttonText}>Create Budget</Text>
        </Pressable>
        
        <Text style={styles.helpText}>
          💡 Tip: Set a realistic budget based on your monthly income and expenses
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    color: '#6B7280',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: 16,
    color: '#1F2937',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});