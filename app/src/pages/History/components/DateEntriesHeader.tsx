import { Box, Stack, useTheme } from "@mui/material";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import { DateHeader } from "@/components/DateHeader";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import React from "react";

type Props = {
  date: Date;
  entries: Entry[];
};

export function DateEntriesHeader(props: Props) {
  const entries = [...props.entries];
  const theme = useTheme();
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.entryTypeId === EntryTypeId.Diaper) {
      if ((entry.poopAmount ?? 0) > 0) {
        entries.push({
          ...entry,
          id: `${entry.id}-poop`,
          entryTypeId: EntryTypeId.Poop,
        });
      }
      if ((entry.urineAmount ?? 0) > 0) {
        entries.push({
          ...entry,
          id: `${entry.id}-urine`,
          entryTypeId: EntryTypeId.Urine,
        });
      }
    }
  }
  const entriesByEntryType: Record<string, Entry[]> | null =
    entries.length > 0
      ? entries.reduce((acc, entry) => {
          if (!acc[entry.entryTypeId]) {
            acc[entry.entryTypeId] = [];
          }
          acc[entry.entryTypeId].push(entry);
          return acc;
        }, {} as Record<string, Entry[]>)
      : {};
  return (
    <Stack spacing={0.5}>
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
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            {Object.keys(entriesByEntryType).map((entryType) => {
              return (
                <ActivityChip
                  key={entryType}
                  entryType={entryType as any}
                  entries={entriesByEntryType[entryType]}
                  overrideIconOpacity={theme.opacity.tertiary}
                />
              );
            })}
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
