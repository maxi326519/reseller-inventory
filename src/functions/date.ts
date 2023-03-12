export function getFirstAndLastDayOfMonth(date: Date): { firstDay: string, lastDay: string } {
  const year: number = date.getFullYear();
  const month: number = date.getMonth();

  // Get first day of the month
  const firstDay = new Date(year, month, 1).toISOString().substr(0, 10);

  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0).toISOString().substr(0, 10);

  return { firstDay, lastDay };
}