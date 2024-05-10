import { Box, Stack, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";

import ActivityChip from "@/pages/Activities/components/ActivityChip";
import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
  selectedEntryTypes?: EntryTypeId[];
  setSelectedEntryTypes?: React.Dispatch<React.SetStateAction<EntryTypeId[]>>;
  readonly?: boolean;
};

export function EntryTypeChips(props: Props) {
  const theme = useTheme();
  const entries = [...props.entries];
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

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  // const [selectedEntryTypes, setSelectedEntryTypes] = useState<EntryTypeId[]>(
  //   props.selectedEntryTypes ?? []
  // );

  const toggleEntryType = useCallback(
    (entryTypeId: EntryTypeId) => {
      const isSelected = props.selectedEntryTypes?.includes(entryTypeId);
      if (isSelected) {
        // setSelectedEntryTypes((prev) => {
        //   if (!prev || !prev.length) {
        //     return prev;
        //   } else if (prev.length === 1) {
        //     return [];
        //   } else {
        //     return prev.filter((id) => id !== entryTypeId);
        //   }
        // });
        if (props.setSelectedEntryTypes) {
          props.setSelectedEntryTypes((prev) => {
            if (!prev || !prev.length) {
              return prev;
            } else if (prev.length === 1) {
              return [];
            } else {
              return prev.filter((id) => id !== entryTypeId);
            }
          });
        }
      } else {
        // setSelectedEntryTypes((prev) => {
        //   return [...prev, entryTypeId];
        // });
        if (props.setSelectedEntryTypes) {
          props.setSelectedEntryTypes((prev) => {
            return [...prev, entryTypeId];
          });
        }
      }
    },
    [props]
  );

  if (entriesByEntryType == null) {
    return null;
  }
  return (
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
        {entryTypesOrder.map((entryTypeId) => {
          const entriesForEntryType = entriesByEntryType[entryTypeId];
          if (!entriesForEntryType) {
            return null;
          }
          return (
            <ActivityChip
              key={entryTypeId}
              isSelected={
                props.readonly
                  ? false
                  : props.selectedEntryTypes?.includes(entryTypeId)
              }
              entryType={entryTypeId as any}
              entries={entriesForEntryType}
              onClick={props.readonly ? undefined : toggleEntryType}
              readonly={props.readonly}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
