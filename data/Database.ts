import * as SQLite from 'expo-sqlite';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';
import { ParsedTransaction, ParsedFuliza } from '../utils/MpesaParser';

let db: SQLiteDatabase | null = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync('budgetmaster.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY NOT NULL,
      code TEXT NOT NULL,
      amount REAL NOT NULL,
      cost REAL,
      date TEXT,
      time TEXT,
      isIncome INTEGER,
      name TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY NOT NULL,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      totalAmount REAL NOT NULL,
      spentAmount REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categorization_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transactionCode TEXT,
      amount REAL,
      interest REAL,
      totalAmount REAL,
      dueDate TEXT,
      createdAt TEXT
);

  `);
}

// Add this to data/database.ts
export async function insertTransaction(transaction: ParsedTransaction) {
  const db = getDb();
  await db.runAsync(
    `
    INSERT INTO transactions 
    (code, amount, cost, date, time, isIncome, name, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    transaction.code,
    transaction.amount,
    transaction.cost,
    transaction.date,
    transaction.time,
    transaction.isIncome,
    transaction.name,
    transaction.category ?? ''
  );

  console.log('Transaction inserted successfully!');
}

export async function insertBudget(budget: {
  month: string;
  year: number;
  totalAmount: number;
  spentAmount: number;
}) {
  const db = getDb();
  await db.runAsync(
    `
    INSERT INTO budgets (month, year, totalAmount, spentAmount)
    VALUES (?, ?, ?, ?)
  `,
    [budget.month, budget.year, budget.totalAmount, budget.spentAmount]
  );
}

export async function insertDebt(debt: ParsedFuliza) {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO debts (transactionCode, totalAmount, interest, dueDate)
     VALUES (?, ?, ?, ?)`,
    [debt.transactionCode, debt.amount, debt.interest, debt.dueDate]
  );
}


export async function calculateMonthlySpending(): Promise<number> {
  const db = getDb();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const result = await db.getFirstAsync<{ total: number }>(
    `
    SELECT SUM(amount) as total
    FROM transactions
    WHERE isIncome = 0 AND strftime('%m', date) = ? AND strftime('%Y', date) = ?
    `,
    [month.toString().padStart(2, '0'), year.toString()]
  );

  return result?.total ?? 0;
}


export function getDb(): SQLiteDatabase {
  if (!db) {
    db = openDatabaseSync('budgetmaster.db'); // Correct method
    console.log('✅ SQLite database opened');
  }
  return db;
}