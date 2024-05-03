/**
 * Returns a string key for a date in the format 'YYYY-MM-DD'. The key uses UTC time, so the date object is adjusted to UTC time before extracting the key.
 * @param date A date object adjusted to the local timezone of the running environment.
 */
export function getDateKeyFromDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}
