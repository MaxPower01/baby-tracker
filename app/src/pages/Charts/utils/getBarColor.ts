import { DatapointCategory } from "@/pages/Charts/enums/DatapointCategory";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";

export function getBarColor(
  entryTypeId: EntryTypeId,
  theme: Theme,
  category?: DatapointCategory
) {
  if (category != null) {
    if (category === DatapointCategory.Right) {
      return "#8BC34A";
    }
  }
  return theme.palette.primary.main;
}
