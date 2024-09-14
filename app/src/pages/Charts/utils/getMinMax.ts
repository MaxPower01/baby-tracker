import * as d3 from "d3";

import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import { StackedBarChartDatapoint } from "@/pages/Charts/types/StackedBarChartDatapoint";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";

export function getMinMax(
  datapoints: Array<BarChartDatapoint | StackedBarChartDatapoint>,
  yAxisType: YAxisType,
  xAxisUnit: XAxisUnit
) {
  if (!datapoints || datapoints.length === 0) {
    return { min: 0, max: 0 };
  }

  const isStacked =
    (datapoints[0] as StackedBarChartDatapoint).dateISOString !== undefined;

  const getMax = () => {
    const maxValue = isStacked
      ? // get max for each date
        (d3.max(datapoints, (d) => {
          const dateISOString = (d as StackedBarChartDatapoint).dateISOString;
          return d3.sum(
            datapoints.filter(
              (dp) =>
                (dp as StackedBarChartDatapoint).dateISOString === dateISOString
            ),
            (dp) => dp.value
          );
        }) as number)
      : (d3.max(datapoints, (d) => d.value) as number);
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
