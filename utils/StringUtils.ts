export function formatName(name: string): string {
  if (!name) return 'N/A';

  // Remove trailing parts like 'for account 254...'
  const cleaned = name
    .replace(/\s*(for account|till number|account number|no\.)\s*.*$/i, '')
    .trim();

  // Capitalize each word
  const capitalized = cleaned
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());

  return capitalized;
}
