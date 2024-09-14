import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";
import { getColor } from "@/pages/Charts/utils/getColor";

export function getChartLegendTextColor(props: {
  entryTypeId: EntryTypeId;
  theme: Theme;
  category?: DatapointCategory;
}) {
  const color = getColor(props.entryTypeId, props.category);
  if (props.category != null) {
    if (props.category === DatapointCategory.Right) {
      return props.theme.customPalette[color][100];
    }
  }
  return props.theme.customPalette[color][100];
}
