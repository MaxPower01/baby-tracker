import { InputAdornment, Stack, useTheme } from "@mui/material";

import { CalendarToday } from "@mui/icons-material";
import { MobileDatePicker as MUIMobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import React from "react";
import dayjs from "dayjs";

type DatePickerProps = {
  icon?: "left" | "right";
  align: "left" | "right";
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
            startAdornment:
              props.icon === "left" ? (
                <InputAdornment position={"start"}>
                  <CalendarToday />
                </InputAdornment>
              ) : undefined,
            endAdornment:
              props.icon === "right" ? (
                <InputAdornment position={"end"}>
                  <CalendarToday />
                </InputAdornment>
              ) : undefined,
            size: "small",
          },
          sx: {
            width: "100%",
            alignItems: "center",
            justifyContent: props.align === "left" ? "flex-start" : "flex-end",
            "& fieldset": {
              borderColor: "transparent",
            },
            "& input": {
              width: "5.5em",
              alignItems: "center",
              justifyContent:
                props.align === "left" ? "flex-start" : "flex-end",
              paddingTop: 0.5,
              paddingBottom: 0.5,
            },
          },
        },
      }}
    />
  );
}
