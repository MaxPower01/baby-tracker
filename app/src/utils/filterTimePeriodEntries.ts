import { Entry } from "@/pages/Entry/types/Entry";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";

export function filterTimePeriodEntries(
  entries: Entry[],
  timePeriod: TimePeriodId
): Entry[] {
  try {
    if (!entries || !entries.length) {
      return [];
    }
    const startTimestamp = getStartTimestampForTimePeriod(timePeriod);
    return entries.filter((entry) => entry.startTimestamp >= startTimestamp);
  } catch (error) {
    console.error("Error filtering entries by time period", error);
    return [];
  }
}
