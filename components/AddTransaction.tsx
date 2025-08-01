// components/AddTransactionBox.tsx

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, View, Pressable } from './Themed';
import { insertTransaction, insertDebt } from '../data/Database';
import { useBudgetContext } from '../context/BudgetContext';
import { useTransactionContext } from '../context/TransactionContext';
import { convertToISO } from '../utils/DateUtils';
import { updateSpentAmountForCurrentMonth } from '../utils/BudgetUtils';
import { categorizeTransaction } from '../utils/CategorizationUtils';
import { formatName } from '../utils/StringUtils';
import { parseMpesaMessage } from '../utils/MpesaParser';
  
type Props = {
  onAdd?: () => void; // ✅ optional refresh callback
};

export default function AddTransaction({ onAdd }: Props) {
  const [smsText, setSmsText] = useState('');
  const { refetch } = useTransactionContext();
  const { refresh } = useBudgetContext();

  const handleParse = async () => {
    try {
      const parsed = await parseMpesaMessage(smsText);

      if (!parsed) {
        console.warn('Message format not recognized.');
        return;
      }

      if (parsed.type === 'transaction') {
        await insertTransaction(parsed);
      if (!parsed.isIncome) {
        await updateSpentAmountForCurrentMonth();
      }
      await refresh();
      await refetch();
      console.log('✅ Transaction inserted successfully');
    } else if (parsed.type === 'fuliza') {
      await insertDebt(parsed);
      console.log('✅ Fuliza debt recorded successfully');
    }

    setSmsText('');
    onAdd?.();
  } catch (error) {
    console.error('❌ Failed to parse and insert:', error);
  }
};

  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paste MPesa SMS</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="e.g. TF59OY0GY1 Confirmed. Ksh300.00 sent to..."
        value={smsText}
        onChangeText={setSmsText}
      />

      <Pressable style={styles.button} onPress={handleParse}>
        <Text style={styles.buttonText}>Add Transaction</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    minHeight: 100,
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    marginBottom: 4,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
