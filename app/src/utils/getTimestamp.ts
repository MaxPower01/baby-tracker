/**
  * Returns the timestamp of a given date in seconds.
*/
export function getTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
