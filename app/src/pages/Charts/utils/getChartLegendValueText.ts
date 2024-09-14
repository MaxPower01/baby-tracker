import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";
import formatStopwatchTime from "@/utils/formatStopwatchTime";

export function getChartLegendValueText(props: {
  entryType: EntryTypeId;
  yAxisunit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  category?: DatapointCategory;
  value: number;
}): string {
  let result = "";

  switch (props.yAxisType) {
    case "count":
      result = `${props.value}`;
      break;
    case "duration":
      result = formatStopwatchTime(
        props.value * 60 * 1000,
        true,
        false,
        true,
        true
      );
      break;
    case "volume":
      result = `${props.value} ml`;
      break;
    default:
      break;
  }

  return result;
}
