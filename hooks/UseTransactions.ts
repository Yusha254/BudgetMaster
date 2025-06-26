// hooks/useTransactions.ts
import { useEffect, useState, useCallback } from 'react';
import { getDb } from '../data/Database';

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

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const db = getDb();
      const rows = await db.getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY id DESC');
      setTransactions(rows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, refetch: fetchTransactions };
}