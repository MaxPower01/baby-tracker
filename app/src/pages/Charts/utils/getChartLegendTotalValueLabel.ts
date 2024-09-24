import { ChartLegendItemProps } from "@/pages/Charts/components/ChartLegendItem";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";
import formatStopwatchTime from "@/utils/formatStopwatchTime";

export function getChartLegendTotalValueLabel(props: {
  entryType: EntryTypeId;
  yAxisUnit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  legendItems: ChartLegendItemProps[];
}): string {
  const value = props.legendItems.reduce((acc, item) => acc + item.value, 0);
  switch (props.yAxisType) {
    case "count":
      return `${value}`;
    case "duration":
      return `${formatStopwatchTime(
        value * 60 * 1000,
        true,
        false,
        true,
        true
      )}`;
    case "volume":
      return `${value} ml`;
    default:
      return "";
  }
}
