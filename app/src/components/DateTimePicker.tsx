import { Box, InputAdornment, Stack } from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type DateTimePickerProps = {
  layout: "row" | "column";
};

export function DateTimePicker(props: DateTimePickerProps) {
  return (
    <Stack direction={props.layout} justifyContent={"center"} gap={1}>
      <DatePicker icon="left" />
      <TimePicker icon="left" />
    </Stack>
  );
}
