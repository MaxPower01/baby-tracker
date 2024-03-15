import { Box, InputAdornment, Stack } from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type Props = {
  startDate: Dayjs;
  setStartDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  startTime: Dayjs;
  setStartTime: React.Dispatch<React.SetStateAction<Dayjs>>;
  endDate: Dayjs;
  setEndDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  endTime: Dayjs;
  setEndTime: React.Dispatch<React.SetStateAction<Dayjs>>;
};

export function DateTimeRangePicker(props: Props) {
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
        date={props.startDate}
        setDate={props.setStartDate}
        time={props.startTime}
        setTime={props.setStartTime}
      />
      <DateTimePicker
        layout="column"
        iconPostion="right"
        align="right"
        relation="end"
        date={props.endDate}
        setDate={props.setEndDate}
        time={props.endTime}
        setTime={props.setEndTime}
      />
    </Stack>
  );
}
