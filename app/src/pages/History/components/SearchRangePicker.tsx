import {
  Box,
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
import { TemperatureMethodId } from "@/enums/TemperatureMethodId";
import { getSearchRangePickerItems } from "@/utils/getSearchRangePickerItems";

type Props = {
  sx?: SxProps;
};

export function SearchRangePicker(props: Props) {
  const items = getSearchRangePickerItems();
  const theme = useTheme();
  const [selected, setSelected] = React.useState<string>(
    items?.length ? items[0].id : ""
  );

  const renderValue = (selected: string | null) => {
    if (selected === null) {
      return "";
    }
    const item = items.find((item) => item.id === selected);
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
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value)}
          renderValue={renderValue}
        >
          {items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <ListItemText primary={item.label} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
