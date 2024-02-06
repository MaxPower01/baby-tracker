import { Box, InputAdornment, Stack } from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type DateTimeRangePickerProps = {};

export function DateTimeRangePicker(props: DateTimeRangePickerProps) {
  return (
    <Stack
      direction={"row"}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction={"column"}>
        <DatePicker icon="left" />
        <TimePicker icon="left" />
      </Stack>
      <Stack direction={"column"}>
        <DatePicker icon="right" />
        <TimePicker icon="right" />
      </Stack>
    </Stack>
  );
}
