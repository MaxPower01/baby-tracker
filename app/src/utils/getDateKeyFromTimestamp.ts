import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getDateKeyFromDate } from "@/utils/getDateKeyFromDate";

/**
 * Returns a string key for a date in the format 'YYYY-MM-DD'. The key uses UTC time.
 * @param timestamp A Unix timestamp in seconds.
 */
export function getDateKeyFromTimestamp(timestamp: number): string {
  const date = getDateFromTimestamp(timestamp);
  return getDateKeyFromDate(date);
}
