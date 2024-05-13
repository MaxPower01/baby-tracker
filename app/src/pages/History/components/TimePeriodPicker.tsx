import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  SxProps,
  useTheme,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import React from "react";
import { TimePeriodId } from "@/enums/TimePeriodId";
import { getTimePeriodPickerItems } from "@/utils/getTimePeriodPickerItems";

type Props = {
  sx?: SxProps;
  value: TimePeriodId;
  setValue: React.Dispatch<React.SetStateAction<TimePeriodId>>;
};

export function TimePeriodPicker(props: Props) {
  const items = getTimePeriodPickerItems();
  const theme = useTheme();

  const renderValue = (selected: TimePeriodId | null) => {
    if (selected === null) {
      return "";
    }
    const item = items.find((item) => item.id == selected);
    if (item === undefined) {
      return "";
    }
    return (
      <Stack direction={"row"} spacing={1} alignItems={"center"}>
        <CalendarTodayIcon
          sx={{
            color: theme.palette.action.active,
          }}
        />
        <ListItemText primary={item.label} />
      </Stack>
    );
  };

  if (!items.length) {
    return null;
  }

  return (
    <Box
      sx={{
        ...props.sx,
      }}
    >
      <FormControl fullWidth variant="outlined">
        <Select
          id="search-range-picker"
          labelId="search-range-picker-label"
          value={props.value ?? ""}
          onChange={(e) => {
            props.setValue(e.target.value as TimePeriodId);
          }}
          renderValue={renderValue}
        >
          {items.map((item) => {
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                sx={{
                  borderTop: "1px solid",
                  borderTopColor: item.divider
                    ? theme.palette.divider
                    : "transparent",
                }}
              >
                <ListItemText primary={item.label} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
