import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";
import { getColor } from "@/pages/Charts/utils/getColor";

export function getLegendTextColor(
  entryTypeId: EntryTypeId,
  theme: Theme,
  category?: DatapointCategory
) {
  const color = getColor(entryTypeId, category);
  if (category != null) {
    if (category === DatapointCategory.Right) {
      return theme.customPalette[color][100];
    }
  }
  return theme.customPalette[color][100];
}
