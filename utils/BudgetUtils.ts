import { getDb } from '../data/Database';
import { getCurrentMonth, getCurrentYear } from './DateUtils';

export async function updateSpentAmountForCurrentMonth() {
  const db = getDb();
  const month = getCurrentMonth();
  const year = getCurrentYear();

  // 1. Sum all expenses this month
  const { total } = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(amount) as total FROM transactions
     WHERE isIncome = 0 AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
    [String(new Date().getMonth() + 1).padStart(2, '0'), String(year)]
  ) ?? { total: 0 };

  // 2. Update the budget
  await db.runAsync(
    `UPDATE budgets SET spentAmount = ? WHERE month = ? AND year = ?`,
    [total ?? 0, month, year]
  );
}
