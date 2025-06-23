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

export function getDb() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
