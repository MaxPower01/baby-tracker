import { TimePeriodId } from "@/enums/TimePeriodId";

export function getLimitForTimePeriod(timePeriod: TimePeriodId) {
  switch (timePeriod) {
    case TimePeriodId.Last24Hours:
      return 1;
    case TimePeriodId.Last2Days:
      return 2;
    case TimePeriodId.Last7Days:
      return 7;
    case TimePeriodId.Last14Days:
      return 14;
    case TimePeriodId.Last30Days:
      return 30;
    case TimePeriodId.Last3Months:
      return 90;
    case TimePeriodId.Last6Months:
      return 180;
    case TimePeriodId.ThisYear:
      return 365;
    case TimePeriodId.AllTime:
    case TimePeriodId.Custom:
    default:
      return null;
  }
}
