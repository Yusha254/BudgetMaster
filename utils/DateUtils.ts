export const getCurrentMonth = () => {
  return new Date().toLocaleString('default', { month: 'long' }); // returns "June"
};


export function getCurrentYear(): number {
    return new Date().getFullYear();
  }

export function convertToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    // Ensure leading zeroes and convert year properly
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    const fullYear = year.length === 2 ? `20${year}` : year;
  
    return `${fullYear}-${paddedMonth}-${paddedDay}`; // e.g. "2025-06-27"
}
  

export function getMonthIndexFromName(monthName: string): number {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return monthNames.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
}

export function isPastMonth(monthIndex: number, year: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return year < currentYear || (year === currentYear && monthIndex < currentMonth);
}
