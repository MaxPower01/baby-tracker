import { AccessTime } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { MobileTimePicker as MUIMobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import React from "react";
import dayjs from "dayjs";

type TimePickerProps = {
  align: "left" | "right";
  icon?: "left" | "right";
};
export function TimePicker(props: TimePickerProps) {
  return (
    <MUIMobileTimePicker
      defaultValue={dayjs()}
      ampm={false}
      localeText={{
        toolbarTitle: "Sélectionner l'heure",
      }}
      slotProps={{
        textField: {
          InputProps: {
            startAdornment:
              props.icon === "left" ? (
                <InputAdornment position={"start"}>
                  <AccessTime />
                </InputAdornment>
              ) : undefined,
            endAdornment:
              props.icon === "right" ? (
                <InputAdornment position={"end"}>
                  <AccessTime />
                </InputAdornment>
              ) : undefined,
            size: "small",
          },
          sx: {
            width: "100%",
            alignItems: props.align === "left" ? "flex-start" : "flex-end",
            "& fieldset": {
              borderColor: "transparent",
            },
            "& input": {
              width: "3em",
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
