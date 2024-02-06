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
    />
  );
}
