import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { getDateFromTimestamp } from "@/utils/getDateFromTimestamp";
import { getStartTimestampForTimePeriod } from "@/utils/getStartTimestampForTimePeriod";

export function getDates(
  timePeriod: TimePeriodId,
  barsCount: number,
  xAxisUnit: XAxisUnit
) {
  const startTimestamp = getStartTimestampForTimePeriod(timePeriod);
  const startDate = getDateFromTimestamp(startTimestamp);
  startDate.setHours(0, 0, 0, 0);

  const dates: Date[] = [];

  const now = new Date();
  now.setMinutes(0, 0, 0);

  if (xAxisUnit === "days") {
    dates.push(now);
    for (let i = barsCount - 1; i >= 1; i--) {
      const newDate = new Date();
      newDate.setDate(now.getDate() - i);
      newDate.setHours(0, 0, 0, 0);
      dates.unshift(newDate);
    }
  } else {
    for (let i = barsCount - 1; i >= 1; i--) {
      const newDate = new Date();
      newDate.setHours(now.getHours() - i, 0, 0, 0);
      dates.unshift(newDate);
    }
  }

  return dates;
}
