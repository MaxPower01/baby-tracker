import { Dayjs } from "dayjs";

export function getStopwatchTime(data: Date | Dayjs | number) {
  let result = 0;
  if (data instanceof Date) {
    result =
      data.getMilliseconds() +
      data.getSeconds() * 1000 +
      data.getMinutes() * 60 * 1000 +
      data.getHours() * 60 * 60 * 1000;
  } else if (data instanceof Dayjs) {
    result =
      data.millisecond() +
      data.second() * 1000 +
      data.minute() * 60 * 1000 +
      data.hour() * 60 * 60 * 1000;
  } else {
    result = data;
  }
  return result;
}
