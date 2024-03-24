import { Box, Stack } from "@mui/material";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import { DateHeader } from "@/components/DateHeader";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryType } from "@/pages/Entries/enums/EntryType";
import React from "react";

type Props = {
  date: Date;
  entries: Entry[];
};

export function DateEntriesHeader(props: Props) {
  const entries = [...props.entries];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.entryType === EntryType.Diaper) {
      if ((entry.poopAmount ?? 0) > 0) {
        entries.push({
          ...entry,
          id: `${entry.id}-poop`,
          entryType: EntryType.Poop,
        });
      }
      if ((entry.urineAmount ?? 0) > 0) {
        entries.push({
          ...entry,
          id: `${entry.id}-urine`,
          entryType: EntryType.Urine,
        });
      }
    }
  }
  const entriesByEntryType: Record<string, Entry[]> | null =
    entries.length > 0
      ? entries.reduce((acc, entry) => {
          if (!acc[entry.entryType]) {
            acc[entry.entryType] = [];
          }
          acc[entry.entryType].push(entry);
          return acc;
        }, {} as Record<string, Entry[]>)
      : {};
  return (
    <Stack>
      <DateHeader date={props.date} />
      {entriesByEntryType != null && (
        <Box
          sx={{
            width: "100%",
            overflowX: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            paddingBottom: 1,
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            {/* <ActivityChip
              entryType={props.entries[0].entryType}
              entries={props.entries}
            /> */}
            {Object.keys(entriesByEntryType).map((entryType) => {
              return (
                <ActivityChip
                  key={entryType}
                  entryType={entryType as any}
                  entries={entriesByEntryType[entryType]}
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
