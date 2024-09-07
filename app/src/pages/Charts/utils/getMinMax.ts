import * as d3 from "d3";

import { Datapoint } from "@/pages/Charts/types/Datapoint";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";

export function getMinMax(
  datapoints: Datapoint[],
  yAxisType: YAxisType,
  xAxisUnit: XAxisUnit
) {
  const getMax = () => {
    const maxValue = d3.max(datapoints, (d) => d.value) as number;
    if (yAxisType === "duration") {
      if (xAxisUnit === "hours") {
        if (maxValue >= 60) {
          return Math.max(maxValue, 60);
        } else if (maxValue >= 45) {
          return 60;
        } else if (maxValue >= 30) {
          return 45;
        } else if (maxValue >= 15) {
          return 30;
        } else if (maxValue >= 5) {
          return 15;
        } else {
          return 5;
        }
      }
    }
    return maxValue;
  };

  const min = 0;
  const max = getMax();

  return { min, max };
}
