import { TimePeriodId } from "@/enums/TimePeriodId";

export function getHoursCountForTimePeriod(timePeriod: TimePeriodId): number {
  switch (timePeriod) {
    case TimePeriodId.Today:
      return 24;
    case TimePeriodId.Last2Days:
      return 24 * 2;
    case TimePeriodId.Last7Days:
      return 24 * 7;
    case TimePeriodId.Last14Days:
      return 24 * 14;
    case TimePeriodId.Last30Days:
      return 24 * 30;
    case TimePeriodId.Last3Months:
      return 24 * 30 * 3;
    case TimePeriodId.Last6Months:
      return 24 * 30 * 6;
    case TimePeriodId.ThisYear:
      return 24 * 365;
    case TimePeriodId.AllTime:
    case TimePeriodId.Custom:
    default:
      return 0;
  }
}
