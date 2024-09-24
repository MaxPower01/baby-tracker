import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";
import { getChartColor } from "@/pages/Charts/utils/getChartColor";

export function getChartLegendTextColor(props: {
  entryTypeId: EntryTypeId;
  theme: Theme;
  category?: DatapointCategory;
}) {
  const color = getChartColor(props.entryTypeId, props.category);
  if (props.category != null) {
    if (props.category === DatapointCategory.Right) {
      return props.theme.customPalette[color][100];
    }
  }
  return props.theme.customPalette[color][100];
}
