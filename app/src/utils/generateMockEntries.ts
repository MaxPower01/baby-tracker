import EntryModel from "@/pages/Entries/models/EntryModel";
import { TimePeriod } from "@/enums/TimePeriod";

/**
 * Generates mock entries for the given time period, starting from today.
 * @param params
 * @returns
 */
export default function generateMockEntries(params: {
  timePeriod: TimePeriod;
}): EntryModel[] {
  const result: EntryModel[] = [];

  let days = 0;

  switch (params.timePeriod) {
    case TimePeriod.TwoDays:
      days = 2;
      break;
    case TimePeriod.Week:
      days = 7;
      break;
    case TimePeriod.TwoWeeks:
      days = 7 * 2;
      break;
    case TimePeriod.Month:
      days = 7 * 4;
      break;
    case TimePeriod.Day:
    default:
      days = 1;
      break;
  }

  if (days === 0) {
    return result;
  }

  const hours = days * 24;

  const until = new Date();
  const from = new Date();
  from.setHours(from.getHours() - hours);

  for (let i = 0; i < hours; i++) {
    const date = new Date(until);
    date.setHours(date.getHours() - i);
    const entry = EntryModel.createMock({
      startDate: date,
    });
  }

  return result;
}
