import * as d3 from "d3";

import { StackedBarChartDatapoint } from "@/pages/Charts/types/StackedBarChartDatapoint";

export function getStackedBarChartSeries(
  datapoints: StackedBarChartDatapoint[]
) {
  return d3
    .stack()
    .keys(d3.union(datapoints.map((d) => d.category)))
    .value(([, D]: any, key) => D.get(key).value)(
    d3.index(
      datapoints,
      (d) => d.date,
      (d) => d.category
    ) as any
  );
}
