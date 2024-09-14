import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";
import { XAxisUnit } from "@/types/XAxisUnit";
import { YAxisType } from "@/types/YAxisType";
import { YAxisUnit } from "@/types/YAxisUnit";

export function getChartLegendText(props: {
  entryType: EntryTypeId;
  yAxisunit: YAxisUnit;
  xAxisUnit: XAxisUnit;
  yAxisType: YAxisType;
  category?: DatapointCategory;
  value: number;
  theme: Theme;
}) {
  let result = "";

  switch (props.yAxisType) {
    case "count":
      result = "Fréquence";
      break;
    case "duration":
      result = "Durée";
      break;
    case "volume":
      result = "Volume";
      break;
    default:
      break;
  }

  if (props.category == DatapointCategory.Left) {
    result += " (côté gauche)";
  } else if (props.category == DatapointCategory.Right) {
    result += " (côté droit)";
  }

  return result;
}
