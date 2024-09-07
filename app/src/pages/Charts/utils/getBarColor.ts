import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { Theme } from "@mui/material";

export function getBarColor(entryTypeId: EntryTypeId, theme: Theme) {
  return theme.palette.primary.main;
}
