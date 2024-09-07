import { Datapoint } from "@/pages/Charts/types/Datapoint";

export function getDatapointValue(id: string, datapoints: Datapoint[]) {
  const dataPoint = datapoints.find((d) => d.id === id);
  return dataPoint ? dataPoint.value : 0;
}
