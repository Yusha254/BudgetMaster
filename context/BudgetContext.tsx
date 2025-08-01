// context/BudgetContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { getDb } from '../data/Database';
import { getCurrentMonth, getCurrentYear, getMonthIndexFromName } from '../utils/DateUtils';
import { DatabaseReadyContext } from './DatabaseProvider';

export type Budget = {
  id: number;
  month: string;
  year: number;
  totalAmount: number;
  spentAmount: number;
};

interface BudgetContextType {
  budget: Budget | null;
  loading: boolean;
  refresh: (month?: string, year?: number) => void;
  deleteBudget: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const isDbReady = useContext(DatabaseReadyContext);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBudget = useCallback(
    async (targetMonth?: string, targetYear?: number) => {
      if (!isDbReady) return;

      setLoading(true);
      try {
        const db = getDb();
        const now = new Date();
        const month = targetMonth ?? now.toLocaleString('default', { month: 'long' });
        const year = targetYear ?? now.getFullYear();

        const budget = await db.getFirstAsync<Budget>(
          'SELECT * FROM budgets WHERE month = ? AND year = ?',
          [month, year]
        );

        if (budget) {
          const monthIndex = getMonthIndexFromName(month);
          if (monthIndex === -1) {
            console.error('❌ Invalid month name:', month);
            setLoading(false);
            return;
          }

          const paddedMonth = String(monthIndex + 1).padStart(2, '0');

          const { total } = await db.getFirstAsync<{ total: number }>(
            `SELECT SUM(amount) as total 
             FROM transactions 
             WHERE isIncome = 0 
             AND strftime('%m', date(date)) = ? 
             AND strftime('%Y', date(date)) = ?`,
            [paddedMonth, String(year)]
          ) ?? { total: 0 };

          const spent = total ?? 0;

          await db.runAsync(
            'UPDATE budgets SET spentAmount = ? WHERE id = ?',
            [spent, budget.id]
          );

          const updatedBudget = {
            ...budget,
            spentAmount: spent,
          };

          setBudget(updatedBudget);
          console.log('✅ Budget context refreshed:', updatedBudget);
        } else {
          setBudget(null);
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
        setBudget(null);
      } finally {
        setLoading(false);
      }
    },
    [isDbReady]
  );

  const deleteBudget = async () => {
    if (!isDbReady) return;

    try {
      const db = getDb();
      const month = getCurrentMonth();
      const year = getCurrentYear();
      await db.runAsync('DELETE FROM budgets WHERE month = ? AND year = ?', [
        month,
        year,
      ]);
      setBudget(null);
      console.log('✅ Budget deleted');
    } catch (error) {
      console.error('❌ Failed to delete budget:', error);
    }
  };

  useEffect(() => {
    if (isDbReady) {
      fetchBudget();
    }
  }, [isDbReady, fetchBudget]);

  return (
    <BudgetContext.Provider
      value={{ budget, loading, refresh: fetchBudget, deleteBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export function useBudgetContext() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
}
