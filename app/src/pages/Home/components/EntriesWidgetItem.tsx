import { EntriesWidgetItemBody } from "@/pages/Home/components/EntriesWidgetItemBody";
import { EntriesWidgetItemFooter } from "@/pages/Home/components/EntriesWidgetItemFooter";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";
import { Stack } from "@mui/material";

type Props = {
  entryType: EntryTypeId;
  mostRecentEntryOfType: Entry | undefined;
  padding: number;
  width: string;
};

export function EntriesWidgetItem(props: Props) {
  return (
    <Stack>
      <EntriesWidgetItemBody
        key={props.entryType}
        entryType={props.entryType}
        padding={props.padding}
        width={props.width}
        mostRecentEntryOfType={props.mostRecentEntryOfType}
      />
      <EntriesWidgetItemFooter
        key={props.entryType}
        entryType={props.entryType}
        width={props.width}
        padding={props.padding}
        mostRecentEntryOfType={props.mostRecentEntryOfType}
      />
    </Stack>
  );
}
