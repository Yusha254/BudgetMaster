import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

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
  `);
}

// Add this to data/database.ts
export async function insertTransaction({
  code,
  amount,
  cost,
  date,
  time,
  isIncome,
  name,
  category = '',
}: {
  code: string;
  amount: number;
  cost: number;
  date: string;
  time: string;
  isIncome: boolean | null;
  name: string;
  category?: string;
}) {
  const db = getDb();
  await db.runAsync(
    `
    INSERT INTO transactions 
    (code, amount, cost, date, time, isIncome, name, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    code,
    amount,
    cost,
    date,
    time,
    isIncome,
    name,
    category
  );

  console.log('Transaction inserted successfully!');
}


export function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
