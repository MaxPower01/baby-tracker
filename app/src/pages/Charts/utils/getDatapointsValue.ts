import { BarChartDatapoint } from "@/pages/Charts/types/BarChartDatapoint";
import { StackedBarChartDatapoint } from "@/pages/Charts/types/StackedBarChartDatapoint";
import { isNullOrWhiteSpace } from "@/utils/utils";
import { sum } from "d3";

export function getDatapointsValue(props: {
  id?: string;
  dateISOString?: string;
  datapoints: Array<BarChartDatapoint | StackedBarChartDatapoint>;
}) {
  if (!props.datapoints) {
    return 0;
  }
  if (!props.id && !props.dateISOString) {
    return sum(props.datapoints.map((d) => d.value));
  }
  const datapoints = props.datapoints.filter((d) => {
    if (!isNullOrWhiteSpace(props.id)) {
      return d.id === props.id;
    }
    if (
      !isNullOrWhiteSpace(props.dateISOString) &&
      (d as StackedBarChartDatapoint).dateISOString
    ) {
      return (
        (d as StackedBarChartDatapoint).dateISOString === props.dateISOString
      );
    }
    return false;
  });
  if (datapoints.length === 0) {
    return 0;
  }
  return sum(datapoints.map((d) => d.value));
}
