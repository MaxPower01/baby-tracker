import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";

export function getDatapointValue(id: string, datapoints: BarChartDatapoint[]) {
  const dataPoint = datapoints.find((d) => d.id === id);
  return dataPoint ? dataPoint.value : 0;
}
