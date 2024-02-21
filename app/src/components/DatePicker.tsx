import { InputAdornment, Stack, useTheme } from "@mui/material";

import { CalendarToday } from "@mui/icons-material";
import { MobileDatePicker as MUIMobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import React from "react";
import dayjs from "dayjs";

type DatePickerProps = {
  icon?: "left" | "right";
};

export function DatePicker(props: DatePickerProps) {
  return (
    <MUIMobileDatePicker
      defaultValue={dayjs()}
      localeText={{
        toolbarTitle: "Sélectionner la date",
      }}
      slotProps={{
        textField: {
          InputProps: {
            startAdornment: props.icon ? (
              <InputAdornment
                position={props.icon === "left" ? "start" : "end"}
              >
                <CalendarToday />
              </InputAdornment>
            ) : undefined,
            size: "small",
            inputProps: {
              style: {
                width: "5.5em",
              },
            },
          },
        },
      }}
    />
  );
}
