import { EntriesWidgetItemBody } from "@/pages/Home/components/EntriesWidgetItemBody";
import { EntriesWidgetItemFooter } from "@/pages/Home/components/EntriesWidgetItemFooter";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { Stack } from "@mui/material";
import { entryHasStopwatchRunning } from "@/pages/Entry/utils/entryHasStopwatchRunning";

type Props = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  padding: number;
  width: string;
};

export function EntriesWidgetItem(props: Props) {
  return (
    <Stack
      sx={{
        order:
          props.mostRecentEntryOfType == null
            ? 2
            : entryHasStopwatchRunning(props.mostRecentEntryOfType)
            ? 1
            : 2,
      }}
    >
      <EntriesWidgetItemBody
        entryType={props.entryType}
        padding={props.padding}
        width={props.width}
        mostRecentEntryOfType={props.mostRecentEntryOfType}
      />
      <EntriesWidgetItemFooter
        entryType={props.entryType}
        width={props.width}
        padding={props.padding}
        mostRecentEntryOfType={props.mostRecentEntryOfType}
      />
    </Stack>
  );
}
