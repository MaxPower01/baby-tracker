import { ChartLegendItemProps } from "@/pages/Charts/components/ChartLegendItem";
import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";
import { getBarColor } from "@/pages/Charts/utils/getBarColor";
import { getChartLegendText } from "@/pages/Charts/utils/getChartLegendText";
import { getChartLegendTextColor } from "@/pages/Charts/utils/getChartLegendTextColor";
import { getChartLegendValueText } from "@/pages/Charts/utils/getChartLegendValueText";

export function getChartLegendItem(props: {
  entryType: EntryTypeId;
  yAxisUnit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  category?: DatapointCategory;
  value: number;
  theme: Theme;
}): ChartLegendItemProps {
  return {
    dotColor: getBarColor({
      entryTypeId: props.entryType,
      theme: props.theme,
      category: props.category,
    }),
    textColor: getChartLegendTextColor({
      entryTypeId: props.entryType,
      theme: props.theme,
      category: props.category,
    }),
    labelText: getChartLegendText({ ...props }),
    valueText: getChartLegendValueText({ ...props }),
    value: props.value,
  };
}
