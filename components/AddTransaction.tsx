// components/AddTransactionBox.tsx

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, View, Pressable } from './Themed';
import { insertTransaction } from '../data/Database';

type Props = {
  onAdd?: () => void; // ✅ optional refresh callback
};

export default function AddTransaction({ onAdd }: Props) {
  const [smsText, setSmsText] = useState('');

  const handleParse = async () => {
    try {
      const message = smsText;
  
      const transactionCodeRegex = /^([A-Z0-9]+)\s+Confirmed\./i;
      const amountRegex = /Ksh([\d,]+\.\d{2})/i;
      const costRegex = /Transaction cost,\s*Ksh([\d,]+\.\d{2})/i;
      const dateTimeRegex = /on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+([\d:]+(?:\s*[APMapm]{2})?)/;
      const incomeNameRegex = /from\s+([A-Z\s]+?)(?=\s*\d{10}| on)/i;
      const expenseNameRegex = /(?:sent to|paid to)\s+([A-Z\s]+?)(?=\s*\d{10}|\.| on)/i;
  
      const transactionCode = message.match(transactionCodeRegex)?.[1] || 'N/A';
      const amount = parseFloat((message.match(amountRegex)?.[1] || '0').replace(/,/g, ''));
      const transactionCost = parseFloat((message.match(costRegex)?.[1] || '0').replace(/,/g, ''));
      const dateTimeMatch = message.match(dateTimeRegex);
      const date = dateTimeMatch?.[1] || 'N/A';
      const time = dateTimeMatch?.[2] || 'N/A';
  
      let isIncome = null;
      if (/you have received/i.test(message)) {
        isIncome = true;
      } else if (/sent to|paid to/i.test(message)) {
        isIncome = false;
      }
  
      const name =
        isIncome === true
          ? message.match(incomeNameRegex)?.[1]?.trim() || 'N/A'
          : isIncome === false
          ? message.match(expenseNameRegex)?.[1]?.trim() || 'N/A'
          : 'N/A';
  
      // ✅ Log parsed values
      console.log('Parsed Transaction Details:');
      console.log('Transaction Code:', transactionCode);
      console.log('Amount:', amount);
      console.log('Transaction Cost:', transactionCost);
      console.log('Date:', date);
      console.log('Time:', time);
      console.log('Type:', isIncome === true ? 'Income' : isIncome === false ? 'Expense' : 'Unknown');
      console.log('Name:', name);
  
      // ✅ Insert into the database
      await insertTransaction({
        code: transactionCode,
        amount,
        cost: transactionCost,
        date,
        time,
        isIncome: isIncome,
        name,
        category: '', // optional for now
      });
  
      console.log('✅ Transaction inserted successfully');
      setSmsText('');
      onAdd?.(); // ✅ call the optional refresh callback if provided
    } catch (error) {
      console.error('❌ Failed to parse and insert transaction:', error);
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
