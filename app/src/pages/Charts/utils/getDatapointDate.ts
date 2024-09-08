import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";

export function getDatapointDate(id: string, datapoints: BarChartDatapoint[]) {
  const dataPoint = datapoints.find((d) => d.id === id);
  return dataPoint ? dataPoint.date : new Date();
}
