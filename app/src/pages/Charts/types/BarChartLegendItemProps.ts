import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisUnit } from "@/types/YAxisUnit";

export interface BarChartLegendItemProps {
  entryType: EntryTypeId;
  yAxisunit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  side?: "left" | "right";
  dotColor: string;
  textColor: string;
  value: number;
}
