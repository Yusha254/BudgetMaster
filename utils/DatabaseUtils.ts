import { getDb } from '../data/Database';
import { ParsedTransaction, ParsedFuliza } from './MpesaParser';

export const insertTransactionFromParsed = async (
  parsed: ParsedTransaction | ParsedFuliza
): Promise<boolean> => {
  const db = getDb();

  try {
    if ('isIncome' in parsed) {
      // Check for existing transaction
      const existing = await db.getFirstAsync(
        `SELECT 1 FROM transactions WHERE code = ?`,
        [parsed.code]
      );

      if (existing) {
        console.log(`Transaction ${parsed.code} already exists. Skipping.`);
        return false;
      }

      // Insert new transaction
      await db.runAsync(
        `INSERT INTO transactions (code, amount, cost, date, time, isIncome, name, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parsed.code,
          parsed.amount,
          parsed.cost,
          parsed.date,
          parsed.time,
          parsed.isIncome ? 1 : 0,
          parsed.name,
          parsed.category,
        ]
      );
    } else {
      // Check for existing debt
      const existing = await db.getFirstAsync(
        `SELECT 1 FROM debts WHERE transactionCode = ?`,
        [parsed.transactionCode]
      );

      if (existing) {
        console.log(`Debt for transaction ${parsed.transactionCode} already exists. Skipping.`);
        return false;
      }

      // Insert new debt
      await db.runAsync(
        `INSERT INTO debts (transactionCode, amount, interest, dueDate)
         VALUES (?, ?, ?, ?)`,
        [
          parsed.transactionCode,
          parsed.amount,
          parsed.interest,
          parsed.dueDate,
        ]
      );
    }

    return true; // ✅ Successful insert
  } catch (err) {
    console.error('Insert failed:', err);
    return false;
  }
};
