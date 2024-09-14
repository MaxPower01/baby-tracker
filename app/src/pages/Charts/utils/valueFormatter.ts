import { TimePeriodId } from "@/enums/TimePeriodId";
import formatStopwatchTime from "@/utils/formatStopwatchTime";

export function valueFormatter(
  value: number | Date,
  axis: "x" | "y",
  timePeriod: TimePeriodId,
  xAxisUnit: string,
  yAxisType: string,
  yAxisUnit: string
) {
  if (typeof value === "number") {
    if (yAxisType === "volume") {
      return `${value} ml`;
    }

    if (yAxisType === "duration") {
      const milliseconds = value * 60 * 1000;
      const hours = Math.floor(milliseconds / 3600000);
      if (yAxisUnit === "hours") {
        return `${hours} h`;
      }
      if (axis === "x") {
        return formatStopwatchTime(milliseconds, true, false, true, true);
      }
      return formatStopwatchTime(milliseconds, false, false, true, true);
    }

    return value.toFixed();
  }

  if (xAxisUnit === "hours") {
    if (
      timePeriod == TimePeriodId.Last2Days ||
      timePeriod == TimePeriodId.Last24Hours
    ) {
      return value.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
      });
    }

    return value.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return value.toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
  });
}
