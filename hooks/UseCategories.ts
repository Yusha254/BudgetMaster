import { useEffect, useMemo, useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { getPeriodRange } from '../utils/AnalyticsUtils';

interface UseCategoriesParams {
  isIncome: boolean;
  range?: 'Day' | 'Week' | 'Month' | 'Year';
  periodStart?: string;
  periodEnd?: string;
}

interface CategoryData {
  name: string;
  amount: number;
}

export function useCategories({
  isIncome,
  range = 'Month',
  periodStart,
  periodEnd,
}: UseCategoriesParams): CategoryData[] {
  const { transactions } = useTransactionContext();
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    const { startDate, endDate } = getPeriodRange(range);

    const start = periodStart ?? startDate;
    const end = periodEnd ?? endDate;

    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return (
        Boolean(tx.isIncome) === isIncome &&
        new Date(start) <= txDate &&
        txDate <= new Date(end)
      );
    });

    const grouped: Record<string, number> = {};
    for (const tx of filtered) {
      const category = tx.category || 'Uncategorized';
      grouped[category] = (grouped[category] || 0) + tx.amount;
    }

    const result = Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .filter(d => d.amount > 0);

    setData(result);
  }, [transactions, isIncome, range, periodStart, periodEnd]); // ✅ list all dependencies

  return data;
}

