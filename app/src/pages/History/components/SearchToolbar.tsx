import React, { useState } from "react";

import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FiltersPicker } from "@/pages/History/components/FiltersPicker";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { TimePeriodPicker } from "@/pages/History/components/TimePeriodPicker";

type Props = {
  timePeriodId: TimePeriodId;
  setTimePeriodId: React.Dispatch<React.SetStateAction<TimePeriodId>>;
  selectedEntryTypes: EntryTypeId[];
  setSelectedEntryTypes: React.Dispatch<React.SetStateAction<EntryTypeId[]>>;
  selectedSortOrder: SortOrderId;
  setSelectedSortOrder: React.Dispatch<React.SetStateAction<SortOrderId>>;
};

export function SearchToolbar(props: Props) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={1}
    >
      <TimePeriodPicker
        value={props.timePeriodId}
        setValue={props.setTimePeriodId}
        sx={{
          flexGrow: 1,
        }}
      />
      <FiltersPicker
        selectedEntryTypes={props.selectedEntryTypes}
        setSelectedEntryTypes={props.setSelectedEntryTypes}
        selectedSortOrder={props.selectedSortOrder}
        setSelectedSortOrder={props.setSelectedSortOrder}
        sx={{
          flexShrink: 0,
        }}
      />
    </Stack>
  );
}
