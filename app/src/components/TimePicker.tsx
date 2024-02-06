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
    />
  );
}
