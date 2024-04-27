import { FiltersPicker } from "@/pages/History/components/FiltersPicker";
import React from "react";
import { Stack } from "@mui/material";
import { TimePeriodPicker } from "@/pages/History/components/TimePeriodPicker";

export function SearchToolbar() {
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
