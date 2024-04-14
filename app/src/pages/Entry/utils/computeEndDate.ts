import dayjs from "dayjs";

export function computeEndDate(startDate: Date, time?: number): Date {
  if (time) {
    return dayjs(startDate).add(time, "milliseconds").toDate();
  } else {
    return startDate;
  }
}
