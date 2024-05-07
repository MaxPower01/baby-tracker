export function getDateFromTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}
