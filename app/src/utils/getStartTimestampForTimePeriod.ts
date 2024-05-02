import { TimePeriodId } from "@/enums/TimePeriodId";
import { getTimestamp } from "@/utils/getTimestamp";

export function getStartTimestampForTimePeriod(timePeriodId: TimePeriodId) {
  const nowTimestamp = getTimestamp(new Date());
  const dayInSeconds = 60 * 60 * 24;

  switch (timePeriodId) {
    case TimePeriodId.AllTime:
      return 0;
    case TimePeriodId.Today:
      return nowTimestamp - dayInSeconds;
    case TimePeriodId.Last2Days:
      return nowTimestamp - dayInSeconds * 2;
    case TimePeriodId.Last7Days:
      return nowTimestamp - dayInSeconds * 7;
    case TimePeriodId.Last14Days:
      return nowTimestamp - dayInSeconds * 14;
    case TimePeriodId.Last30Days:
      return nowTimestamp - dayInSeconds * 30;
    default:
      return 0;
  }
}
