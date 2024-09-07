import { TimePeriodId } from "@/enums/TimePeriodId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { getDaysCountForTimePeriod } from "@/pages/Charts/utils/getDaysCountForTimePeriod";
import { getHoursCountForTimePeriod } from "@/pages/Charts/utils/getHoursCountForTimePeriod";

export function getBarsCount(timePeriod: TimePeriodId, xAxisUnit: XAxisUnit) {
  return xAxisUnit === "hours"
    ? getHoursCountForTimePeriod(timePeriod)
    : getDaysCountForTimePeriod(timePeriod);
}
