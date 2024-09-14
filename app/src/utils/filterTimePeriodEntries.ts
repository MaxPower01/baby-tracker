import { Entry } from "@/pages/Entry/types/Entry";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";
import { isSameDayOrLater } from "@/utils/isSameDayOrLater";

export function filterTimePeriodEntries(
  entries: Entry[],
  timePeriod: TimePeriodId
): Entry[] {
  try {
    if (!entries || !entries.length) {
      return [];
    }
    const timePeriodStartTimestamp = getStartTimestampForTimePeriod(timePeriod);
    const timePeriodStartDate = getDateFromTimestamp(timePeriodStartTimestamp);
    return entries.filter((entry) => {
      const entryStartDate = getDateFromTimestamp(entry.startTimestamp);
      entryStartDate.setHours(0, 0, 0, 0);
      return isSameDayOrLater({
        targetDate: entryStartDate,
        comparisonDate: timePeriodStartDate,
      });
    });
  } catch (error) {
    console.error("Error filtering entries by time period", error);
    return [];
  }
}
