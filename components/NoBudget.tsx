import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View, Text, TextInput, Pressable } from './Themed';
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

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' }); // e.g. "June"
    const currentYear = now.getFullYear();

    setMonth(currentMonth);
    setYear(currentYear);
  }, []);

  const handleCreateBudget = async () => {
    console.log('Button Pressed');
    
    const parsedAmount = parseFloat(amount);
  
    if (!month || !year || isNaN(parsedAmount)) {
      Alert.alert('Invalid input', 'Please enter a valid amount.');
      return;
    }
  
    try {
      await insertBudget({
        month,
        year,
        totalAmount: parsedAmount,
        spentAmount: 0,
      });
  
      console.log('✅ Budget inserted into DB');
  
      await refresh(); // ensure context updates before UI continues
  
      onCreate?.(); // still optional but safe
  
      console.log('✅ Budget context refreshed');
  
    } catch (error) {
      console.error('❌ Failed to insert budget:', error);
      Alert.alert('Error', 'Could not create budget.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Budget for {month} {year}</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Enter total budget amount"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <Pressable onPress={handleCreateBudget} style={styles.button}>
        <Text style={styles.buttonText}>Save Budget</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    margin: 16
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
