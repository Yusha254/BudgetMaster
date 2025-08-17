import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Text, View, Pressable, useThemeColor } from './Themed';
import ThemedIcon from './Themed';
import { useBudgetContext } from '../context/BudgetContext';
import { LinearGradient } from 'expo-linear-gradient';

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
  
  const primary = useThemeColor({}, 'primary');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const surface = useThemeColor({}, 'surface');
  const shadow = useThemeColor({}, 'shadow');

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

  const remainingAmount = currentBudget ? currentBudget.totalAmount - currentBudget.spentAmount : 0;
  const progressPercentage = currentBudget ? (currentBudget.spentAmount / currentBudget.totalAmount) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: surface, shadowColor: shadow }]}>
      {/* Month Navigator */}
      <View style={styles.monthNavigator}>
        <Pressable onPress={goToPreviousMonth} style={styles.navButton}>
          <ThemedIcon name="angle-left" size={24} />
        </Pressable>
        <Text style={styles.monthText}>
          {monthNames[selectedMonthIndex]} {selectedYear}
        </Text>
        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <ThemedIcon name="angle-right" size={24} />
        </Pressable>
      </View>

      {/* Budget Display */}
      {currentBudget && (
        <View style={styles.budgetCard}>
          <View style={styles.amountSection}>
            <Text style={styles.remainingLabel}>Remaining Budget</Text>
            <Text style={[styles.remainingAmount, { color: remainingAmount >= 0 ? '#10B981' : '#EF4444' }]}>
              Ksh {Math.abs(remainingAmount).toLocaleString()}
            </Text>
            {remainingAmount < 0 && (
              <Text style={styles.overbudgetText}>Over Budget</Text>
            )}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: primaryLight }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: progressPercentage > 100 ? '#EF4444' : primary
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressPercentage.toFixed(0)}% used
            </Text>
          </View>

          {/* Budget Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Budget</Text>
              <Text style={styles.statValue}>Ksh {currentBudget.totalAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Spent</Text>
              <Text style={styles.statValue}>Ksh {currentBudget.spentAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable onPress={handleEdit} style={[styles.actionButton, { backgroundColor: primaryLight }]}>
              <ThemedIcon name="edit" size={18} />
              <Text style={[styles.actionText, { color: primary }]}>Edit</Text>
            </Pressable>
            <Pressable onPress={handleDelete} style={[styles.actionButton, { backgroundColor: '#FEE2E2' }]}>
              <ThemedIcon name="trash" size={18} />
              <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  monthNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 24,
    textAlign: 'center',
  },
  budgetCard: {
    gap: 20,
  },
  amountSection: {
    alignItems: 'center',
  },
  remainingLabel: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 8,
  },
  remainingAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  overbudgetText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});