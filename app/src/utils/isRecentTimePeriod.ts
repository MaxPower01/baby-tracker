import { TimePeriodId } from "@/enums/TimePeriodId";

export function isRecentTimePeriod(timePeriodId: TimePeriodId) {
  switch (timePeriodId) {
    case TimePeriodId.Last24Hours:
    case TimePeriodId.Last2Days:
      return true;
    case TimePeriodId.Last7Days:
    case TimePeriodId.Last14Days:
    case TimePeriodId.Last30Days:
    case TimePeriodId.Last3Months:
    case TimePeriodId.Last6Months:
    case TimePeriodId.ThisYear:
    case TimePeriodId.AllTime:
    case TimePeriodId.Custom:
    default:
      return false;
  }
}
