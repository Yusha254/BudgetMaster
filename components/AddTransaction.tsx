import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Text, TextInput, View, Pressable, useThemeColor } from './Themed';
import { insertTransaction, insertDebt } from '../data/Database';
import { useBudgetContext } from '../context/BudgetContext';
import { useTransactionContext } from '../context/TransactionContext';
import { updateSpentAmountForCurrentMonth } from '../utils/BudgetUtils';
import { parseMpesaMessage } from '../utils/MpesaParser';
  
type Props = {
  onAdd?: () => void;
};

export default function AddTransaction({ onAdd }: Props) {
  const [smsText, setSmsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refetch } = useTransactionContext();
  const { refresh } = useBudgetContext();
  
  const surface = useThemeColor({}, 'surface');
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const shadow = useThemeColor({}, 'shadow');
  const outline = useThemeColor({}, 'outline');

  const handleParse = async () => {
    if (!smsText.trim()) {
      Alert.alert('Empty Message', 'Please paste an M-Pesa SMS message.');
      return;
    }

    setIsLoading(true);
    try {
      const parsed = await parseMpesaMessage(smsText);

      if (!parsed) {
        Alert.alert('Invalid Format', 'This doesn\'t appear to be a valid M-Pesa SMS message.');
        return;
      }

      if (parsed.type === 'transaction') {
        await insertTransaction(parsed);
        if (!parsed.isIncome) {
          await updateSpentAmountForCurrentMonth();
        }
        await refresh();
        await refetch();
        Alert.alert('Success', 'Transaction added successfully! 🎉');
      } else if (parsed.type === 'fuliza') {
        await insertDebt(parsed);
        Alert.alert('Success', 'Fuliza debt recorded successfully! 📝');
      }

      setSmsText('');
      onAdd?.();
    } catch (error) {
      console.error('❌ Failed to parse and insert:', error);
      Alert.alert('Error', 'Failed to process the transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: surface, shadowColor: shadow }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>📱</Text>
        <View>
          <Text style={styles.title}>Add M-Pesa Transaction</Text>
          <Text style={styles.subtitle}>Paste your M-Pesa SMS to add automatically</Text>
        </View>
      </View>

      <View style={[styles.inputContainer, { borderColor: outline }]}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste your M-Pesa SMS here...&#10;&#10;Example: TF59OY0GY1 Confirmed. Ksh300.00 sent to JOHN DOE..."
          value={smsText}
          onChangeText={setSmsText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <Pressable 
        style={[
          styles.button, 
          { 
            backgroundColor: isLoading ? primaryLight : primary,
            opacity: isLoading ? 0.7 : 1 
          }
        ]} 
        onPress={handleParse}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Processing...' : 'Add Transaction'}
        </Text>
      </Pressable>

      <Text style={styles.helpText}>
        💡 Copy the SMS from your messages app and paste it above
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  input: {
    minHeight: 120,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  helpText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});