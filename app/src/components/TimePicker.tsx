import { AccessTime } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { MobileTimePicker as MUIMobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import React from "react";
import dayjs from "dayjs";

type TimePickerProps = {
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
            startAdornment: props.icon ? (
              <InputAdornment
                position={props.icon === "left" ? "start" : "end"}
              >
                <AccessTime />
              </InputAdornment>
            ) : undefined,
            size: "small",
            inputProps: {
              style: {
                width: "3em",
              },
            },
          },
        },
      }}
    />
  );
}
