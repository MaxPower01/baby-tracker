import { FiltersPicker } from "@/pages/History/components/FiltersPicker";
import React from "react";
import { SearchRangePicker } from "@/pages/History/components/SearchRangePicker";
import { Stack } from "@mui/material";

export function SearchFiltersToolbar() {
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={1}
    >
      <SearchRangePicker
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
