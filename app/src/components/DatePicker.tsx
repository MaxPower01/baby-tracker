import { InputAdornment, Stack, useTheme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

import { CalendarToday } from "@mui/icons-material";
import { MobileDatePicker as MUIMobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import React from "react";

type Props = {
  icon?: "left" | "right";
  align: "left" | "right";
  value: Dayjs;
  setValue: React.Dispatch<React.SetStateAction<Dayjs>>;
};

export function DatePicker(props: Props) {
  const handleChange = (newDate: Dayjs | null) => {
    if (newDate) {
      props.setValue(newDate);
    }
  };
  return (
    <MUIMobileDatePicker
      value={props.value}
      onChange={handleChange}
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
            "& *": {
              cursor: "pointer",
            },
          },
        },
      }}
    />
  );
}
