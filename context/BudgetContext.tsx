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
    const [budget, setBudget] = useState<Budget | null>(null);
    const [loading, setLoading] = useState(true);
  
    const fetchBudget = useCallback(
      async (targetMonth?: string, targetYear?: number) => {
        setLoading(true);
        try {
          const db = getDb();
    
          const now = new Date();
          const month = targetMonth ?? now.toLocaleString('default', { month: 'long' });
          const year = targetYear ?? now.getFullYear();
    
          // Get the budget for the specified month and year
          const budget = await db.getFirstAsync<Budget>(
            'SELECT * FROM budgets WHERE month = ? AND year = ?',
            [month, year]
          );
    
          if (budget) {
            // Format the numeric month string for SQLite comparison
            const monthIndex = getMonthIndexFromName(month);
            if (monthIndex === -1) {
              console.error('❌ Invalid month name:', month);
              setLoading(false);
              return;
            }
            const paddedMonth = String(monthIndex + 1).padStart(2, '0');
            console.log('🧠 paddedMonth:', paddedMonth);
            console.log('🧠 year:', year);
            

            // Calculate total spent in this month (expenses only)
            const { total } = await db.getFirstAsync<{ total: number }>(
              `SELECT SUM(amount) as total 
               FROM transactions 
               WHERE isIncome = 0 
               AND strftime('%m', date(date)) = ? 
               AND strftime('%Y', date(date)) = ?`,
              [paddedMonth, String(year)]
            ) ?? { total: 0 };
    
            const spent = total ?? 0;
    
            // Update the budget's spentAmount
            await db.runAsync(
              'UPDATE budgets SET spentAmount = ? WHERE id = ?',
              [spent, budget.id]
            );
    
            // Set context
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
      []
    );
    
    
    const deleteBudget = async () => {
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
      fetchBudget();
    }, [fetchBudget]);
  
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
  