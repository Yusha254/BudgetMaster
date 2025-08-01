import { getDb } from '../data/Database';

export async function categorizeTransaction(name: string): Promise<string> {
  const db = getDb();
  const lowered = name.toLowerCase();

  // First: Check user-defined rules
  const rules = await db.getAllAsync<{ keyword: string; category: string }>(
    'SELECT keyword, category FROM categorization_rules'
  );

  for (let rule of rules) {
    if (lowered.includes(rule.keyword.toLowerCase())) {
      return rule.category;
    }
  }

  // Fallback: Just use the name itself
  return name;
}
