/**
 * Returns a timestamp that corresponds to the start of the day in UTC time.
 * @param dateKey A string key for a date in the format 'YYYY-MM-DD'.
 */
export function getTimestampFromDateKey(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return Math.floor(date.getTime() / 1000);
}
