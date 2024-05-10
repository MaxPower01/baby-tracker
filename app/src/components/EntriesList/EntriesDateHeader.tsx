import { Box, Stack, useTheme } from "@mui/material";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import { DateHeader } from "@/components/DateHeader";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChips } from "@/pages/Activities/components/EntryTypeChips";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  date: Date;
  entries: Entry[];
};

export function EntriesDateHeader(props: Props) {
  return (
    <Stack spacing={0.5}>
      <DateHeader date={props.date} />
      <EntryTypeChips entries={props.entries} readonly />
    </Stack>
  );
}
