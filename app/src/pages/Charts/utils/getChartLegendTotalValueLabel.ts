import { ChartLegendItemProps } from "@/pages/Charts/components/ChartLegendItem";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";

export function getChartLegendTotalValueLabel(props: {
  entryType: EntryTypeId;
  yAxisUnit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  legendItems: ChartLegendItemProps[];
}): string {
  let result = "";
  return result;
}
