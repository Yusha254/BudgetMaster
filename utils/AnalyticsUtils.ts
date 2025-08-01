import { getDb } from '../data/Database';

interface CategoryData {
  category: string | null;
  total: number;
}

interface Options {
  isIncome: boolean;
  periodStart?: string;
  periodEnd?: string;
}

export function getSpendingByCategory({ isIncome, periodStart, periodEnd }: Options): CategoryData[] {
  const db = getDb();

  let query = `
    SELECT category, SUM(amount) as total
    FROM transactions
    WHERE isIncome = ?
  `;
  const params: (string | number)[] = [isIncome ? 1 : 0];

  if (periodStart && periodEnd) {
    query += ' AND date BETWEEN ? AND ?';
    params.push(periodStart, periodEnd);
  }

  query += ' GROUP BY category';

  try {
    const result = db.getAllSync<CategoryData>(query, params);
    return result;
  } catch (error) {
    console.error('getSpendingByCategory error:', error);
    return [];
  }
}




export function getPeriodRange(range: 'Day' | 'Week' | 'Month' | 'Year') {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
  
    switch (range) {
      case 'Day':
        break;
      case 'Week':
        start.setDate(now.getDate() - now.getDay());
        end.setDate(start.getDate() + 6);
        break;
      case 'Month':
        start.setDate(1);
        end.setMonth(now.getMonth() + 1, 0);
        break;
      case 'Year':
        start.setMonth(0, 1);
        end.setMonth(11, 31);
        break;
    }
  
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }
  
