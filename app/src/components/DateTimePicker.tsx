import {
  Box,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type DateTimePickerProps = {
  layout: "row" | "column";
  iconPostion: "left" | "right";
  align: "left" | "right";
  relation?: "start" | "end";
};

export function DateTimePicker(props: DateTimePickerProps) {
  const theme = useTheme();
  return (
    <Stack direction={props.layout} justifyContent={"center"} gap={1}>
      {props.relation && (
        <Typography
          variant="body2"
          sx={{
            color: theme.customPalette.text.tertiary,
            textAlign: props.align,
          }}
        >
          {props.relation === "start" ? "Début" : "Fin"}
        </Typography>
      )}
      <DatePicker icon={props.iconPostion} align={props.align} />
      <TimePicker icon={props.iconPostion} align={props.align} />
    </Stack>
  );
}
