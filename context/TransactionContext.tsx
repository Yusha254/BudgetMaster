// context/TransactionContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { getDb } from '../data/Database';
import { DatabaseReadyContext } from './DatabaseProvider';

export type Transaction = {
  id: number;
  code: string;
  amount: number;
  cost: number;
  date: string;
  time: string;
  isIncome: boolean | null;
  name: string;
  category: string;
};

type TransactionContextType = {
  transactions: Transaction[];
  loading: boolean;
  refetch: () => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const isDbReady = useContext(DatabaseReadyContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!isDbReady) return;

    setLoading(true);
    try {
      const db = getDb();
      const rows = await db.getAllAsync<Transaction>(
        'SELECT * FROM transactions ORDER BY id DESC'
      );
      setTransactions(rows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [isDbReady]);

  useEffect(() => {
    if (isDbReady) {
      fetchTransactions();
    }
  }, [isDbReady, fetchTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, refetch: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within TransactionProvider');
  }
  return context;
}
