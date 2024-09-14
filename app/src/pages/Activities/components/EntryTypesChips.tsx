import { Box, Stack, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";

import { Entry } from "@/pages/Entry/types/Entry";
import { EntryTypeChip } from "@/pages/Activities/components/EntryTypeChip";
import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { selectEntryTypesOrder } from "@/state/slices/settingsSlice";
import { useAppDispatch } from "@/state/hooks/useAppDispatch";
import { useFilters } from "@/components/Filters/FiltersProvider";
import { useSelector } from "react-redux";

type Props = {
  entries: Entry[];
  readonly?: boolean;
  useFiltersEntryTypes?: boolean;
  useChipLabel?: boolean;
};

export function EntryTypesChips(props: Props) {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const entryTypesOrder = useSelector(selectEntryTypesOrder);

  const { entryTypes, toggleEntryType } = useFilters();

  const sortedEntryTypes = entryTypesOrder.filter((entryTypeId) =>
    entryTypes.includes(entryTypeId)
  );

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

  let localEntryTypes = [];

  if (!props.useFiltersEntryTypes || props.readonly) {
    localEntryTypes = entryTypesOrder.filter(
      (entryTypeId) => entriesByEntryType[entryTypeId]
    );
  } else {
    localEntryTypes = (sortedEntryTypes ?? []).concat(
      entryTypesOrder.filter(
        (entryTypeId) => !sortedEntryTypes.includes(entryTypeId)
      )
    );
  }

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
        {localEntryTypes.map((entryTypeId) => {
          const entriesForEntryType = entriesByEntryType[entryTypeId];
          const isSelectedEntryType = entryTypes?.includes(entryTypeId);
          if (!entriesForEntryType && !isSelectedEntryType) {
            return null;
          }
          return (
            <EntryTypeChip
              key={entryTypeId}
              isSelected={
                props.readonly || !props.useFiltersEntryTypes
                  ? false
                  : entryTypes?.includes(entryTypeId)
              }
              entryType={entryTypeId as any}
              entries={entriesForEntryType}
              onClick={props.readonly ? undefined : toggleEntryType}
              readonly={props.readonly}
              useChipLabel={props.useChipLabel}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
