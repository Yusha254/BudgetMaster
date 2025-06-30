import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Text, View, Pressable } from './Themed';
import ThemedIcon from './Themed';
import { useBudgetContext } from '../context/BudgetContext';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Props = {
  selectedMonthIndex: number;
  setSelectedMonthIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
};

export default function BudgetHeader({
  selectedMonthIndex,
  setSelectedMonthIndex,
  selectedYear,
  setSelectedYear,
}: Props) {
  const { budget, deleteBudget, refresh } = useBudgetContext();
  const [currentBudget, setCurrentBudget] = useState(budget);

  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();

  useEffect(() => {
    setCurrentBudget(budget);
  }, [budget]);

  const handleDelete = () => {
    Alert.alert('Delete Budget', "Are you sure you want to delete this month's budget?", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: deleteBudget },
    ]);
  };

  const handleEdit = () => {
    Alert.alert('Edit Budget', 'Editing not yet implemented.');
  };

  const goToPreviousMonth = () => {
    if (selectedMonthIndex === 0) {
      const newYear = selectedYear - 1;
      setSelectedMonthIndex(11);
      setSelectedYear(newYear);
    } else {
      setSelectedMonthIndex(selectedMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    const isCurrentOrFuture =
      selectedYear < currentYear ||
      (selectedYear === currentYear && selectedMonthIndex < currentMonthIndex);

    if (isCurrentOrFuture) {
      if (selectedMonthIndex === 11) {
        const newYear = selectedYear + 1;
        setSelectedMonthIndex(0);
        setSelectedYear(newYear);
      } else {
        setSelectedMonthIndex(selectedMonthIndex + 1);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Only show amount if budget exists */}
      {currentBudget && (
        <Text style={styles.amount}>
          Ksh {(currentBudget.totalAmount - currentBudget.spentAmount).toLocaleString()} left
        </Text>
      )}

      {/* Always show month navigator */}
      <View style={styles.row}>
        <Pressable onPress={goToPreviousMonth}>
          <ThemedIcon name="angle-left" size={20} />
        </Pressable>
        <Text style={styles.month}>
          {monthNames[selectedMonthIndex]} {selectedYear}
        </Text>
        <Pressable onPress={goToNextMonth}>
          <ThemedIcon name="angle-right" size={20} />
        </Pressable>
      </View>

      {/* Show edit/delete if budget exists */}
      {currentBudget && (
        <View style={styles.actions}>
          <Pressable onPress={handleEdit}>
            <ThemedIcon name="edit" size={18} />
          </Pressable>
          <Pressable onPress={handleDelete}>
            <ThemedIcon name="trash" size={18} />
          </Pressable>
        </View>
      )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  month: {
    fontSize: 24,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
});
