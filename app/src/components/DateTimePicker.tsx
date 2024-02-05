import { Box, InputAdornment, Stack } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker as MUIMobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { MobileTimePicker as MUIMobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import React from "react";
import dayjs from "dayjs";

type DatePickerProps = {
  icon?: "left" | "right";
};

function DatePicker(props: DatePickerProps) {
  return (
    <MUIMobileDatePicker
      defaultValue={dayjs()}
      localeText={{
        toolbarTitle: "Sélectionner la date",
      }}
    />
  );
}

type TimePickerProps = {
  icon?: "left" | "right";
};

function TimePicker(props: TimePickerProps) {
  return (
    <MUIMobileTimePicker
      defaultValue={dayjs()}
      ampm={false}
      localeText={{
        toolbarTitle: "Sélectionner l'heure",
      }}
    />
  );
}

type DateTimePickerProps = {
  hasDuration?: boolean;
};

export function DateTimePicker(props: DateTimePickerProps) {
  if (props.hasDuration) {
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
  } else {
    return (
      <Stack
        direction={"row"}
        sx={{ justifyContent: "center", alignItems: "center" }}
        gap={2}
      >
        <DatePicker icon="left" />
        <TimePicker icon="left" />
      </Stack>
    );
  }
}
