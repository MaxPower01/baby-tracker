import { TimePeriodId } from "@/enums/TimePeriodId";
import { getTimestamp } from "@/utils/getTimestamp";

export function getStartTimestampForTimePeriod(timePeriodId: TimePeriodId) {
  const nowTimestamp = getTimestamp(new Date());
  const dayInSeconds = 60 * 60 * 24;

  switch (timePeriodId) {
    case TimePeriodId.Last2Days:
      return nowTimestamp - dayInSeconds * 2;
    case TimePeriodId.Last7Days:
      return nowTimestamp - dayInSeconds * 7;
    case TimePeriodId.Last14Days:
      return nowTimestamp - dayInSeconds * 14;
    case TimePeriodId.Last30Days:
      return nowTimestamp - dayInSeconds * 30;
    case TimePeriodId.Last3Months:
      return nowTimestamp - dayInSeconds * 90;
    case TimePeriodId.Last6Months:
      return nowTimestamp - dayInSeconds * 180;
    case TimePeriodId.ThisYear:
      return nowTimestamp - dayInSeconds * 365;
    case TimePeriodId.AllTime:
      return 0;
    case TimePeriodId.Custom:
    case TimePeriodId.Today:
    default:
      return nowTimestamp - dayInSeconds;
  }
}
