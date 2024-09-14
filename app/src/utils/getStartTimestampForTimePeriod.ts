import { TimePeriodId } from "@/enums/TimePeriodId";
import { getDaysCountForTimePeriod } from "@/pages/Charts/utils/getDaysCountForTimePeriod";
import { getTimestamp } from "@/utils/getTimestamp";

export function getStartTimestampForTimePeriod(timePeriodId: TimePeriodId) {
  const nowTimestamp = getTimestamp(new Date());
  const dayInSeconds = 60 * 60 * 24;

  // We add 1 day to the timestamp to make sure the oldest date is included in the range.
  // This is because the stored entries use UTC time, so the date might be off by a few hours.

  return (
    nowTimestamp - dayInSeconds * (getDaysCountForTimePeriod(timePeriodId) + 1)
  );
}
