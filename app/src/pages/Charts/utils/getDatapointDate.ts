import { Datapoint } from "@/pages/Charts/types/Datapoint";

export function getDatapointDate(id: string, datapoints: Datapoint[]) {
  const dataPoint = datapoints.find((d) => d.id === id);
  return dataPoint ? dataPoint.date : new Date();
}
