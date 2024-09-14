import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";

export function getYAxisTicksCount(
  max: number,
  yAxisType: YAxisType,
  xAxisUnit: XAxisUnit
) {
  if (max <= 5) {
    return max;
  }
  if (yAxisType === "duration") {
    if (xAxisUnit === "hours") {
      if (max > 60) {
        return undefined;
      } else if (max > 45) {
        return 12;
      } else if (max > 30) {
        return 9;
      } else if (max > 15) {
        return 6;
      } else if (max > 5) {
        return 3;
      } else {
        return undefined;
      }
    }
    return undefined;
  }
  return undefined;
}
