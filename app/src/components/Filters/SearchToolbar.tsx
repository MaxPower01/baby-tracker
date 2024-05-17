import React, { useState } from "react";

import { EntryTypeId } from "@/pages/Entry/enums/EntryTypeId";
import { FiltersPicker } from "@/components/Filters/FiltersPicker";
import { SortOrderId } from "@/enums/SortOrderId";
import { Stack } from "@mui/material";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { TimePeriodPicker } from "@/components/Filters/TimePeriodPicker";

type Props = {};

export function SearchToolbar(props: Props) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={1}
    >
      <TimePeriodPicker
        sx={{
          flexGrow: 1,
        }}
      />
      <FiltersPicker
        sx={{
          flexShrink: 0,
        }}
      />
    </Stack>
  );
}
