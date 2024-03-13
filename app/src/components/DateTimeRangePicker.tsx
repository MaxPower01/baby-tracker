import { Box, InputAdornment, Stack } from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { DateTimePicker } from "@/components/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type DateTimeRangePickerProps = {};

export function DateTimeRangePicker(props: DateTimeRangePickerProps) {
  return (
    <Stack
      direction={"row"}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <DateTimePicker
        layout="column"
        iconPostion="left"
        align="left"
        relation="start"
      />
      <DateTimePicker
        layout="column"
        iconPostion="right"
        align="right"
        relation="end"
      />
    </Stack>
  );
}
