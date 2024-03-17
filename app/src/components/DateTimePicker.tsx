import {
  Box,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { DatePicker } from "@/components/DatePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React from "react";
import { TimePicker } from "@/components/TimePicker";

type Props = {
  layout: "row" | "column";
  iconPostion: "left" | "right";
  align: "left" | "right";
  relation?: "start" | "end";
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  time: Dayjs;
  setTime: React.Dispatch<React.SetStateAction<Dayjs>>;
};

export function DateTimePicker(props: Props) {
  const theme = useTheme();
  return (
    <Stack direction={props.layout} justifyContent={"center"}>
      {props.relation && (
        <Typography
          variant="body1"
          sx={{
            color: theme.customPalette.text.tertiary,
            textAlign: props.align,
            paddingLeft: props.align === "left" ? 2 : 0,
            paddingRight: props.align === "right" ? 2 : 0,
          }}
          gutterBottom
        >
          {props.relation === "start" ? "Début" : "Fin"}
        </Typography>
      )}
      <DatePicker
        icon={props.iconPostion}
        align={props.align}
        value={props.date}
        setValue={props.setDate}
      />
      <TimePicker
        icon={props.iconPostion}
        align={props.align}
        value={props.time}
        setValue={props.setTime}
      />
    </Stack>
  );
}
